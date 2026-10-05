const XUONG_SKILL_WEBHOOK = "https://xuongskillai.vercel.app/api/sepay-webhook";
const reply = (res, body, status = 200) => {
  res.setHeader("cache-control", "no-store");
  return res.status(status).json(body);
};
const parseBody = req => {
  if (req.body && typeof req.body === "object") return req.body;
  try { return JSON.parse(req.body); } catch { return null; }
};
const codeFrom = body => [body?.code, body?.content, body?.description]
  .filter(value => typeof value === "string")
  .join(" ")
  .match(/\b(?:FT[A-F0-9]{10}|XS\d{6})\b/i)?.[0]?.toUpperCase() || null;
const db = (url, key, path, options = {}) => fetch(`${url.replace(/\/$/, "")}/rest/v1/${path}`, {
  ...options,
  headers: { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json", ...options.headers },
});

async function authenticateWithXuongSkill(body, authorization) {
  const response = await fetch(XUONG_SKILL_WEBHOOK, {
    method: "POST",
    headers: { authorization, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  return { response, text };
}

async function processFinancialTwin(body, res) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return reply(res, { success: false, message: "Server is not configured" }, 500);
  if (body.transferType !== "in") return reply(res, { success: true, matched: false });

  const transactionId = String(body.id || "");
  const amount = Number(body.transferAmount);
  const code = codeFrom(body);
  if (!/^\d+$/.test(transactionId) || !Number.isSafeInteger(amount) || amount <= 0 || !code?.startsWith("FT")) {
    return reply(res, { success: true, matched: false });
  }

  const query = new URLSearchParams({
    select: "ma_don,device_id,plan,so_tien_vnd,so_ngay,trang_thai,sepay_transaction_id",
    ma_don: `eq.${code}`,
    limit: "1",
  });
  const orderResult = await db(url, key, `financial_twin_orders?${query}`);
  if (!orderResult.ok) return reply(res, { success: false, message: "Database error" }, 500);
  const [order] = await orderResult.json();
  if (!order || Number(order.so_tien_vnd) !== amount) {
    return reply(res, { success: true, matched: false, reason: order ? "amount_mismatch" : "order_not_found" });
  }
  if (String(order.sepay_transaction_id || "") === transactionId || order.trang_thai === "da_thanh_toan") {
    return reply(res, { success: true, matched: true, duplicate: true });
  }

  const activeQuery = new URLSearchParams({
    select: "pro_den",
    device_id: `eq.${order.device_id}`,
    trang_thai: "eq.da_thanh_toan",
    order: "pro_den.desc",
    limit: "1",
  });
  const activeResult = await db(url, key, `financial_twin_orders?${activeQuery}`);
  const [active] = activeResult.ok ? await activeResult.json() : [];
  const base = active?.pro_den && new Date(active.pro_den) > new Date() ? new Date(active.pro_den) : new Date();
  base.setUTCDate(base.getUTCDate() + Number(order.so_ngay));

  const update = new URLSearchParams({ ma_don: `eq.${code}`, trang_thai: "eq.cho_thanh_toan" });
  const result = await db(url, key, `financial_twin_orders?${update}`, {
    method: "PATCH",
    headers: { prefer: "return=representation" },
    body: JSON.stringify({
      trang_thai: "da_thanh_toan",
      thanh_toan_luc: new Date().toISOString(),
      pro_den: base.toISOString(),
      sepay_transaction_id: transactionId,
      sepay_reference_code: String(body.referenceCode || "").slice(0, 200) || null,
    }),
  });
  if (!result.ok) return reply(res, { success: false, message: "Database error" }, 500);
  const updated = await result.json();
  return reply(res, { success: true, matched: updated.length > 0, orderCode: code });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return reply(res, { success: false }, 405);
  const body = parseBody(req);
  const authorization = String(req.headers.authorization || "");
  if (!body || !authorization.startsWith("Apikey ")) return reply(res, { success: false, message: "Unauthorized" }, 401);

  let upstream;
  try {
    upstream = await authenticateWithXuongSkill(body, authorization);
  } catch {
    return reply(res, { success: false, message: "Authentication service unavailable" }, 503);
  }
  if ([401, 403].includes(upstream.response.status) || upstream.response.status >= 500) {
    return reply(res, { success: false, message: "Unauthorized or upstream unavailable" }, upstream.response.status);
  }

  const code = codeFrom(body);
  if (code?.startsWith("FT")) return processFinancialTwin(body, res);

  res.setHeader("cache-control", "no-store");
  res.setHeader("content-type", upstream.response.headers.get("content-type") || "application/json");
  return res.status(upstream.response.status).send(upstream.text);
}

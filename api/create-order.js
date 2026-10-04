import { randomBytes } from "node:crypto";

const PLANS = {
  pro_monthly: { amount: 79000, days: 30, name: "Financial Twin Pro theo tháng" },
  pro_yearly: { amount: 690000, days: 365, name: "Financial Twin Pro theo năm" },
};

const reply = (res, body, status = 200) => {
  res.setHeader("cache-control", "no-store");
  return res.status(status).json(body);
};

const validDevice = value => /^[a-f0-9-]{20,80}$/i.test(String(value || ""));
const orderCode = () => `FT${randomBytes(5).toString("hex").toUpperCase()}`;

function qrUrl(code, amount) {
  const query = new URLSearchParams({
    acc: "96247159357", bank: "BIDV", amount: String(amount), des: code,
    template: "compact", showinfo: "true", fullacc: "true",
    holder: "THAM QUANG MINH", store: "FINANCIAL TWIN",
  });
  return `https://vietqr.app/img?${query}`;
}

async function insert(url, key, row) {
  return fetch(`${url.replace(/\/$/, "")}/rest/v1/financial_twin_orders`, {
    method: "POST",
    headers: { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json", prefer: "return=representation" },
    body: JSON.stringify(row),
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return reply(res, { error: "Method not allowed" }, 405);
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return reply(res, { error: "Máy chủ chưa cấu hình thanh toán." }, 500);
  const body = typeof req.body === "string" ? (() => { try { return JSON.parse(req.body); } catch { return null; } })() : req.body;
  const plan = PLANS[body?.plan], deviceId = String(body?.deviceId || "");
  if (!plan || !validDevice(deviceId)) return reply(res, { error: "Thông tin gói thanh toán không hợp lệ." }, 400);
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const code = orderCode();
    const result = await insert(url, key, { ma_don: code, device_id: deviceId, plan: body.plan, so_tien_vnd: plan.amount, so_ngay: plan.days, trang_thai: "cho_thanh_toan", noi_dung_chuyen_khoan: code, het_han_luc: expiresAt });
    if (result.ok) return reply(res, { maDon: code, plan: body.plan, tenGoi: plan.name, soTienVnd: plan.amount, qrUrl: qrUrl(code, plan.amount), hetHanLuc: expiresAt });
    const text = await result.text();
    if (result.status !== 409 && !text.includes("duplicate key")) { console.error("Order insert failed", result.status, text); return reply(res, { error: "Không tạo được đơn thanh toán." }, 500); }
  }
  return reply(res, { error: "Không tạo được mã đơn duy nhất." }, 500);
}

const reply = (res, body, status = 200) => { res.setHeader("cache-control", "no-store"); return res.status(status).json(body); };

export default async function handler(req, res) {
  if (req.method !== "GET") return reply(res, { error: "Method not allowed" }, 405);
  const device = String(req.query?.deviceId || "");
  if (!/^[a-f0-9-]{20,80}$/i.test(device)) return reply(res, { error: "Thiết bị không hợp lệ." }, 400);
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return reply(res, { pro: false, configured: false });
  const query = new URLSearchParams({ select: "plan,pro_den", device_id: `eq.${device}`, trang_thai: "eq.da_thanh_toan", pro_den: `gt.${new Date().toISOString()}`, order: "pro_den.desc", limit: "1" });
  const result = await fetch(`${url.replace(/\/$/, "")}/rest/v1/financial_twin_orders?${query}`, { headers: { apikey: key, authorization: `Bearer ${key}` } });
  if (!result.ok) return reply(res, { pro: false, configured: true });
  const [row] = await result.json();
  return reply(res, { pro: !!row, configured: true, plan: row?.plan || null, proDen: row?.pro_den || null });
}

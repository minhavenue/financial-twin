const reply = (res, body, status = 200) => { res.setHeader("cache-control", "no-store"); return res.status(status).json(body); };
const validDevice = value => /^[a-f0-9-]{20,80}$/i.test(String(value || ""));

export default async function handler(req, res) {
  if (req.method !== "GET") return reply(res, { error: "Method not allowed" }, 405);
  const code = String(req.query?.maDon || "").trim().toUpperCase(), device = String(req.query?.deviceId || "");
  if (!/^FT[A-F0-9]{10}$/.test(code) || !validDevice(device)) return reply(res, { error: "Thông tin đơn không hợp lệ." }, 400);
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return reply(res, { error: "Máy chủ chưa cấu hình thanh toán." }, 500);
  const query = new URLSearchParams({ select: "trang_thai,so_tien_vnd,thanh_toan_luc,pro_den", ma_don: `eq.${code}`, device_id: `eq.${device}`, limit: "1" });
  const result = await fetch(`${url.replace(/\/$/, "")}/rest/v1/financial_twin_orders?${query}`, { headers: { apikey: key, authorization: `Bearer ${key}` } });
  if (!result.ok) return reply(res, { error: "Không đọc được trạng thái đơn." }, 500);
  const [order] = await result.json();
  if (!order) return reply(res, { error: "Không tìm thấy đơn." }, 404);
  return reply(res, { maDon: code, trangThai: order.trang_thai, soTienVnd: Number(order.so_tien_vnd), thanhToanLuc: order.thanh_toan_luc, proDen: order.pro_den });
}

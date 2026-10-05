import { authUser } from "./_auth.js";

const reply = (res, body, status = 200) => {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(body));
};

const dbHeaders = key => ({
  apikey: key,
  authorization: `Bearer ${key}`,
  "content-type": "application/json",
});

function validPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return false;
  const profiles = payload.profiles;
  const records = payload.records;
  if (!profiles || !Array.isArray(profiles.list) || profiles.list.length < 1 || profiles.list.length > 50) return false;
  if (!records || typeof records !== "object" || Array.isArray(records)) return false;
  if (!profiles.list.every(p => p && typeof p.id === "string" && /^[a-zA-Z0-9_-]{1,100}$/.test(p.id))) return false;
  if (typeof profiles.active !== "string" || !profiles.list.some(p => p.id === profiles.active)) return false;
  const ids = new Set(profiles.list.map(p => p.id));
  if (!Object.entries(records).every(([id, raw]) => ids.has(id) && (raw === null || typeof raw === "string"))) return false;
  return Buffer.byteLength(JSON.stringify(payload), "utf8") <= 4 * 1024 * 1024;
}

export default async function handler(req, res) {
  if (!['GET', 'PUT'].includes(req.method)) return reply(res, { error: "Method not allowed" }, 405);
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return reply(res, { error: "Server chưa cấu hình đồng bộ" }, 500);

  const user = await authUser(req, url, key);
  if (!user) return reply(res, { error: "Vui lòng đăng nhập" }, 401);
  const endpoint = `${url.replace(/\/$/, "")}/rest/v1/financial_twin_sync`;

  if (req.method === 'GET') {
    const result = await fetch(`${endpoint}?user_id=eq.${encodeURIComponent(user.id)}&select=payload,updated_at&limit=1`, {
      headers: dbHeaders(key),
    });
    if (!result.ok) return reply(res, { error: "Chưa đọc được dữ liệu đồng bộ" }, 502);
    const rows = await result.json();
    return reply(res, rows[0] ? { payload: rows[0].payload, updatedAt: rows[0].updated_at } : { payload: null });
  }

  const payload = req.body?.payload;
  if (!validPayload(payload)) return reply(res, { error: "Dữ liệu đồng bộ không hợp lệ hoặc vượt quá 4 MB" }, 400);
  const result = await fetch(`${endpoint}?on_conflict=user_id`, {
    method: 'POST',
    headers: { ...dbHeaders(key), prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({ user_id: user.id, payload, updated_at: new Date().toISOString() }),
  });
  if (!result.ok) return reply(res, { error: "Chưa lưu được dữ liệu đồng bộ" }, 502);
  const rows = await result.json();
  return reply(res, { ok: true, updatedAt: rows[0]?.updated_at || new Date().toISOString() });
}

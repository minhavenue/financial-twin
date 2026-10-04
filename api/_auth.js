export async function authUser(req, url, key) {
  const token = String(req.headers.authorization || "").match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return null;
  const result = await fetch(`${url.replace(/\/$/, "")}/auth/v1/user`, {
    headers: { apikey: key, authorization: `Bearer ${token}` },
  });
  if (!result.ok) return null;
  const user = await result.json();
  return user?.id ? { id: user.id, email: String(user.email || "").slice(0, 320) || null } : null;
}

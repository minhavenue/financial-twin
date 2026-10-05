(() => {
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const KEY = 'financial-twin-v2';
const P = {
  food: 'M4 3v8a3 3 0 0 0 6 0V3M7 3v18M17 3c-2 2-3 5-3 8h3v10', home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z', car: 'M4 16v-3l2-6h12l2 6v3zM4 16v2h3v-2M17 16v2h3v-2M7.5 12.5h.01M16.5 12.5h.01', book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19a2 2 0 0 1 2-2h13', bag: 'M5 8h14l-1 13H6zM9 8V6a3 3 0 0 1 6 0v2', play: 'M7 4l13 8-13 8z', heart: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z', card: 'M3 6h18v12H3zM3 10h18M7 15h3', piggy: 'M5 11a7 6 0 0 1 13-2h2v4l-2 1v3h-3v2h-3v-2H9v2H6v-3a6 6 0 0 1-1-5zM15 10h.01', dots: 'M5 12h.01M12 12h.01M19 12h.01', wallet: 'M3 7h16v12H3zM3 7l12-4v4M15 13h2', star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z', plus: 'M12 5v14M5 12h14',
  overview: 'M4 13h6V4H4zM14 20h6v-9h-6zM14 8h6V4h-6zM4 20h6v-3H4z', list: 'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01', target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z', spark: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z',
  twin: 'M9 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM15 17a5 5 0 1 0 0-10', chat: 'M4 5h16v11H9l-5 4z', eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', eyeoff: 'M3 3l18 18M10.6 6.1A10 10 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3.2 3.8M6.6 6.6C3.8 8.4 2 12 2 12s4 7 10 7c1.6 0 3-.4 4.3-1',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z',
  camera: 'M4 8h3l2-3h6l2 3h3v11H4zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z', mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3', doc: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7', grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z', type: 'M4 7V5h16v2M12 5v14M9 19h6',
  back: 'M15 18l-6-6 6-6', close: 'M6 6l12 12M18 6L6 18', send: 'M5 12h14M13 6l6 6-6 6', lock: 'M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4', chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2', check: 'M5 12l5 5 9-10', trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13', edit: 'M4 20h4L19 9l-4-4L4 16zM14 6l4 4', repeat: 'M17 2l3 3-3 3M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 0 1-4 4H4', arrow: 'M5 12h14M13 6l6 6-6 6', download: 'M12 3v12M7 10l5 5 5-5M4 21h16', upload: 'M12 21V9M7 14l5-5 5 5M4 3h16', swap: 'M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7', calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4', clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2', bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z', shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5', chev: 'M9 6l6 6-6 6', warn: 'M12 3l10 18H2zM12 10v5M12 18h.01', bolt: 'M13 2L4 14h7l-1 8 9-12h-7z', coach: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0', life: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6', pause: 'M8 5v14M16 5v14',
};
const ic = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[n] || P.dots}"/></svg>`;
const catIco = id => { const c = FT.catOf(id); return `<span class="cico" style="background:${c.color}22;color:${c.color}">${ic(c.icon)}</span>`; };

/* ---------- storage + mã hóa ---------- */
const sampleToday = () => FT.realToday().slice(0, 8) + '19';
const b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
let cryptoKey = null, cryptoSalt = null;
async function deriveKey(pin, salt) { const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey']); return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']); }
const PKEY = 'financial-twin-profiles';
let PR = null; // {active, list:[{id,name,sample}]}
const skey = id => KEY + ':' + id;
function lsGet(k) { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)); } catch (e) {} }
function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }
function loadProfiles() {
  PR = lsGet(PKEY);
  if (!PR || !PR.list || !PR.list.length) {
    const old = lsGet(KEY); PR = { active: 'p1', list: [{ id: 'p1', name: old && !old.enc && !old.sample && old.profile && old.profile.name ? old.profile.name : (old && !old.enc && !old.sample ? 'Hồ sơ của tôi' : 'Dữ liệu mẫu'), sample: !old || !!old.sample }] };
    if (old) { lsSet(skey('p1'), old); lsDel(KEY); }
    lsSet(PKEY, PR);
  }
  if (!PR.list.some(p => p.id === PR.active)) PR.active = PR.list[0].id;
}
const saveProfiles = () => { lsSet(PKEY, PR); scheduleCloudSync(); };
const curProfile = () => PR.list.find(p => p.id === PR.active);
function readRaw() { return lsGet(skey(PR.active)); }
let saveChain = Promise.resolve();
function save() {
  if (!S) return;
  const snapshot = JSON.stringify(S), pid = PR.active, key = cryptoKey, salt = cryptoSalt, pinOn = !!S.settings.pinOn;
  const p = curProfile(); if (p) { const nm = S.sample ? 'Dữ liệu mẫu' : (S.profile && S.profile.name) || p.name || 'Financial Twin'; if (p.name !== nm || p.sample !== !!S.sample) { p.name = nm; p.sample = !!S.sample; saveProfiles(); } }
  saveChain = saveChain.then(async () => {
    try {
      const k = skey(pid);
      if (key && pinOn) { const iv = crypto.getRandomValues(new Uint8Array(12)); const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(snapshot)); localStorage.setItem(k, JSON.stringify({ enc: 1, salt: b64(salt), iv: b64(iv), data: b64(ct) })); }
      else localStorage.setItem(k, snapshot);
      scheduleCloudSync();
    } catch (e) {}
  });
}
async function tryUnlock(pin, raw) {
  try { const salt = unb64(raw.salt); const key = await deriveKey(pin, salt); const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(raw.iv) }, key, unb64(raw.data)); cryptoKey = key; cryptoSalt = salt; return JSON.parse(new TextDecoder().decode(pt)); } catch (e) { return null; }
}

let S = null;
const fixState = () => { S.settings = S.settings || {}; if (S.settings.buffer == null) S.settings.buffer = 500000; S.aiLog = S.aiLog || []; S.rules = S.rules || {}; };
let lockedRaw = null;
const personalProfileCount = () => (PR?.list || []).filter(p => !p.sample).length;
function createProfile(name) {
  if (!isPro() && personalProfileCount() >= 1) { openPricing('Gói Miễn phí chỉ được tạo 1 hồ sơ cá nhân. Nâng cấp Pro để tạo không giới hạn hồ sơ.'); return null; }
  const id = 'p' + FT.uid(); PR.list.push({ id, name: name || 'Financial Twin', sample: false, lastUsedAt: Date.now() }); saveProfiles();
  const keepLog = S ? S.aiLog : [];
  openProfile(id); S = Object.assign(FT.emptyState(), { v: 2 }); fixState(); S.aiLog = keepLog || []; save(); return id;
}
function ensureOwnProfile() { if (!S || S.sample) createProfile(); }
function openProfile(id) {
  PR.active = id; saveProfiles(); cryptoKey = null; cryptoSalt = null; chat = []; changed(); draftPlan = null;
  const raw = readRaw(); lockedRaw = raw && raw.enc ? raw : null;
  if (lockedRaw) { S = null; return false; }
  S = raw && raw.v === 2 ? raw : (curProfile().sample ? FT.sampleState(sampleToday()) : Object.assign(FT.emptyState(), { v: 2 }));
  fixState(); return true;
}


let tab = 'home', planTab = 'coach', twinTab = 'whatif', txFilter = 'all', txQuery = '', txLimit = 60, reportPeriod = 'month';
let twinRes = null, twinQ = '', followPlan = true, builder = { type: 'purchase', amount: 20000000, months: 12, rate: 0, pct: 30, target: 100000000, label: '' };
let stressCfg = { jobLoss: 2, incomeCut: 0, medical: 15000000, medicalOn: true, rentUp: 0, emergencyBuy: 8000000, emergencyOn: false, loanUp: 0 }, stressRes = null;
let openAlerts = new Set(), chat = [], AI = null, AIimg = false, AItools = false, asking = false;
let draftPlan = null, planForm = { name: '', target: 15000000, months: 6, goalId: '' };
const money = n => `<span class="amt-v num">${FT.vnd(n)}</span>`;
function toast(t) { const el = document.createElement('div'); el.className = 'toast'; el.textContent = t; el.setAttribute('role', 'status'); document.body.appendChild(el); setTimeout(() => el.remove(), 2800); }
const T = () => FT.todayOf(S);
const WD = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const fullDate = s => { const { y, m, d } = FT.pd(s); return `${WD[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]}, ${d}/${m}/${y}`; };
const accOpts = (sel, filter) => S.accounts.filter(a => !filter || filter(a)).map(a => `<option value="${a.id}" ${a.id === sel ? 'selected' : ''}>${esc(a.name)}</option>`).join('');
const catOpts = (sel, income) => (income ? FT.INCATS : FT.CATS).map(c => `<option value="${c.id}" ${c.id === sel ? 'selected' : ''}>${c.name}</option>`).join('');
const parseMoney = v => { const s = String(v || '').trim(); if (!s) return 0; const a = FT.parseAmount(FT.norm(s)); return a ? a.v : (Number(s.replace(/\D/g, '')) || 0); };
const fmtIn = n => n ? Math.round(n).toLocaleString('vi-VN') : '';
const val = id => { const el = document.getElementById(id); return el ? el.value : ''; };
const changed = () => { twinRes = null; stressRes = null; };

/* ---------- gói dịch vụ + SePay ---------- */
const BILL_KEY = 'financial-twin-billing-v1';
let billing = lsGet(BILL_KEY) || { pro: false, plan: null, proDen: null, usageMonth: '', twinUses: 0 };
let payOrder = null, payTimer = null;
const SUPABASE_URL = 'https://wqmbmffpkyqnskdhfxno.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbWJtZmZwa3lxbnNrZGhmeG5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NDEwODYsImV4cCI6MjEwNjMxNzA4Nn0.Tv837ZsDGvNVlPUCNcFhu1hrRmHgWEIBbK38FeU9c70';
const authClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: true, detectSessionInUrl: true } }) || null;
let authSession = null, authReady = false, syncTimer = null, syncing = false, syncUpdatedAt = null;
const authHeaders = () => authSession?.access_token ? { authorization: `Bearer ${authSession.access_token}` } : {};
const authName = () => authSession?.user?.user_metadata?.full_name || authSession?.user?.user_metadata?.name || authSession?.user?.email || '';
const authAvatar = () => authSession?.user?.user_metadata?.avatar_url || authSession?.user?.user_metadata?.picture || '';
function syncPayload() {
  const records = {};
  (PR?.list || []).forEach(p => { try { records[p.id] = localStorage.getItem(skey(p.id)); } catch (e) { records[p.id] = null; } });
  return { version: 1, profiles: PR, records };
}
async function uploadCloudData(showToast = false) {
  if (!authSession || syncing) return false;
  syncing = true;
  try {
    await saveChain;
    const r = await fetch('/api/sync-data', { method: 'PUT', headers: { 'content-type': 'application/json', ...authHeaders() }, body: JSON.stringify({ payload: syncPayload() }) });
    const x = await r.json();
    if (!r.ok) throw new Error(x.error || 'Chưa đồng bộ được dữ liệu');
    syncUpdatedAt = x.updatedAt || new Date().toISOString();
    if (showToast) toast('Đã đồng bộ dữ liệu lên tài khoản');
    return true;
  } catch (e) { if (showToast) toast(e.message || 'Chưa đồng bộ được dữ liệu'); return false; }
  finally { syncing = false; }
}
function scheduleCloudSync() {
  if (!authSession) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => uploadCloudData(false), 900);
}
async function syncFromCloud() {
  if (!authSession) return;
  try {
    const r = await fetch('/api/sync-data', { cache: 'no-store', headers: authHeaders() });
    const x = await r.json();
    if (!r.ok) throw new Error(x.error || 'Chưa tải được dữ liệu');
    const remote = x.payload;
    if (!remote) { await uploadCloudData(false); return; }
    if (!remote.profiles?.list?.length || !remote.records) return;
    const local = syncPayload();
    const mergedList = remote.profiles.list.map(p => ({ ...p }));
    const localOnly = local.profiles.list.filter(p => !mergedList.some(x => x.id === p.id));
    localOnly.forEach(p => mergedList.push({ ...p }));
    const mergedRecords = { ...local.records, ...remote.records };
    let preferredActive = localOnly.length && mergedList.some(p => p.id === local.profiles.active) ? local.profiles.active : remote.profiles.active;
    const chosen = mergedList.find(p => p.id === preferredActive);
    const personal = mergedList.filter(p => !p.sample).sort((a, b) => Number(b.lastUsedAt || 0) - Number(a.lastUsedAt || 0));
    if (chosen?.sample && personal.length && Number(chosen.lastUsedAt || 0) <= Number(personal[0].lastUsedAt || 0)) preferredActive = personal[0].id;
    if (chosen?.sample && personal.length && !chosen.lastUsedAt && !personal[0].lastUsedAt) preferredActive = personal[0].id;
    const oldIds = (PR?.list || []).map(p => p.id);
    oldIds.forEach(id => { try { localStorage.removeItem(skey(id)); } catch (e) {} });
    PR = { active: preferredActive, list: mergedList };
    lsSet(PKEY, PR);
    Object.entries(mergedRecords).forEach(([id, raw]) => { if (typeof raw === 'string') localStorage.setItem(skey(id), raw); });
    syncUpdatedAt = x.updatedAt || null;
    openProfile(PR.active);
    render();
    await uploadCloudData(false);
  } catch (e) { toast('Chưa tải được dữ liệu từ tài khoản. Dữ liệu trên máy vẫn được giữ.'); }
}
function deviceId() {
  let id = ''; try { id = localStorage.getItem('financial-twin-device-id') || ''; } catch (e) {}
  if (!/^[a-f0-9-]{20,80}$/i.test(id)) { id = crypto.randomUUID(); try { localStorage.setItem('financial-twin-device-id', id); } catch (e) {} }
  return id;
}
const saveBilling = () => lsSet(BILL_KEY, billing);
const isPro = () => !!billing.pro && !!billing.proDen && new Date(billing.proDen) > new Date();
const isLifetime = () => billing.plan === 'pro_lifetime';
const proPlanName = () => isLifetime() ? 'Pro trọn đời' : billing.plan === 'pro_yearly' ? 'Pro theo năm' : 'Pro theo tháng';
const proValidity = () => isLifetime() ? 'Quyền sử dụng không hết hạn' : 'Có hiệu lực đến ' + new Date(billing.proDen).toLocaleDateString('vi-VN');
const usageMonth = () => new Date().toISOString().slice(0, 7);
function normalizeUsage() { if (billing.usageMonth !== usageMonth()) { billing.usageMonth = usageMonth(); billing.twinUses = 0; saveBilling(); } }
const twinLeft = () => { normalizeUsage(); return Math.max(0, 3 - Number(billing.twinUses || 0)); };
async function refreshEntitlement(quiet = true) {
  try { const r = await fetch(`/api/entitlement?deviceId=${encodeURIComponent(deviceId())}`, { cache: 'no-store', headers: authHeaders() }); if (!r.ok) return; const x = await r.json(); billing.pro = !!x.pro; billing.plan = x.plan || null; billing.proDen = x.proDen || null; saveBilling(); if (!quiet) render(); } catch (e) {}
}
async function initAuth() {
  if (!authClient) { authReady = true; return; }
  const { data } = await authClient.auth.getSession(); authSession = data.session || null; authReady = true;
  if (authSession) await syncFromCloud();
  authClient.auth.onAuthStateChange(async (event, session) => {
    const wasUser = authSession?.user?.id;
    authSession = session;
    if (session && (!wasUser || event === 'SIGNED_IN')) await syncFromCloud();
    await refreshEntitlement(false);
  });
}
async function signInGoogle() {
  if (!authClient) { toast('Đăng nhập chưa sẵn sàng.'); return; }
  const { error } = await authClient.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + location.pathname } });
  if (error) toast('Chưa mở được đăng nhập Google.');
}
async function signOutGoogle() {
  if (!authClient) return; await authClient.auth.signOut(); authSession = null; await refreshEntitlement(); closeSheet(); render(); toast('Đã đăng xuất');
}
function accountCard() {
  if (!authReady) return `<section class="card auth-card"><span class="spinner"></span><span>Đang kiểm tra tài khoản…</span></section>`;
  if (!authSession) return `<section class="card auth-card"><div class="auth-copy"><h2>Đăng nhập để đồng bộ dữ liệu</h2><p class="small muted">Hồ sơ tài chính và quyền Pro sẽ giống nhau trên điện thoại, máy tính và trình duyệt web.</p></div><button class="btn google-btn" data-act="googlelogin"><span class="google-mark">G</span> Tiếp tục với Google</button></section>`;
  const avatar = authAvatar();
  return `<section class="card auth-card signed"><div class="row"><span class="auth-avatar">${avatar ? `<img src="${esc(avatar)}" alt="">` : esc(authName().slice(0, 1).toUpperCase())}</span><div class="grow"><b>${esc(authName())}</b><div class="small muted">${esc(authSession.user.email || '')}</div></div><span class="pill good">Đã đăng nhập</span></div><div class="small muted">Dữ liệu tự động đồng bộ giữa các thiết bị${syncUpdatedAt ? ' · Lần cuối ' + new Date(syncUpdatedAt).toLocaleString('vi-VN') : ''}</div><button class="btn ghost block" data-act="googlelogout">Đăng xuất</button></section>`;
}
const purchaseButton = (plan, label) => authSession
  ? `<button class="btn block" data-act="buy" data-id="${plan}">${label}</button>`
  : `<button class="btn block" data-act="googlelogin">Đăng nhập để mua</button>`;
function proLock(title, detail) {
  return `<section class="card pro-lock"><span class="pro-crown">${ic('star')}</span><h2>${esc(title)}</h2><p class="small muted">${esc(detail)}</p><button class="btn block" data-act="pricing">Xem gói Pro</button></section>`;
}
function useTwin(q, sc) {
  if (!isPro()) { normalizeUsage(); if (billing.twinUses >= 3) { openPricing('Bạn đã dùng hết 3 lượt mô phỏng miễn phí trong tháng.'); return; } billing.twinUses++; saveBilling(); }
  runTwin(q, sc);
}
function openPricing(note = '') {
  const active = isPro();
  const lifetimeOffer = `<section class="price-card"><div class="row between"><span class="pill warn">ƯU ĐÃI MỞ BÁN</span><span class="small">100 người đầu tiên</span></div><h2>Pro trọn đời</h2><div class="price">399.000đ <small>/ một lần</small></div><p>Thanh toán một lần, dùng vĩnh viễn toàn bộ tính năng Pro hiện có.</p>${purchaseButton('pro_lifetime', isPro() ? 'Nâng cấp lên Pro trọn đời' : 'Mua Pro trọn đời')}</section>`;
  sheet('Gói Financial Twin', `${note ? `<div class="note">${esc(note)}</div>` : ''}
    ${active ? `<section class="card pro-active"><span class="pill good">PRO đang hoạt động</span><h2>${proPlanName()}</h2><p class="small muted">${proValidity()}.</p></section>${isLifetime() ? '' : lifetimeOffer}` : `<section class="price-card"><div class="price-head"><div><span class="pill neutral">MIỄN PHÍ</span><h2>0đ</h2></div><b>${twinLeft()}/3 lượt Twin còn lại</b></div><p>Ghi chép, Safe-to-Spend, cảnh báo cơ bản và 3 lần mô phỏng mỗi tháng.</p></section>
    <section class="price-card featured"><div class="row between"><span class="pill good">LINH HOẠT</span><span class="small">30 ngày</span></div><h2>Pro theo tháng</h2><div class="price">39.000đ <small>/ tháng</small></div><p>Mở toàn bộ Twin, Stress Test, Coach, chatbot tính toán, PDF/Excel và báo cáo.</p>${purchaseButton('pro_monthly', 'Chọn gói tháng')}</section>
    ${lifetimeOffer}`}
    <section class="card plan-compare"><div class="card-h"><h2>So sánh gói</h2></div>
      <div class="compare-row compare-head"><b>Tính năng</b><b>Miễn phí</b><b>Pro tháng</b></div>
      ${[['Ghi chép thu chi', '✓', '✓'], ['Safe-to-Spend', '✓', '✓'], ['Hồ sơ cá nhân', '1', 'Không giới hạn'], ['Mục tiêu tài chính', '2', 'Không giới hạn'], ['Cảnh báo tài chính', 'Cơ bản', 'Đầy đủ'], ['Mô phỏng Financial Twin', '3 lần/tháng', 'Không giới hạn'], ['Stress Test', '—', '✓'], ['AI Coach và chatbot', '—', '✓'], ['Nhập sao kê PDF/Excel', '—', '✓'], ['Báo cáo đầy đủ', '—', '✓']].map(r => `<div class="compare-row"><span>${r[0]}</span><span>${r[1]}</span><strong>${r[2]}</strong></div>`).join('')}
      <div class="compare-row compare-price"><b>Giá</b><b>0đ</b><b>39.000đ/tháng</b></div>
    </section>
    <p class="small muted" style="text-align:center">Thanh toán chuyển khoản VietQR qua SePay. Hệ thống tự kích hoạt Pro sau khi ngân hàng báo có.</p>`, '', { full: true });
}
async function createPayment(plan) {
  if (!authSession) { toast('Vui lòng đăng nhập Google trước khi mua gói.'); openPricing('Bạn cần đăng nhập để đơn hàng gắn đúng tài khoản và sử dụng được trên mọi thiết bị.'); return; }
  sheet('Thanh toán', '<div class="empty"><span class="spinner"></span><b>Đang tạo đơn thanh toán…</b></div>', '', { full: true });
  try {
    const r = await fetch('/api/create-order', { method: 'POST', headers: { 'content-type': 'application/json', ...authHeaders() }, body: JSON.stringify({ plan, deviceId: deviceId() }) });
    const x = await r.json(); if (!r.ok) throw new Error(x.error || 'Không tạo được đơn.'); payOrder = x; renderPayment(); pollPayment();
  } catch (e) { sheet('Thanh toán', `<div class="empty"><b>Chưa tạo được đơn</b><p class="small muted">${esc(e.message)}</p><button class="btn" data-act="pricing">Quay lại bảng giá</button></div>`, '', { full: true }); }
}
function renderPayment(paid = false) {
  if (!payOrder) return;
  if (paid) { sheet('Thanh toán thành công', `<div class="pay-success"><div class="success-mark">✓</div><h2>Financial Twin Pro đã được kích hoạt</h2><p><b>${proValidity()}</b>.</p><button class="btn block" data-act="close">Bắt đầu sử dụng Pro</button></div>`, '', { full: true }); return; }
  sheet('Thanh toán Pro', `<div class="paybox"><div class="price">${FT.vnd(payOrder.soTienVnd)}</div><p class="small muted">${esc(payOrder.tenGoi)}</p><div class="qr"><img src="${esc(payOrder.qrUrl)}" alt="Mã VietQR thanh toán ${esc(payOrder.maDon)}"></div><div class="pay-info"><span>Ngân hàng</span><b>BIDV</b><span>Chủ tài khoản</span><b>THAM QUANG MINH</b><span>Số tài khoản</span><b>96247159357</b><span>Nội dung</span><b class="order-code">${esc(payOrder.maDon)}</b></div><div class="note">Chuyển đúng số tiền và giữ nguyên nội dung. Pro sẽ tự mở trong vài giây sau khi thanh toán.</div><div class="waiting"><i></i> Đang chờ ngân hàng xác nhận…</div></div>`, '', { full: true });
}
function pollPayment() {
  clearInterval(payTimer); const check = async () => { if (!payOrder) return; try { const r = await fetch(`/api/order-status?maDon=${encodeURIComponent(payOrder.maDon)}&deviceId=${encodeURIComponent(deviceId())}`, { cache: 'no-store' }); if (!r.ok) return; const x = await r.json(); if (x.trangThai === 'da_thanh_toan') { clearInterval(payTimer); billing = { ...billing, pro: true, plan: payOrder.plan, proDen: x.proDen }; saveBilling(); renderPayment(true); } } catch (e) {} }; check(); payTimer = setInterval(check, 3000);
}

/* ---------- shell ---------- */
function render() {
  if (!S) { showLock('unlock'); return; }
  document.body.classList.toggle('hide-amt', !!S.settings.hide);
  const views = { home: viewHome, tx: viewTx, twin: viewTwin, plan: viewPlan };
  $('#root').innerHTML = `<div class="app">${views[tab]()}</div>
  <button class="fab-chat" data-act="chat" aria-label="Mở chatbot tài chính">${ic('chat')}Hỏi Twin${isPro() ? '' : ' · Pro'}</button>
  <nav class="nav" aria-label="Điều hướng chính">
    ${navBtn('home', 'overview', 'Tổng quan')}${navBtn('tx', 'list', 'Giao dịch')}
    <button data-act="add" aria-label="Thêm giao dịch"><span class="fab">${ic('plus')}</span></button>
    ${navBtn('twin', 'twin', 'Twin')}${navBtn('plan', 'target', 'Kế hoạch')}
  </nav>`;
}
const navBtn = (id, icon, label) => `<button class="${tab === id ? 'on' : ''}" data-act="tab" data-id="${id}" ${tab === id ? 'aria-current="page"' : ''}>${ic(icon)}<span>${label}</span></button>`;
function header(sub) {
  return `<header class="top"><button class="brand" data-act="profiles" aria-label="Đổi hoặc tạo hồ sơ" style="text-align:left"><span class="mark"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="9" cy="12" r="5.2" fill="none" stroke="#3CC2A9" stroke-width="2"/><circle cx="15" cy="12" r="5.2" fill="none" stroke="#A497F7" stroke-width="2" stroke-dasharray="2.6 2.2"/></svg></span>
  <div style="min-width:0"><h1>${S.profile.name ? 'Chào ' + esc(S.profile.name) : 'Financial Twin'} ${isPro() ? '<span class="pro-badge">PRO</span>' : ''}</h1><div class="sub">Financial Twin · ${sub || fullDate(T())}</div></div></button>
  <div class="row"><button class="iconbtn" data-act="hide" aria-label="${S.settings.hide ? 'Hiện số tiền' : 'Ẩn số tiền'}">${ic(S.settings.hide ? 'eyeoff' : 'eye')}</button>
  <button class="iconbtn" data-act="settings" aria-label="Cài đặt">${ic('gear')}</button></div></header>`;
}
const sampleBanner = () => S.sample ? `<div class="banner">${ic('spark')}<div class="grow"><b>Dữ liệu mẫu</b> · hôm nay giả lập ${FT.dLabel(T())}</div><button class="btn-sm acc" data-act="newprofile">Tạo dữ liệu của tôi</button></div>` : S.fromStatement ? `<div class="banner">${ic('doc')}<div class="grow"><b>Dựng từ sao kê</b> · số liệu tính đến ${FT.dLabel(T())}</div><button class="btn-sm" data-act="resetsample">Về dữ liệu mẫu</button></div>` : '';

/* ---------- TỔNG QUAN ---------- */
function viewHome() {
  if (!S.accounts.length) return header() + `<div class="card empty">${ic('wallet')}<h2>Chưa có ví nào</h2><p class="small">Bắt đầu hồ sơ của bạn bằng một trong các cách sau.</p><button class="btn" data-act="onboard">${ic('edit')} Nhập thông tin trong 3 phút</button><button class="btn ghost" data-act="addmode" data-id="file">${ic('upload')} Tải sao kê của tôi</button><button class="linkbtn" data-act="addacc">Tự thêm từng ví</button>${PR.list.length > 1 ? `<button class="linkbtn" data-act="profiles">Chuyển sang hồ sơ khác</button>` : ''}</div>`;
  const M = FT.model(S), Sx = FT.safeToSpend(S, M), f = M.f, H = FT.health(S), A = FT.alerts2(S);
  const ms = FT.monthSummary(S, f.mk, f.d), prev = FT.monthSummary(S, FT.shiftM(f.mk, -1), f.d);
  const status = Sx.atPace < 0 ? ['bad', 'Nguy cơ thiếu tiền'] : Sx.atPace < Sx.pace * 3 ? ['warn', 'Cần chú ý'] : ['good', 'An toàn'];
  const usedPct = Sx.safe > 0 ? Math.min(100, Sx.spentToday / Sx.safe * 100) : (Sx.spentToday ? 100 : 0);
  const rate = ms.rate, spendDiff = ms.spend - prev.spend;
  return header() + `<div class="stack">${sampleBanner()}${startCard()}
  <section class="hero" aria-label="Safe-to-Spend hôm nay">
    <div class="row between"><span class="eyebrow">Hôm nay bạn có thể tiêu tối đa</span><span class="pill ${status[0]}">${status[1]}</span></div>
    <div class="big num">${money(Sx.safe)}</div>
    <p class="msg">…mà vẫn trả đủ <b>${Sx.obl.length} khoản</b> sắp tới và giữ ${money(Sx.buffer)} dự phòng đến ngày lương <b>${FT.dShort(Sx.nextPay)}</b>.</p>
    <div class="bar2 ${Sx.over ? 'over' : ''}"><span style="width:${usedPct}%"></span></div>
    <div class="barlbl"><span>Đã tiêu hôm nay ${money(Sx.spentToday)}</span><span>${Sx.over ? 'Vượt ' + money(Sx.spentToday - Sx.safe) : 'Còn ' + money(Sx.left)}</span></div>
    <div class="hero-meta"><div><div class="k">Đến ngày lương</div><div class="v num">${Sx.D} ngày</div></div>
      <div><div class="k">Đang chi/ngày</div><div class="v num">${money(Sx.pace)}</div></div>
      <div><div class="k">Trước ngày lương</div><div class="v num" style="color:${Sx.atPace < 0 ? '#FFB3BC' : '#8FE3BE'}">${Sx.atPace < 0 ? '' : '+'}${money(Sx.atPace)}</div></div></div>
    <details class="howto"><summary>${ic('bulb')} Xem cách tính</summary><div class="formula num">
      <div class="ln"><span>Tiền các ví − nợ thẻ</span><span>${money(Sx.net)}</span></div>
      <div class="ln"><span>+ Đã tiêu hôm nay (tính từ đầu ngày)</span><span>${money(Sx.spentToday)}</span></div>
      ${Sx.obl.map(o => `<div class="ln"><span>− ${esc(o.name)} (${FT.dShort(o.date)})</span><span>${money(o.amount)}</span></div>`).join('')}
      <div class="ln"><span>− Dự phòng tối thiểu</span><span>${money(Sx.buffer)}</span></div>
      <div class="ln tot"><span>= Tiền dùng được đến lương</span><span>${money(Sx.pool)}</span></div>
      <div class="ln tot"><span>÷ ${Sx.D} ngày = mỗi ngày</span><span>${money(Sx.safe)}</span></div>
      <div style="margin-top:4px">Giữ mức chi ${money(Sx.pace)}/ngày thì đến ${FT.dShort(Sx.nextPay)} ${Sx.atPace < 0 ? 'thiếu' : 'dư'} ${money(Math.abs(Sx.atPace))}.${Sx.byBudget != null ? ` Theo ngân sách còn lại: ${money(Sx.byBudget)}/ngày.` : ''}</div></div></details>
  </section>
  <button class="card health" data-act="health" aria-label="Xem chi tiết điểm sức khỏe tài chính">${gauge(H.total, H.band[0])}
    <div class="drv"><div class="row between"><b style="font-size:15px">Sức khỏe tài chính</b><span class="pill ${H.band[0]}">${H.band[1]}</span></div>
    ${H.downs.slice(0, 2).map(d => `<div class="row"><span class="up">▼ ${d.lost}</span><span class="muted">${esc(d.name)}: ${esc(d.value)}</span></div>`).join('')}
    ${H.ups[0] ? `<div class="row"><span class="down">▲</span><span class="muted">${esc(H.ups[0].name)} tốt</span></div>` : ''}</div></button>
  <section class="card"><div class="card-h"><h2>Bản sao tài chính</h2><div class="twin-legend"><span><i></i>Thực tế</span><span><i class="d"></i>Dự báo</span></div></div>${monthChart(f)}
    <form class="ask-box" id="homeask" style="margin-top:12px"><input class="in" id="homeq" placeholder="Nếu mua laptop 20 triệu thì sao?" aria-label="Hỏi Twin"><button class="btn">${ic('twin')}</button></form>
    <div class="chips scroll" style="margin-top:8px">${['Nếu mua điện thoại 20 triệu hôm nay thì sao?', 'Nếu nghỉ việc hai tháng, tôi duy trì được bao lâu?'].map((q, i) => `<button class="chip" data-act="twinq" data-v="${esc(q)}">${esc(q)}</button>`).join('')}</div></section>
  <section class="card"><div class="card-h"><h2>Cảnh báo chủ động</h2><span class="tag">${A.length}</span></div>${alertList(A.slice(0, 5))}
    ${A.length > 5 ? `<button class="link" data-act="allalerts" style="margin-top:6px">Xem tất cả ${A.length} cảnh báo ${ic('arrow')}</button>` : ''}</section>
  <div class="stats">
    <div class="stat"><div class="k">Tổng tiền hiện có</div><div class="v">${money(f.pos.cash)}</div><div class="s">Nợ thẻ ${money(f.pos.debt)}</div></div>
    <div class="stat"><div class="k">Quỹ dự phòng</div><div class="v">${money(M.reserve)}</div><div class="s">Đủ ${FT.months1(M.burn ? M.reserve / M.burn : 0)} tháng chi tiêu</div></div>
    <div class="stat"><div class="k">Thu tháng này</div><div class="v">${money(ms.income)}</div><div class="s">Tỷ lệ tiết kiệm ${rate == null ? '—' : Math.round(rate * 100) + '%'}</div></div>
    <div class="stat"><div class="k">Chi tháng này</div><div class="v">${money(ms.spend)}</div><div class="s ${spendDiff > 0 ? 'up' : 'down'}">${spendDiff > 0 ? '▲' : '▼'} ${money(Math.abs(spendDiff))} so với cùng kỳ</div></div>
  </div>
  <section class="card"><div class="card-h"><h2>Sắp đến hạn</h2><button class="link" data-act="goplan" data-id="bills">Tất cả ${ic('arrow')}</button></div>${upcomingList(f, 4)}</section>
  <section class="card"><div class="card-h"><h2>Thu – chi 4 tháng</h2><div class="twin-legend"><span><i style="border-color:var(--good)"></i>Thu</span><span><i style="border-color:var(--bad)"></i>Chi</span></div></div>${ieChart()}</section>
  <button class="card row" data-act="report" style="text-align:left;width:100%"><span class="cico" style="background:var(--accent-soft);color:var(--accent)">${ic('chart')}</span><div class="grow"><div style="font-weight:600">Báo cáo tuần & tháng</div><div class="small muted">Nhóm chi nhiều nhất, so sánh, 3 việc nên làm</div></div>${ic('arrow')}</button>
  </div>`;
}
function startCard() {
  if (S.sample || S.fromStatement || S.txns.length >= 10 || S.settings.hideStart) return '';
  const steps = [[S.accounts.length > 0, 'Thiết lập ví, thu nhập, khoản cố định', 'onboard'], [S.txns.length > 0, 'Ghi khoản chi đầu tiên (gõ như nhắn tin)', 'add'], [S.txns.length >= 30, 'Tải sao kê 1–3 tháng gần nhất để dự báo chính xác hơn', 'addmode'], [!!(S.plan && S.plan.active), 'Lập kế hoạch tiết kiệm với AI Coach', 'goplan']];
  return `<section class="card"><div class="card-h"><h2>Bắt đầu với Financial Twin</h2><button class="linkbtn" data-act="hidestart">Ẩn</button></div>
    ${steps.map(([done, t, act], i) => `<div class="li ${done ? '' : 'tap'}" ${done ? '' : `data-act="${act}" ${act === 'addmode' ? 'data-id="file"' : act === 'goplan' ? 'data-id="coach"' : ''}`}><span class="cico" style="background:${done ? 'var(--good-soft)' : 'var(--surface-2)'};color:${done ? 'var(--good)' : 'var(--muted)'}">${done ? ic('check') : `<b>${i + 1}</b>`}</span><div class="main"><div class="t" style="${done ? 'text-decoration:line-through;color:var(--muted)' : ''}">${t}</div></div>${done ? '' : ic('chev', 'chev')}</div>`).join('')}
    <p class="small muted" style="margin:6px 0 0">Chưa có lịch sử chi tiêu, app tạm dự báo theo ngân sách bạn đặt. Càng ghi nhiều, dự báo càng sát.</p></section>`;
}
function gauge(v, sev) {
  const r = 36, c = 2 * Math.PI * r, col = sev === 'good' ? 'var(--good)' : sev === 'warn' ? 'var(--warn)' : 'var(--bad)';
  return `<svg class="gauge" viewBox="0 0 92 92" width="92" height="92" role="img" aria-label="Điểm ${v} trên 100"><circle cx="46" cy="46" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="9"/><circle cx="46" cy="46" r="${r}" fill="none" stroke="${col}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${c * v / 100} ${c}" transform="rotate(-90 46 46)"/><text x="46" y="50" text-anchor="middle" font-size="24" font-weight="600" fill="var(--ink)">${v}</text><text x="46" y="66" text-anchor="middle" font-size="10" fill="var(--muted)">/100</text></svg>`;
}
function alertList(A) {
  if (!A.length) return '<p class="muted small" style="margin:0">Mọi thứ đang ổn. Chưa có cảnh báo nào.</p>';
  return A.map(a => { const open = openAlerts.has(a.id);
    return `<div class="al ${a.sev} ${open ? 'open' : ''}"><button class="al-h" data-act="alert" data-id="${esc(a.id)}" aria-expanded="${open}"><span class="bar"></span><div style="min-width:0"><div class="t">${esc(a.title)}</div><div class="b">${esc(a.what)}</div></div><span class="row" style="gap:6px"><span class="tag">${a.tag}</span>${ic('chev', 'chev')}</span></button>
    <div class="al-b"><dl class="why"><dt>Chuyện gì xảy ra</dt><dd>${esc(a.what)}</dd><dt>Vì sao app kết luận</dt><dd>${esc(a.why)}</dd><dt>Ảnh hưởng</dt><dd><b>${esc(a.impact)}</b></dd><dt>Nên làm gì</dt><dd>${esc(a.action)}</dd>
    ${a.confidence != null ? `<dt>Độ tin cậy</dt><dd><div class="conf"><div class="prog"><span style="width:${Math.round(a.confidence * 100)}%;background:${a.confidence >= .8 ? 'var(--good)' : a.confidence >= .6 ? 'var(--warn)' : 'var(--muted)'}"></span></div><b>${Math.round(a.confidence * 100)}%</b></div><div class="small muted">${esc(a.confNote || '')}</div></dd>` : ''}</dl>
    ${a.ask ? `<div class="chips"><button class="chip" data-act="usage" data-id="${a.ask.id}" data-v="often">Còn dùng thường xuyên</button><button class="chip" data-act="usage" data-id="${a.ask.id}" data-v="rarely">Ít dùng</button></div>` : ''}
    ${a.btn ? `<div><button class="btn-sm acc" data-act="${a.btn.act}" data-id="${esc(a.btn.id || '')}">${esc(a.btn.label)}</button></div>` : ''}</div></div>`; }).join('');
}
function upcomingList(f, n) {
  const list = f.pending.slice().sort((a, b) => (a.overdue ? 0 : a.day) - (b.overdue ? 0 : b.day));
  if (!list.length) return '<p class="muted small" style="margin:0">Không còn khoản nào đến hạn trong tháng này.</p>';
  return list.slice(0, n).map(b => { const left = b.day - f.d; const when = b.overdue ? '<span class="pill bad">Quá hạn</span>' : left === 0 ? '<span class="pill warn">Hôm nay</span>' : left <= 3 ? `<span class="pill warn">Còn ${left} ngày</span>` : `<span class="pill neutral">Ngày ${b.day}</span>`;
    return `<div class="li">${catIco(b.cat)}<div class="main"><div class="t">${esc(b.name)}</div><div class="s">${kindLabel(b.kind)} · ${esc(FT.accName(S, b.account))}</div></div><div style="display:grid;justify-items:end;gap:3px"><span class="amt ${b.kind === 'income' ? 'in' : ''}">${b.kind === 'income' ? '+' : ''}${money(b.amount)}</span>${when}</div></div>`; }).join('');
}
const kindLabel = k => ({ income: 'Thu nhập', sub: 'Đăng ký định kỳ', loan: 'Khoản vay', saving: 'Tiết kiệm', bill: 'Hóa đơn' }[k] || 'Hóa đơn');
function monthChart(f) {
  const W = 340, H = 160, l = 8, r = 40, t = 12, b = 22; const L = f.L;
  const all = f.series.concat(f.proj); let mx = Math.max(...all.map(p => p.v), 0), mn = Math.min(...all.map(p => p.v), 0);
  const pad = (mx - mn) * .08 || 1e5; mx += pad; if (mn < 0) mn -= pad;
  const X = d => l + (d - 1) / (L - 1) * (W - l - r); const Y = v => t + (mx - v) / (mx - mn) * (H - t - b);
  const path = pts => pts.map((p, i) => (i ? 'L' : 'M') + X(p.day).toFixed(1) + ' ' + Y(p.v).toFixed(1)).join(' ');
  const act = f.series, proj = f.proj; const z = Y(0);
  const area = act.length ? `M${X(act[0].day)} ${z} ` + act.map(p => `L${X(p.day).toFixed(1)} ${Y(p.v).toFixed(1)}`).join(' ') + ` L${X(act[act.length - 1].day)} ${z} Z` : '';
  const last = proj[proj.length - 1], now = proj[0]; const ticks = [1, 10, 20, L].filter((v, i, a) => a.indexOf(v) === i);
  const risk = proj.find(p => p.day > f.d && p.v < 0);
  return `<div class="wide"><svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Số dư thực tế và dự báo đến cuối tháng">
    <defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".22"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
    ${mn < 0 ? `<rect x="${l}" y="${z}" width="${W - l - r}" height="${H - b - z}" fill="var(--bad)" opacity=".08"/>` : ''}
    <line x1="${l}" x2="${W - r}" y1="${z}" y2="${z}" stroke="var(--line)"/>${Math.abs(Y(last.v) - z) > 12 ? `<text x="${W - r + 4}" y="${z + 3.5}">0</text>` : ''}
    <path d="${area}" fill="url(#ga)"/><path d="${path(act)}" fill="none" stroke="var(--accent)" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="${path(proj)}" fill="none" stroke="var(--twin)" stroke-width="2.4" stroke-dasharray="5 4" stroke-linejoin="round"/>
    <line x1="${X(now.day)}" x2="${X(now.day)}" y1="${t}" y2="${H - b}" stroke="var(--muted)" stroke-dasharray="2 3" opacity=".6"/>
    <circle cx="${X(now.day)}" cy="${Y(now.v)}" r="4.5" fill="var(--surface)" stroke="var(--accent)" stroke-width="2.4"/>
    <text x="${Math.min(X(now.day) + 6, W - r - 50)}" y="${t + 8}" style="font-weight:600;fill:var(--ink)">Hôm nay</text>
    ${risk ? `<circle cx="${X(risk.day)}" cy="${Y(risk.v)}" r="4" fill="var(--bad)"/>` : ''}
    <circle cx="${X(last.day)}" cy="${Y(last.v)}" r="4" fill="var(--twin)"/>
    <text x="${W - r + 4}" y="${Y(last.v) + 3.5}" style="font-weight:600;fill:${last.v < 0 ? 'var(--bad)' : 'var(--twin)'}">${S.settings.hide ? '•••' : FT.short(last.v)}</text>
    ${ticks.map(d => `<text x="${X(d)}" y="${H - 5}" text-anchor="${d === 1 ? 'start' : d === L ? 'end' : 'middle'}">${d}/${FT.pd(f.T).m}</text>`).join('')}
  </svg></div><p class="small muted" style="margin:6px 0 0">${risk ? `Số dư dự kiến âm từ <b class="up">ngày ${risk.day}</b> nếu giữ mức chi hiện tại.` : `Số dư cuối tháng dự kiến ${money(last.v)}.`}</p>`;
}
function ieChart() {
  const h = FT.history(S, 4); const mx = Math.max(...h.map(x => Math.max(x.income, x.spend)), 1);
  const W = 340, H = 150, b = 34, t = 16; const gw = (W - 10) / h.length; const Y = v => (H - b - t) * v / mx;
  return `<div class="wide"><svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Thu và chi theo tháng"><line x1="0" x2="${W}" y1="${H - b}" y2="${H - b}" stroke="var(--line)"/>
    ${h.map((x, i) => { const cx = 5 + gw * i + gw / 2; const hi = Y(x.income), hs = Y(x.spend);
      return `<rect x="${cx - 23}" y="${H - b - hi}" width="20" height="${hi}" rx="5" fill="var(--good)" opacity="${x.partial ? .55 : .9}"/><rect x="${cx + 3}" y="${H - b - hs}" width="20" height="${hs}" rx="5" fill="var(--bad)" opacity="${x.partial ? .55 : .9}"/>
      <text x="${cx}" y="${H - b + 14}" text-anchor="middle" style="fill:var(--ink);font-weight:600">${'T' + Number(x.mk.slice(5))}${x.partial ? '*' : ''}</text><text x="${cx}" y="${H - b + 27}" text-anchor="middle" style="fill:${x.income - x.spend >= 0 ? 'var(--good)' : 'var(--bad)'}">${S.settings.hide ? '•••' : (x.income - x.spend >= 0 ? '+' : '') + FT.short(x.income - x.spend)}</text>`; }).join('')}
  </svg></div><p class="small muted" style="margin:6px 0 0">* Tháng này tính đến hôm nay. Dòng dưới: thu trừ chi, không tính tiền chuyển vào quỹ.</p>`;
}
// biểu đồ nhiều đường theo thời gian (12 tháng)
function multiChart(series, opts = {}) {
  const W = 340, H = opts.h || 170, l = 8, r = 44, t = 14, b = 22;
  const pts = series.flatMap(s => s.pts); if (!pts.length) return '';
  const d0 = pts[0].date, days = Math.max(1, Math.max(...pts.map(p => FT.dayDiff(d0, p.date))));
  let mx = Math.max(...pts.map(p => p.v), 0), mn = Math.min(...pts.map(p => p.v), 0); const pad = (mx - mn) * .08 || 1e5; mx += pad; if (mn < 0) mn -= pad;
  const X = d => l + FT.dayDiff(d0, d) / days * (W - l - r), Y = v => t + (mx - v) / (mx - mn) * (H - t - b);
  const months = []; let k = FT.mkey(d0); const endK = FT.mkey(pts.reduce((a, p) => p.date > a ? p.date : a, d0));
  for (let i = 0; i < 40 && k <= endK; i++) { const dd = k + '-01'; if (dd > d0) months.push(dd); k = FT.shiftM(k, 1); }
  const step = Math.ceil(months.length / 6);
  const z = Y(0);
  return `<div class="wide"><svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.label || 'Dòng tiền dự báo')}">
    ${mn < 0 ? `<rect x="${l}" y="${z}" width="${W - l - r}" height="${H - b - z}" fill="var(--bad)" opacity=".07"/>` : ''}
    ${months.map((d, i) => i % step ? '' : `<line x1="${X(d)}" x2="${X(d)}" y1="${t}" y2="${H - b}" stroke="var(--line)" opacity=".6"/><text x="${X(d)}" y="${H - 6}" text-anchor="middle">${FT.mShort(FT.mkey(d)).split('/')[0]}</text>`).join('')}
    <line x1="${l}" x2="${W - r}" y1="${z}" y2="${z}" stroke="var(--muted)" opacity=".5"/><text x="${W - r + 4}" y="${z + 3.5}">0</text>
    ${series.map(s => `<path d="${s.pts.map((p, i) => (i ? 'L' : 'M') + X(p.date).toFixed(1) + ' ' + Y(p.v).toFixed(1)).join(' ')}" fill="none" stroke="${s.color}" stroke-width="${s.w || 2.2}" ${s.dash ? `stroke-dasharray="${s.dash}"` : ''} stroke-linejoin="round"/>`).join('')}
    ${(opts.marks || []).map(p => `<circle cx="${X(p.date)}" cy="${Y(p.v)}" r="3.6" fill="var(--bad)"/>`).join('')}
    ${series.map(s => { const e = s.pts[s.pts.length - 1]; return `<text x="${W - r + 4}" y="${Y(e.v) + 3.5}" style="font-weight:600;fill:${s.color}">${S.settings.hide ? '•••' : FT.short(e.v)}</text>`; }).join('')}
  </svg></div>`;
}

/* ---------- GIAO DỊCH ---------- */
function viewTx() {
  const rec = FT.detectRecurring(S); const dupIds = new Set(FT.findDuplicates(S, FT.addDays(T(), -30)).map(x => x[1].id));
  let list = S.txns.slice().sort((a, b) => b.date.localeCompare(a.date) || (b.id > a.id ? 1 : -1));
  if (txFilter !== 'all') list = list.filter(t => t.type === txFilter);
  if (txQuery) { const q = FT.norm(txQuery); list = list.filter(t => FT.norm(t.merchant + ' ' + (t.note || '') + ' ' + FT.catOf(t.cat).name).includes(q)); }
  const shown = list.slice(0, txLimit); const groups = {}; shown.forEach(t => (groups[t.date] = groups[t.date] || []).push(t));
  return header('Giao dịch') + `<div class="stack">
    <div class="row"><button class="btn ghost grow" data-act="add">${ic('type')} Thêm nhanh</button><button class="btn ghost grow" data-act="addmode" data-id="file">${ic('upload')} Nhập sao kê</button></div>
    ${rec.length ? `<div class="card" style="background:var(--twin-soft);box-shadow:none"><div class="row">${ic('repeat')}<div class="grow"><b>Phát hiện khoản định kỳ</b><div class="small">${esc(rec[0].name)} · ${money(rec[0].amount)} quanh ngày ${rec[0].day} hằng tháng (${rec[0].count} lần)</div></div><button class="btn-sm acc" data-act="addrec" data-i="0">Thêm</button></div></div>` : ''}
    <label class="row card" style="padding:8px 12px">${ic('search')}<input class="in" id="txq" style="border:0;padding:6px 0;background:transparent" placeholder="Tìm: Highlands, Grab, tai nghe..." value="${esc(txQuery)}"></label>
    <div class="chips" role="group" aria-label="Lọc">${[['all', 'Tất cả'], ['expense', 'Chi'], ['income', 'Thu'], ['transfer', 'Chuyển ví']].map(([k, v]) => `<button class="chip ${txFilter === k ? 'on' : ''}" data-act="txf" data-id="${k}">${v}</button>`).join('')}</div>
    <div>${shown.length ? Object.entries(groups).map(([d, ts]) => { const tot = FT.sum(ts.filter(FT.isSpend).map(t => t.amount));
      return `<div class="daygrp"><span>${fullDate(d)}</span>${tot ? `<span class="num">−${money(tot)}</span>` : ''}</div><div class="card" style="padding:4px 14px">${ts.map(t => txRow(t, dupIds.has(t.id))).join('')}</div>`; }).join('') : `<div class="card empty">${ic('list')}<b>Không có giao dịch phù hợp</b><span class="small">Bấm nút + để thêm giao dịch.</span></div>`}</div>
    ${list.length > txLimit ? `<button class="btn ghost block" data-act="more">Xem thêm ${list.length - txLimit} giao dịch</button>` : ''}
  </div>`;
}
function txRow(t, dup) {
  if (t.type === 'transfer') return `<div class="li tap" data-act="edittx" data-id="${t.id}"><span class="cico" style="background:var(--surface-2);color:var(--muted)">${ic('swap')}</span><div class="main"><div class="t">${esc(t.merchant || 'Chuyển tiền')}</div><div class="s">${esc(FT.accName(S, t.account))} → ${esc(FT.accName(S, t.to))} · không tính là chi</div></div><span class="amt muted">${money(t.amount)}</span></div>`;
  return `<div class="li tap" data-act="edittx" data-id="${t.id}">${catIco(t.cat)}<div class="main"><div class="t">${esc(t.merchant)}${t.note ? ` <span class="muted" style="font-weight:400">· ${esc(t.note)}</span>` : ''}</div><div class="s">${FT.catOf(t.cat).name} · ${esc(FT.accName(S, t.account))}${t.billId ? ' · định kỳ' : ''}${t.src ? ' · từ ' + esc(t.src) : ''}</div></div><div style="display:grid;justify-items:end;gap:3px"><span class="amt ${t.type === 'income' ? 'in' : ''}">${t.type === 'income' ? '+' : '−'}${money(t.amount)}</span>${dup ? '<span class="pill warn">Có thể trùng</span>' : ''}</div></div>`;
}

/* ---------- TWIN ---------- */
const QUICK4 = ['Nếu mua điện thoại 20 triệu hôm nay thì sao?', 'Nếu nghỉ việc hai tháng, tôi duy trì được bao lâu?', 'Nếu vay trả góp 12 tháng thì tháng nào dễ thiếu tiền?', 'Muốn có 100 triệu sau hai năm thì cần thay đổi gì?'];
function viewTwin() {
  const seg = `<div class="seg" role="tablist">${[['whatif', 'Nếu… thì sao?'], ['stress', 'Stress test']].map(([k, v]) => `<button role="tab" aria-selected="${twinTab === k}" class="${twinTab === k ? 'on' : ''}" data-act="twintab" data-id="${k}">${v}</button>`).join('')}</div>`;
  return header('Bản sao tài chính') + `<div class="stack">${seg}${twinTab === 'whatif' ? viewWhatIf() : isPro() ? viewStress() : proLock('Stress Test dành cho Pro', 'Mô phỏng mất việc, giảm thu nhập, viện phí, tăng tiền nhà và các cú sốc tài chính.')}</div>`;
}
function modelCard(M) {
  return `<section class="card"><div class="card-h"><h2>Twin được dựng từ</h2>${M.plan ? `<label class="row small" style="gap:8px">Theo kế hoạch<button class="toggle ${followPlan ? 'on' : ''}" data-act="followplan" aria-pressed="${followPlan}" aria-label="Giả định làm theo kế hoạch tiết kiệm"></button></label>` : ''}</div>
  <div class="model-chips">
    <div class="mchip"><span>Thu nhập</span><b>${money(M.income)}</b></div>
    <div class="mchip"><span>Chi cố định</span><b>${money(M.fixed)}</b></div>
    <div class="mchip"><span>Thói quen chi</span><b>${money(M.varMonthly)}</b></div>
    <div class="mchip"><span>Trả nợ</span><b>${money(M.loanPay)}</b></div>
    <div class="mchip"><span>Góp mục tiêu</span><b>${money(M.contrib)}</b></div>
    <div class="mchip"><span>Sắp tới tháng này</span><b>${M.f.pending.length} khoản</b></div>
  </div><p class="small muted" style="margin:8px 0 0">Mỗi tháng · quỹ dự phòng ${money(M.reserve)} · dư ${money(M.surplus)} sau mọi khoản.</p></section>`;
}
function viewWhatIf() {
  const M = FT.model(S, { followPlan });
  const b = builder;
  const types = [['purchase', 'Mua lớn'], ['installment', 'Trả góp'], ['jobloss', 'Nghỉ việc'], ['incomecut', 'Giảm thu nhập'], ['goal', 'Mục tiêu mới']];
  const fields = b.type === 'purchase' ? `<label class="f">Số tiền<input class="in num" id="b_amount" value="${fmtIn(b.amount)}" inputmode="numeric"></label>`
    : b.type === 'installment' ? `<div class="grid2"><label class="f">Số tiền<input class="in num" id="b_amount" value="${fmtIn(b.amount)}" inputmode="numeric"></label><label class="f">Số tháng<input class="in" id="b_months" type="number" min="1" max="60" value="${b.months}"></label></div><label class="f">Lãi mỗi tháng (%)<input class="in" id="b_rate" type="number" step="0.1" min="0" value="${b.rate}"></label>`
    : b.type === 'jobloss' ? `<label class="f">Số tháng không có lương<input class="in" id="b_months" type="number" min="1" max="12" value="${Math.min(b.months, 12)}"></label>`
    : b.type === 'incomecut' ? `<div class="grid2"><label class="f">Giảm (%)<input class="in" id="b_pct" type="number" min="5" max="90" value="${b.pct}"></label><label class="f">Trong (tháng)<input class="in" id="b_months" type="number" min="1" max="36" value="${b.months}"></label></div>`
    : `<div class="grid2"><label class="f">Số tiền cần<input class="in num" id="b_target" value="${fmtIn(b.target)}" inputmode="numeric"></label><label class="f">Trong (tháng)<input class="in" id="b_months" type="number" min="1" max="120" value="${b.months}"></label></div>`;
  return modelCard(M) + `<section class="card"><div class="card-h"><h2>Hỏi Twin</h2></div>
    <form class="ask-box" id="twinform"><input class="in" id="twinq" value="${esc(twinQ)}" placeholder="Nếu… thì sao?" aria-label="Câu hỏi mô phỏng"><button class="btn">Mô phỏng</button></form>
    <div class="chips" style="margin-top:10px">${QUICK4.map(q => `<button class="chip" data-act="twinq" data-v="${esc(q)}">${esc(q)}</button>`).join('')}</div>
    <details class="builder" style="margin-top:12px"><summary>${ic('chev', 'chev')} Hoặc tự chọn kịch bản</summary><div class="stack" style="margin-top:10px;gap:10px">
      <div class="segs">${types.map(([k, v]) => `<button class="${b.type === k ? 'on' : ''}" data-act="btype" data-id="${k}">${v}</button>`).join('')}</div>${fields}
      <button class="btn block" data-act="brun">${ic('twin')} Chạy mô phỏng</button></div></details></section>
    ${twinRes ? resultView(twinRes) : `<div class="card empty">${ic('twin')}<b>Chọn một câu hỏi để xem hai dòng thời gian</b><span class="small">Kịch bản hiện tại và sau quyết định, đặt cạnh nhau.</span></div>`}`;
}
function cell(r, v) {
  if (r.fmt === 'money') return money(v);
  if (r.fmt === 'perday') return money(v) + '/ngày';
  if (r.fmt === 'month') return v ? FT.mFull(v) : (r.key === 'goal' && v === null ? '—' : 'quá 3 năm');
  if (r.fmt === 'months') return !v.length ? 'Không có' : v.length > 3 ? `${FT.mShort(v[0])} → ${FT.mShort(v[v.length - 1])} (${v.length} tháng)` : v.map(FT.mShort).join(', ');
  return esc(v);
}
function resultView(w) {
  if (w.kind === 'goal') return goalResultView(w);
  const vicon = w.verdict === 'good' ? 'check' : w.verdict === 'warn' ? 'warn' : 'close';
  const head = w.vtext.split('. '); const first = head.shift();
  const marks = w.after.points.filter((p, i) => p.raw < 0 && i % 6 === 0 && p.date <= FT.addDays(T(), 366)).map(p => ({ date: p.date, v: p.total }));
  return `<section class="card stack" style="gap:12px">
    <div class="eyebrow">${esc(w.title || 'Kết quả mô phỏng')}</div>
    <div class="verdict ${w.verdict}">${ic(vicon)}<div>${esc(first)}.${head.length ? ` <span>${esc(head.join('. '))}</span>` : ''}</div></div>
    <div class="wide"><table class="cmp"><thead><tr><th></th><th>Kịch bản hiện tại</th><th>Sau quyết định</th></tr></thead><tbody>
      ${w.rows.map(r => `<tr><td>${esc(r.label)}<span class="sub">${esc(r.sub)}</span></td><td>${cell(r, r.base)}${r.extra && r.extra[0] ? `<span class="ex">${esc(r.extra[0])}</span>` : ''}</td><td class="after ${r.worse ? 'worse' : ''}">${cell(r, r.after)}${r.extra && r.extra[1] ? `<span class="ex">${esc(r.extra[1])}</span>` : ''}</td></tr>`).join('')}
    </tbody></table></div>
    <div><div class="row between" style="margin-bottom:6px"><b style="font-size:14px">Hai dòng thời gian · 12 tháng</b></div>
      <div class="legend2"><span><i style="border-color:var(--accent)"></i>Hiện tại</span><span><i style="border-color:var(--twin)"></i>Sau quyết định</span><span><i style="border-color:var(--bad);border-top-style:dotted"></i>Phải rút quỹ</span></div>
      ${multiChart([{ pts: w.chart.base.map(p => ({ date: p.date, v: p.total })), color: 'var(--accent)' }, { pts: w.chart.after.map(p => ({ date: p.date, v: p.total })), color: 'var(--twin)', dash: '5 4' }], { marks, label: 'Tổng tiền tài khoản cộng các quỹ, hai kịch bản' })}
      <p class="small muted" style="margin:4px 0 0">Tổng tiền trong tài khoản cộng các quỹ tiết kiệm.</p></div>
    ${w.info && w.info.pay ? `<div class="mini"><div class="ln"><span>Trả mỗi tháng</span><b>${money(w.info.pay)}</b></div><div class="ln"><span>Tổng phải trả</span><b>${money(w.info.total)}</b></div><div class="ln"><span>Tiền lãi</span><b>${money(w.info.interest)}</b></div></div>` : ''}
    ${w.goalRows.length > 1 ? `<div><b style="font-size:14px">Ảnh hưởng tới mục tiêu</b>${w.goalRows.map(g => `<div class="cutrow"><span>${esc(g.name)}</span><b class="${g.delay > 0 ? 'up' : ''}">${g.base ? FT.mShort(g.base) : '—'} → ${g.after ? FT.mShort(g.after) : 'quá 3 năm'}${g.delay > 0 && g.delay < 99 ? ` (+${g.delay} th)` : ''}</b></div>`).join('')}</div>` : ''}
    ${w.alternatives.length ? `<div><b style="font-size:14px">Phương án khác</b>${w.alternatives.map(a => `<div class="cutrow"><span><b>${esc(a.title)}</b><br><span class="muted">${esc(a.text)}</span></span></div>`).join('')}${w.sc.type === 'purchase' ? `<button class="btn-sm" data-act="altinst" style="margin-top:6px">Mô phỏng trả góp 0%</button>` : ''}</div>` : ''}
    <details class="builder"><summary>${ic('chev', 'chev')} Giả định của mô phỏng</summary><ul class="small muted" style="margin:8px 0 0;padding-left:18px">${w.assumptions.map(a => `<li>${esc(a)}</li>`).join('')}</ul></details>
    ${AI ? `<div id="twinai">${w.ai ? aiBlock(w.ai) : `<button class="btn ghost block" data-act="twinexplain">${ic('spark')} AI giải thích kết quả</button>`}</div>` : ''}
  </section>`;
}
function goalResultView(w) {
  const p = w.plan;
  return `<section class="card stack" style="gap:12px"><div class="eyebrow">Kế hoạch cho ${esc(p.name)}</div>
    <div class="verdict ${p.short > 0 ? 'warn' : 'good'}">${ic(p.short > 0 ? 'warn' : 'check')}<div>Cần để dành ${FT.vnd(p.need)}/tháng trong ${p.months} tháng. <span>${p.short > 0 ? `Thói quen hiện tại chưa đủ: thiếu ${FT.vnd(p.short)}/tháng, thực tế cần khoảng ${p.feasibleMonths} tháng.` : 'Làm được nếu theo các thay đổi dưới đây.'}</span></div></div>
    <div class="mini"><div class="ln"><span>${FT.vnd(p.target)} ÷ ${p.months} tháng</span><b>${money(p.need)}/tháng</b></div><div class="ln"><span>Dư tự do hiện tại${p.otherContrib ? ', sau mục tiêu khác' : ''} (giữ ${FT.vnd(p.margin)} làm đệm)</span><b>${money(Math.max(0, p.freeSurplus))}</b></div></div>
    <div><b style="font-size:14px">Cần thay đổi gì</b>${planItemsHtml(p)}</div>
    <div class="mini"><div class="ln"><span>Dự kiến đạt mục tiêu</span><b>${FT.mFull(FT.shiftM(FT.mkey(T()), p.short > 0 ? p.feasibleMonths : p.months))}</b></div>${p.otherContrib ? `<div class="ln"><span>Đang góp cho các mục tiêu khác</span><b>${money(p.otherContrib)}/tháng</b></div>` : ''}</div>
    <button class="btn block" data-act="adoptplan">${ic('coach')} Tạo mục tiêu và kế hoạch này</button></section>`;
}
function planItemsHtml(p) {
  return p.items.map(i => `<div class="plan-item"><div class="t">${esc(i.label)}</div><div class="amt">${money(i.monthly)}</div><div class="s">${esc(i.how)}${i.type === 'cut' ? ` · từ ${FT.vnd(i.base)} xuống ${FT.vnd(i.limit)}/tháng` : ''}</div></div>`).join('')
    + `<div class="plan-item"><div class="t">Chuyển vào quỹ ngay ngày nhận lương</div><div class="amt">${money(p.transfer)}</div><div class="s">Ngày ${p.payday} hằng tháng. Phần tiết kiệm được từ các khoản cắt (${FT.vnd(p.cutsTotal)}) chuyển vào cuối tháng.</div></div>`;
}
function runTwin(q, sc) {
  sc = sc || FT.parseScenario(q);
  if (!sc) { toast('Twin chưa hiểu câu hỏi. Thử: "Nếu mua laptop 20 triệu thì sao?"'); return; }
  if (sc.type === 'stress') { twinTab = 'stress'; stressCfg.jobLoss = sc.jobLoss || 0; if (sc.medical) { stressCfg.medicalOn = true; stressCfg.medical = sc.medical; } runStress(); return; }
  twinQ = q || '';
  if (sc.type === 'goal') { const p = FT.makePlan(S, { name: sc.name, target: sc.target, months: sc.months }); const w = FT.whatIf(S, sc, { followPlan }); twinRes = { kind: 'goal', plan: p, w, sc }; }
  else { twinRes = FT.whatIf(S, sc, { followPlan }); twinRes.title = titleOf(sc); }
  Object.assign(builder, sc.amount ? { amount: sc.amount } : {}, sc.months ? { months: sc.months } : {}, { type: sc.type === 'recurringUp' ? 'purchase' : sc.type }, sc.target ? { target: sc.target } : {}, sc.rate != null ? { rate: Math.round(sc.rate * 1000) / 10 } : {}, sc.pct ? { pct: Math.round(sc.pct * 100) } : {});
  tab = 'twin'; twinTab = 'whatif'; render(); setTimeout(() => { const el = document.querySelector('.verdict'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 30);
}
const titleOf = sc => sc.type === 'purchase' ? `Mua ${sc.label.toLowerCase()} ${FT.vnd(sc.amount)} hôm nay` : sc.type === 'installment' ? `Trả góp ${FT.vnd(sc.amount)} trong ${sc.months} tháng` : sc.type === 'jobloss' ? `Nghỉ việc ${sc.months} tháng` : sc.type === 'incomecut' ? `Thu nhập giảm ${Math.round(sc.pct * 100)}% trong ${sc.months} tháng` : 'Kết quả mô phỏng';

/* ---------- STRESS ---------- */
function viewStress() {
  const c = stressCfg, M = FT.model(S); const hasLoan = M.loans.length > 0;
  const segs = (key, opts, fmt) => `<div class="segs">${opts.map(o => `<button class="${c[key] === o ? 'on' : ''}" data-act="sset" data-k="${key}" data-v="${o}">${fmt(o)}</button>`).join('')}</div>`;
  const opt = (on, title, body) => `<div class="opt ${on ? 'on' : ''}"><div class="row between"><b>${title}</b></div>${body}</div>`;
  return `<section class="card"><div class="card-h"><h2>Chọn các biến cố</h2><span class="small muted">Có thể kết hợp</span></div><div class="opt-grid">
    ${opt(c.jobLoss > 0, 'Mất việc', segs('jobLoss', [0, 1, 2, 3], v => v ? v + ' tháng' : 'Không'))}
    ${opt(c.incomeCut > 0, 'Giảm thu nhập trong 6 tháng', segs('incomeCut', [0, .2, .3, .5], v => v ? Math.round(v * 100) + '%' : 'Không'))}
    ${opt(c.medicalOn, 'Phát sinh viện phí', `<div class="field-row"><button class="toggle ${c.medicalOn ? 'on' : ''}" data-act="stog" data-k="medicalOn" aria-label="Bật viện phí" aria-pressed="${c.medicalOn}"></button><input class="in num" id="s_medical" value="${fmtIn(c.medical)}" inputmode="numeric" aria-label="Số tiền viện phí"></div>`)}
    ${opt(c.rentUp > 0, 'Tăng tiền thuê nhà', segs('rentUp', [0, .1, .2, .3], v => v ? '+' + Math.round(v * 100) + '%' : 'Không'))}
    ${opt(c.emergencyOn, 'Khoản mua khẩn cấp', `<div class="field-row"><button class="toggle ${c.emergencyOn ? 'on' : ''}" data-act="stog" data-k="emergencyOn" aria-label="Bật khoản mua khẩn cấp" aria-pressed="${c.emergencyOn}"></button><input class="in num" id="s_emergency" value="${fmtIn(c.emergencyBuy)}" inputmode="numeric" aria-label="Số tiền mua khẩn cấp"></div>`)}
    ${hasLoan ? opt(c.loanUp > 0, 'Lãi vay tăng', segs('loanUp', [0, .2, .5], v => v ? '+' + Math.round(v * 100) + '% kỳ trả' : 'Không')) : ''}
  </div><button class="btn block" data-act="srun" style="margin-top:12px">${ic('life')} Chạy stress test</button><p class="small muted" style="margin:8px 0 0">Biến cố bắt đầu từ tháng sau. Khi thiếu tiền, app tạm dừng góp mục tiêu và rút quỹ dự phòng.</p></section>
  ${stressRes ? stressView(stressRes) : ''}`;
}
function runStress() {
  const c = stressCfg; c.medical = parseMoney(val('s_medical')) || c.medical; c.emergencyBuy = parseMoney(val('s_emergency')) || c.emergencyBuy;
  const cfg = { jobLoss: c.jobLoss, incomeCut: c.incomeCut, medical: c.medicalOn ? c.medical : 0, rentUp: c.rentUp, emergencyBuy: c.emergencyOn ? c.emergencyBuy : 0, loanUp: c.loanUp };
  if (!cfg.jobLoss && !cfg.incomeCut && !cfg.medical && !cfg.rentUp && !cfg.emergencyBuy && !cfg.loanUp) { toast('Hãy chọn ít nhất một biến cố.'); return; }
  stressRes = FT.stressTest(S, cfg); tab = 'twin'; twinTab = 'stress'; render();
  setTimeout(() => { const el = document.getElementById('stressres'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 30);
}
function stressView(r) {
  const ok = !r.runOut;
  return `<section class="card stack" id="stressres" style="gap:12px">
    <div class="verdict ${ok ? (r.reserveUsed > 0 ? 'warn' : 'good') : 'bad'}">${ic(ok ? 'shield' : 'warn')}<div>${ok ? (r.reserveUsed > 0 ? `Bạn vượt qua được, nhưng dùng ${FT.vnd(r.reserveUsed)} quỹ dự phòng.` : 'Bạn vượt qua kịch bản này mà không đụng quỹ dự phòng.') : `Quỹ dự phòng chỉ trụ được khoảng ${FT.months1(r.lasts)} tháng.`} <span>${ok ? '' : `Hết tiền từ ngày ${FT.dFull(r.runOut)}.`}</span></div></div>
    <div class="metric-grid">
      <div class="metric"><div class="k">Tổng cú sốc</div><div class="v">${money(r.shockTotal)}</div></div>
      <div class="metric"><div class="k">Quỹ dự phòng phải dùng</div><div class="v">${money(r.reserveUsed)}</div></div>
      <div class="metric"><div class="k">Xuống mức nguy hiểm</div><div class="v">${r.lowDay ? FT.dFull(r.lowDay) : 'Không'}</div></div>
      <div class="metric"><div class="k">Cần chuẩn bị thêm</div><div class="v ${r.needMore ? 'up' : ''}">${r.needMore ? money(r.needMore) : '0đ'}</div></div>
    </div>
    <div><div class="legend2"><span><i style="border-color:var(--accent)"></i>Bình thường</span><span><i style="border-color:var(--bad)"></i>Gặp biến cố</span><span><i style="border-color:var(--twin)"></i>Biến cố + cắt giảm</span></div>
    ${multiChart([{ pts: r.chart.base.map(p => ({ date: p.date, v: p.total })), color: 'var(--accent)' }, { pts: r.chart.after.map(p => ({ date: p.date, v: p.total })), color: 'var(--bad)' }, { pts: r.chart.surv.map(p => ({ date: p.date, v: p.total })), color: 'var(--twin)', dash: '5 4' }], { label: 'Tổng tiền trong 12 tháng khi gặp biến cố' })}
    <p class="small muted" style="margin:4px 0 0">"Xuống mức nguy hiểm" là khi tiền và quỹ dự phòng còn chưa đủ 1 tháng chi tiêu (${FT.vnd(r.M.burn)}).</p></div>
    <div><b style="font-size:14px">Nên cắt trước</b>${r.cuts.map(c => `<div class="cutrow"><span>${esc(c.label)}</span><b>${money(c.monthly)}/tháng</b></div>`).join('')}
    <div class="mini" style="margin-top:8px"><div class="ln"><span>Cắt tất cả các khoản trên</span><b>${money(FT.sum(r.cuts.map(c => c.monthly)))}/tháng</b></div><div class="ln"><span>Khi đó</span><b>${r.lastsSurv == null ? 'vượt qua 12 tháng' : `trụ ${FT.months1(r.lastsSurv)} tháng, cần thêm ${FT.vnd(r.needMoreSurv)}`}</b></div></div></div>
    <div class="mini"><div class="ln"><span>Quỹ khẩn cấp chuẩn (6 tháng chi tiêu)</span><b>${money(r.target6)}</b></div><div class="ln"><span>Hiện có</span><b>${money(r.M.reserve)}</b></div><div class="ln"><span>Còn thiếu</span><b>${money(r.gap6)}</b></div></div>
    ${r.gap6 > 0 ? `<button class="btn ghost block" data-act="plangap">${ic('coach')} Lập kế hoạch tăng quỹ khẩn cấp</button>` : ''}
  </section>`;
}

/* ---------- KẾ HOẠCH ---------- */
function viewPlan() {
  const seg = `<div class="seg" role="tablist">${[['coach', 'AI Coach'], ['budget', 'Ngân sách'], ['goals', 'Mục tiêu'], ['bills', 'Hóa đơn']].map(([k, v]) => `<button role="tab" aria-selected="${planTab === k}" class="${planTab === k ? 'on' : ''}" data-act="ptab" data-id="${k}" style="font-size:13px">${v}</button>`).join('')}</div>`;
  const v = planTab === 'coach' && !isPro() ? proLock('AI Coach dành cho Pro', 'Nhận kế hoạch tiết kiệm bằng số tiền cụ thể, đánh giá mỗi tuần và tự điều chỉnh.') : { coach: viewCoach, budget: viewBudget, goals: viewGoals, bills: viewBills }[planTab]();
  return header('Kế hoạch') + `<div class="stack">${seg}${v}</div>`;
}
function viewCoach() {
  const p = S.plan && S.plan.active ? S.plan : null;
  let html = '';
  if (p) {
    const g = S.goals.find(x => x.id === p.goalId); const R = FT.weeklyReview(S, p);
    html += `<section class="card"><div class="card-h"><div><div class="eyebrow">Kế hoạch đang chạy</div><h2 style="margin-top:2px">${esc(p.name)}: ${FT.vnd(p.target)} trong ${p.months} tháng</h2></div><span class="pill ${R.onTrack ? 'good' : 'warn'}">${R.onTrack ? 'Đúng hướng' : 'Cần điều chỉnh'}</span></div>
      ${g ? `<div class="row between small muted num" style="margin-bottom:6px"><span>${money(g.saved)} / ${money(g.target)}</span><span>Tháng ${R.elapsedM}/${p.months}</span></div><div class="prog"><span style="width:${Math.min(100, g.saved / g.target * 100)}%"></span></div>` : ''}
      <div class="mini" style="margin-top:10px"><div class="ln"><span>Mỗi tháng cần để dành</span><b>${money(p.need)}</b></div></div>
      <div style="margin-top:6px">${planItemsHtml(p)}</div></section>
    <section class="card"><div class="card-h"><div><h2>Đánh giá tuần</h2><div class="small muted">${FT.dShort(R.from)} – ${FT.dShort(R.to)}</div></div><span class="tag">${R.rows.filter(r => r.ok).length}/${R.rows.length} đạt</span></div>
      ${R.rows.map(r => `<div class="rev-row"><div class="row between"><b style="font-size:14px">${esc(r.it.label)}</b><span class="pill ${r.ok ? 'good' : 'warn'}">${r.ok ? 'Đạt' : r.kind === 'pause' ? 'Chưa làm' : 'Vượt'}</span></div>
        ${r.kind === 'cut' ? `<div class="prog"><span style="width:${r.weekLimit ? Math.min(100, r.week / r.weekLimit * 100) : 100}%;background:${r.ok ? 'var(--accent)' : 'var(--warn)'}"></span></div><div class="small muted">Tuần này ${FT.vnd(r.week)} / giới hạn ${FT.vnd(r.weekLimit)} · tuần trước ${FT.vnd(r.prevWeek)}</div>`
        : `<div class="small muted">${esc(r.status)}</div>${!r.ok ? `<div class="chips">${r.bills.filter(b => !b.paused).map(b => `<button class="chip" data-act="pausebill" data-id="${b.id}">${ic('pause')} Tạm dừng ${esc(b.name)}</button>`).join('')}</div>` : ''}`}</div>`).join('')}
      <div class="rev-row"><div class="row between"><b style="font-size:14px">Chuyển vào quỹ tháng này</b><span class="pill ${R.transferOk ? 'good' : 'warn'}">${R.transferOk ? 'Đã chuyển' : 'Chưa chuyển'}</span></div><div class="small muted">${FT.vnd(R.transferred)} / ${FT.vnd(p.transfer)}</div>${!R.transferOk && g ? `<div><button class="btn-sm acc" data-act="contribute" data-id="${g.id}">Góp ngay</button></div>` : ''}</div>
      ${R.adjust.length ? `<div class="mini" style="margin-top:8px"><b>Điều chỉnh cho tuần tới</b>${R.adjust.map(a => `<div>• ${esc(a)}</div>`).join('')}</div>` : `<div class="mini" style="margin-top:8px"><b>Giữ nguyên kế hoạch. Tuần này bạn làm tốt.</b></div>`}
      ${AI ? `<div id="coachai" style="margin-top:10px">${S._coachAi ? aiBlock(S._coachAi) : `<button class="btn ghost block" data-act="coachai">${ic('spark')} AI nhận xét tuần này</button>`}</div>` : ''}
    </section><button class="btn ghost block" data-act="endplan">${S._confirmEnd ? 'Bấm lần nữa để kết thúc kế hoạch' : 'Kết thúc kế hoạch'}</button>`;
  }
  const f = planForm;
  html += `<section class="card"><div class="card-h"><h2>${p ? 'Tạo kế hoạch khác' : 'Tạo kế hoạch tiết kiệm'}</h2></div>
    <p class="small muted" style="margin:0 0 10px">AI Coach lập kế hoạch bằng số tiền cụ thể từ thói quen chi tiêu của bạn, rồi đánh giá mỗi tuần.</p>
    <div class="chips" style="margin-bottom:10px">${[['Mua laptop', 15000000, 6], ['Quỹ khẩn cấp', 30000000, 12], ['Đi du lịch', 10000000, 5], ['Trả hết nợ thẻ', 8000000, 4]].map(([n, t, m]) => `<button class="chip" data-act="pform" data-n="${n}" data-t="${t}" data-m="${m}">${n}</button>`).join('')}</div>
    <label class="f">Mục tiêu<input class="in" id="pf_name" value="${esc(f.name)}" placeholder="Ví dụ: Mua laptop"></label>
    <div class="grid2" style="margin-top:10px"><label class="f">Số tiền cần<input class="in num" id="pf_target" value="${fmtIn(f.target)}" inputmode="numeric"></label><label class="f">Trong (tháng)<input class="in" id="pf_months" type="number" min="1" max="60" value="${f.months}"></label></div>
    <button class="btn block" data-act="makeplan" style="margin-top:12px">${ic('coach')} Lập kế hoạch</button></section>`;
  if (draftPlan) html += `<section class="card stack" style="gap:10px"><div class="verdict ${draftPlan.short > 0 ? 'warn' : 'good'}">${ic(draftPlan.short > 0 ? 'warn' : 'check')}<div>Cần ${FT.vnd(draftPlan.need)}/tháng. <span>${draftPlan.short > 0 ? `Còn thiếu ${FT.vnd(draftPlan.short)}/tháng sau mọi cắt giảm; thực tế cần khoảng ${draftPlan.feasibleMonths} tháng.` : 'Kế hoạch dưới đây đủ để đạt mục tiêu đúng hạn.'}</span></div></div>${planItemsHtml(draftPlan)}<button class="btn block" data-act="startplan">${p && !S._confirmReplace ? 'Bắt đầu (thay kế hoạch đang chạy)' : S._confirmReplace ? 'Bấm lần nữa để thay kế hoạch' : 'Bắt đầu kế hoạch'}</button></section>`;
  return html;
}
function viewBudget() {
  const bs = FT.budgetStatus(S); const f = FT.forecast(S);
  const spendB = bs.filter(b => b.cat !== 'tiet-kiem'); const tot = FT.sum(spendB.map(b => b.limit)), used = FT.sum(spendB.map(b => b.spent));
  if (!bs.length) return `<div class="card empty">${ic('target')}<b>Chưa đặt ngân sách</b><button class="btn" data-act="editbudget">Đặt ngân sách</button></div>`;
  return `<div class="card"><div class="row between"><div><div class="eyebrow">Tháng ${FT.pd(f.T).m} · đã qua ${f.d}/${f.L} ngày</div><div style="font-family:var(--f-display);font-size:24px;font-weight:600" class="num">${money(used)} <span class="muted" style="font-size:15px;font-weight:500">/ ${money(tot)}</span></div></div><button class="btn-sm" data-act="editbudget">${ic('edit')} Sửa</button></div>
    <div class="prog" style="margin-top:10px"><span style="width:${Math.min(100, used / tot * 100)}%;background:${used > tot ? 'var(--bad)' : 'var(--accent)'}"></span><i class="tick" style="left:${f.d / f.L * 100}%"></i></div>
    <p class="small muted" style="margin:8px 0 0">Vạch đứng là vị trí hôm nay trong tháng. Thanh vượt qua vạch là đang tiêu nhanh hơn kế hoạch.</p></div>
  <div class="card">${bs.map(b => { const c = FT.catOf(b.cat); const sav = b.cat === 'tiet-kiem';
    const col = sav ? 'var(--accent)' : b.level === 'over' ? 'var(--bad)' : b.level === 'p90' || b.fast || b.level === 'p70' ? 'var(--warn)' : 'var(--accent)';
    const pill = sav ? (b.pct >= 1 ? '<span class="pill good">Đã đạt</span>' : `<span class="pill neutral">${Math.round(b.pct * 100)}%</span>`) : b.level === 'over' ? '<span class="pill bad">Vượt</span>' : b.level === 'p90' ? '<span class="pill warn">90%</span>' : b.fast ? '<span class="pill warn">Tiêu nhanh</span>' : b.level === 'p70' ? '<span class="pill warn">70%</span>' : '<span class="pill good">Ổn</span>';
    return `<div class="budget"><div class="row">${catIco(b.cat)}<div class="grow"><div class="row between"><b>${c.name}</b>${pill}</div><div class="small muted num">${money(b.spent)} / ${money(b.limit)} · ${sav ? (b.pct >= 1 ? 'hoàn thành tháng này' : 'còn ' + FT.vnd(b.limit - b.spent)) : b.spent > b.limit ? 'vượt ' + FT.vnd(b.spent - b.limit) : 'còn ' + FT.vnd(b.limit - b.spent)}</div></div></div>
      <div class="prog"><span style="width:${Math.min(100, b.pct * 100)}%;background:${col}"></span>${sav ? '' : `<i class="mark70" style="left:70%"></i><i class="mark70" style="left:90%"></i><i class="tick" style="left:${b.timeRatio * 100}%"></i>`}</div>
      ${!sav && b.projected > b.limit && b.level !== 'over' ? `<div class="small" style="color:var(--warn)">Theo tốc độ này cả tháng sẽ là ${money(b.projected)}.</div>` : ''}</div>`; }).join('')}</div>`;
}
function viewGoals() {
  const sim = FT.simulate(S, {}, { months: 36, followPlan });
  return (S.goals.length ? S.goals.map(g => { const c = FT.goalCalc(S, g); const eta = sim.goalDone[g.id]; const dk = g.deadline ? FT.mkey(g.deadline) : null; const late = eta && dk && FT.mkey(eta) > dk;
    return `<section class="card goal"><div class="head"><h2>${esc(g.name)}${FT.isEmergency(g) ? ' <span class="pill twin" style="vertical-align:middle">Dự phòng</span>' : ''}</h2>${g.saved >= g.target ? '<span class="pill good">Hoàn thành</span>' : late || (!eta && g.saved < g.target) ? '<span class="pill warn">Chậm hạn</span>' : '<span class="pill good">Kịp hạn</span>'}</div>
    <div class="row between small muted num" style="margin:8px 0 6px"><span>${money(g.saved)} / ${money(g.target)}</span><span>${Math.round(c.pct * 100)}%</span></div>
    <div class="prog"><span style="width:${Math.min(100, c.pct * 100)}%"></span></div>
    <div class="facts">
      <div>${ic('calendar')}<span>Cần góp <b class="num">${money(c.need)}</b>/tháng để xong trước ${FT.mFull(dk || FT.mkey(T()))} (còn ${c.monthsLeft} tháng).</span></div>
      <div>${ic('twin')}<span>Theo bản sao dòng tiền: ${eta ? `dự kiến xong <b>${FT.mFull(FT.mkey(eta))}</b>` : 'chưa xong trong 3 năm với thói quen hiện tại'}.</span></div>
      <div>${ic('bulb')}<span>Bỏ góp 1 tháng: các tháng sau phải góp thêm <b class="num">${money(c.skipExtra)}</b>/tháng.</span></div>
    </div>
    <div class="row" style="margin-top:12px"><button class="btn-sm acc" data-act="contribute" data-id="${g.id}">${ic('plus')} Góp tiền</button><button class="btn-sm" data-act="editgoal" data-id="${g.id}">${ic('edit')} Sửa</button></div></section>`; }).join('') : `<div class="card empty">${ic('target')}<b>Chưa có mục tiêu</b><span class="small">Ví dụ: quỹ khẩn cấp, mua laptop, đi du lịch, trả hết nợ.</span></div>`)
    + `<button class="btn ghost block" data-act="editgoal">${ic('plus')} Thêm mục tiêu</button>`;
}
function viewBills() {
  const f = FT.forecast(S); const rec = FT.detectRecurring(S);
  const kinds = [['income', 'Thu nhập định kỳ'], ['bill', 'Hóa đơn'], ['loan', 'Khoản vay, trả góp'], ['sub', 'Dịch vụ đăng ký'], ['saving', 'Tiết kiệm tự động']];
  return `${rec.map((r, i) => `<div class="card" style="background:var(--twin-soft);box-shadow:none"><div class="row">${ic('repeat')}<div class="grow"><b>Phát hiện từ lịch sử: ${esc(r.name)}</b><div class="small">${money(r.amount)} quanh ngày ${r.day}, lặp ${r.count} lần. Thêm để dự báo chính xác hơn.</div></div><button class="btn-sm acc" data-act="addrec" data-i="${i}">Thêm</button></div></div>`).join('')}
  <div class="card"><div class="card-h"><h2>Lịch tháng ${FT.pd(f.T).m}</h2><span class="small muted">Cố định ${money(FT.sum(FT.activeBills(S).filter(b => b.kind !== 'income').map(b => b.amount)))}</span></div>
  ${kinds.map(([k, label]) => { const bs = S.bills.filter(b => b.kind === k).sort((a, b) => a.day - b.day); if (!bs.length) return '';
    return `<div class="eyebrow" style="margin:12px 0 2px">${label}</div>` + bs.map(b => { const paid = FT.billPaid(S, b, f.mk); const left = b.day - f.d; const done = b.kind === 'loan' && b.monthsLeft === 0;
      const st = b.paused ? '<span class="pill neutral">Tạm dừng</span>' : done ? '<span class="pill good">Đã trả xong</span>' : paid ? `<span class="pill good">${k === 'income' ? 'Đã nhận' : 'Đã trả'}</span>` : `<button class="pill ${left < 0 ? 'bad' : 'twin'}" data-act="paybill" data-id="${b.id}">${ic('check')} ${k === 'income' ? 'Đã nhận' : 'Đã trả'}</button>`;
      const sub = `Ngày ${b.day} · ${esc(FT.accName(S, b.account))}${b.kind === 'loan' && b.monthsLeft != null ? ` · còn ${b.monthsLeft} kỳ` : ''}${b.kind === 'sub' ? ` · ${b.usage === 'rarely' ? 'ít dùng' : b.usage === 'often' ? 'dùng thường xuyên' : 'chưa đánh giá'}` : ''}`;
      return `<div class="li" style="${b.paused ? 'opacity:.6' : ''}">${catIco(b.cat)}<div class="main tap" data-act="editbill" data-id="${b.id}" style="cursor:pointer"><div class="t">${esc(b.name)}</div><div class="s">${sub}</div></div><div style="display:grid;justify-items:end;gap:4px"><span class="amt ${k === 'income' ? 'in' : ''}">${money(b.amount)}</span>${st}</div></div>`; }).join(''); }).join('')}
  </div><button class="btn ghost block" data-act="editbill">${ic('plus')} Thêm khoản định kỳ</button>
  <p class="small muted" style="margin:0">Nhắc nhở hiện trên Tổng quan 3 ngày trước hạn. Bản ứng dụng chính thức sẽ gửi thông báo đẩy.</p>`;
}

/* ---------- AI: chatbot + kiểm tra số ---------- */
const RULES = `Bạn là Financial Twin, trợ lý tài chính cá nhân nói tiếng Việt. Xưng "tôi", gọi người dùng là "bạn".
QUY TẮC SỐ LIỆU: Bạn KHÔNG được tự tính hay tự đặt ra con số. Khi cần số, gọi công cụ (nếu có) hoặc dùng đúng các số trong KẾT QUẢ TÍNH SẴN. Mọi con số bạn viết phải xuất hiện trong kết quả công cụ hoặc dữ liệu được cung cấp. App sẽ tự kiểm tra từng con số.
CÁCH TRẢ LỜI: câu đầu là kết luận, in đậm bằng **...**. Sau đó 2–5 dòng giải thích bằng số thật, liệt kê bằng dòng bắt đầu "- ". Viết tiền dạng 1.250.000đ. Tối đa khoảng 130 chữ. Không tiêu đề, không bảng, không emoji.
GIỚI HẠN: chỉ tư vấn chi tiêu, tiết kiệm, trả nợ, kế hoạch. Không khuyên mua cổ phiếu, tiền số hay sản phẩm tài chính cụ thể. Bạn không có quyền ghi dữ liệu hay chuyển tiền. Thiếu dữ liệu thì nói rõ.`;
function logAI(purpose, payload, images = 0) {
  S.aiLog.unshift({ t: new Date().toISOString(), purpose, chars: payload.length, images, preview: payload.slice(0, 2400) });
  S.aiLog = S.aiLog.slice(0, 30); save();
}
const compactWhatIf = w => ({ ket_luan: w.vtext, muc_do: w.verdict, so_sanh: w.rows.map(r => ({ chi_so: `${r.label} (${r.sub})`, hien_tai: cellText(r, r.base), sau_quyet_dinh: cellText(r, r.after), ghi_chu: r.extra })), muc_tieu: w.goalRows.map(g => ({ ten: g.name, hien_tai: g.base, sau: g.after, cham_thang: g.delay })), thong_tin: w.info, gia_dinh: w.assumptions, phuong_an_khac: w.alternatives });
function cellText(r, v) { if (r.fmt === 'money') return FT.vnd(v); if (r.fmt === 'perday') return FT.vnd(v) + '/ngày'; if (r.fmt === 'month') return v ? FT.mFull(v) : 'quá 3 năm'; if (r.fmt === 'months') return v.length ? v.map(FT.mShort).join(', ') : 'không có'; return v; }
const compactStress = r => ({ tru_duoc_thang: r.lasts == null ? 'vượt qua 12 tháng' : Math.round(r.lasts * 10) / 10, het_tien_ngay: r.runOut, xuong_muc_nguy_hiem: r.lowDay, tong_cu_soc: r.shockTotal, quy_du_phong_phai_dung: r.reserveUsed, can_chuan_bi_them: r.needMore, nen_cat_truoc: r.cuts.map(c => ({ khoan: c.label, moi_thang: c.monthly })), neu_cat_het: r.lastsSurv == null ? 'vượt qua 12 tháng' : Math.round(r.lastsSurv * 10) / 10, quy_6_thang_can: r.target6, con_thieu: r.gap6 });
const compactPlan = p => ({ can_moi_thang: p.need, chuyen_ngay_luong: p.transfer, cat_giam: p.items.map(i => ({ khoan: i.label, moi_thang: i.monthly, cach_lam: i.how })), tong_cat_giam: p.cutsTotal, van_thieu_moi_thang: p.short, so_thang_thuc_te: p.feasibleMonths, du_tu_do_hien_tai: Math.round(p.freeSurplus) });
const compactHealth = H => ({ diem: H.total, xep_loai: H.band[1], yeu_to: H.factors.map(f => ({ ten: f.name, diem: `${f.points}/${f.weight}`, hien_trang: f.value, giai_thich: f.explain, cai_thien: f.tip })) });
const compactAlerts = A => A.slice(0, 6).map(a => ({ tieu_de: a.title, chuyen_gi: a.what, vi_sao: a.why, anh_huong: a.impact, nen_lam: a.action, do_tin_cay: a.confidence == null ? null : Math.round(a.confidence * 100) + '%' }));
function makeTools(sink) {
  const wrap = (name, fn) => (input) => { const out = fn(input || {}); sink.push({ name, out }); return out; };
  return [
    { name: 'get_overview', description: 'Tổng quan tài chính hôm nay: được tiêu bao nhiêu, ngày lương, tiền hiện có, nợ thẻ, quỹ dự phòng, điểm sức khỏe, cảnh báo chính.', execute: wrap('get_overview', () => FT.overview(S)) },
    { name: 'simulate_decision', description: 'Mô phỏng một quyết định trên bản sao dòng tiền và trả về bảng so sánh hiện tại / sau quyết định. type: purchase (mua một lần), installment (trả góp/vay), jobloss (nghỉ việc, mất lương), incomecut (giảm thu nhập), goal (muốn tích lũy số tiền trong số tháng).', inputSchema: { type: 'object', properties: { type: { type: 'string', enum: ['purchase', 'installment', 'jobloss', 'incomecut', 'goal'] }, amount: { type: 'number', description: 'VND' }, months: { type: 'number' }, rate_percent_per_month: { type: 'number' }, cut_percent: { type: 'number' }, label: { type: 'string' } }, required: ['type'] },
      execute: wrap('simulate_decision', i => { const ty = String(i.type); const amt = Number(i.amount) || 20000000; const mo = Number(i.months) || (ty === 'jobloss' ? 2 : 12);
        if (ty === 'goal') { const p = FT.makePlan(S, { name: i.label || 'Mục tiêu mới', target: amt, months: mo }); return compactPlan(p); }
        const sc = ty === 'purchase' ? { type: ty, amount: amt, label: i.label || 'Khoản mua' } : ty === 'installment' ? { type: ty, amount: amt, months: mo, rate: (Number(i.rate_percent_per_month) || 0) / 100, label: i.label || 'Trả góp' } : ty === 'jobloss' ? { type: ty, months: mo } : { type: 'incomecut', pct: (Number(i.cut_percent) || 30) / 100, months: mo };
        return compactWhatIf(FT.whatIf(S, sc, { followPlan })); }) },
    { name: 'stress_test', description: 'Chạy stress test với các biến cố kết hợp và trả về quỹ dự phòng trụ được bao lâu, ngày nguy hiểm, khoản nên cắt trước, cần chuẩn bị thêm bao nhiêu.', inputSchema: { type: 'object', properties: { job_loss_months: { type: 'number' }, income_cut_percent: { type: 'number' }, medical_cost: { type: 'number' }, rent_increase_percent: { type: 'number' }, emergency_purchase: { type: 'number' }, loan_rate_increase_percent: { type: 'number' } } },
      execute: wrap('stress_test', i => compactStress(FT.stressTest(S, { jobLoss: Number(i.job_loss_months) || 0, incomeCut: (Number(i.income_cut_percent) || 0) / 100, medical: Number(i.medical_cost) || 0, rentUp: (Number(i.rent_increase_percent) || 0) / 100, emergencyBuy: Number(i.emergency_purchase) || 0, loanUp: (Number(i.loan_rate_increase_percent) || 0) / 100 }))) },
    { name: 'spending', description: 'Tổng chi tiêu theo kỳ, có thể lọc theo từ khóa (tên cửa hàng như grab, shopee, highlands; hoặc nhóm như ăn uống, giao đồ ăn). Trả về tổng, số giao dịch, theo nhóm và nơi chi nhiều nhất.', inputSchema: { type: 'object', properties: { period: { type: 'string', enum: ['this_month', 'last_month', 'last_7_days', 'last_30_days'] }, query: { type: 'string' } } },
      execute: wrap('spending', i => FT.spendingBreakdown(S, String(i.period || 'this_month'), i.query ? String(i.query) : '')) },
    { name: 'health_score', description: 'Điểm sức khỏe tài chính 0–100 và 6 yếu tố có giải thích, cách cải thiện.', execute: wrap('health_score', () => compactHealth(FT.health(S))) },
    { name: 'list_alerts', description: 'Các cảnh báo chủ động hiện tại, mỗi cảnh báo có chuyện gì, vì sao, ảnh hưởng, nên làm gì, độ tin cậy.', execute: wrap('list_alerts', () => compactAlerts(FT.alerts2(S))) },
    { name: 'savings_plan_status', description: 'Kế hoạch tiết kiệm đang chạy và đánh giá 7 ngày qua.', execute: wrap('savings_plan_status', () => { const p = S.plan && S.plan.active ? S.plan : null; if (!p) return { co_ke_hoach: false }; const R = FT.weeklyReview(S, p); return { ...compactPlan(p), ten: p.name, danh_gia_tuan: R.rows.map(r => ({ khoan: r.it.label, dat: r.ok, trang_thai: r.status })), da_chuyen_thang_nay: R.transferred, dieu_chinh: R.adjust }; }) },
  ];
}
function aiBlock(a) {
  const v = a.verify; const ok = v && v.bad.length === 0;
  return `<div class="msg-a" style="max-width:100%">${a.pending && !a.text ? '<span class="typing">Đang tính…</span>' : md(a.text)}
    ${v ? `<div><span class="verify ${ok ? 'ok' : 'no'}">${ic(ok ? 'check' : 'warn')}${ok ? (v.total ? `${v.ok}/${v.total} con số khớp bộ máy tính toán` : 'Không có con số nào cần kiểm tra') : `${v.bad.length} con số chưa khớp: ${esc(v.bad.slice(0, 2).map(b => b.raw).join(', '))}`}</span></div>` : ''}
    ${a.tools && a.tools.length ? `<div class="tools-used">${a.tools.map(t => `<span>${esc(toolName(t))}</span>`).join('')}</div>` : ''}
    ${a.local && v && !ok ? `<details class="builder" style="margin-top:6px"><summary>${ic('chev', 'chev')} Xem bản tính chuẩn</summary><div style="margin-top:6px">${md(a.local)}</div></details>` : ''}
    ${a.logIdx != null ? `<div style="margin-top:6px"><button class="linkbtn" data-act="ailog">Xem dữ liệu đã gửi AI</button></div>` : ''}</div>`;
}
const toolName = t => ({ get_overview: 'Tổng quan', simulate_decision: 'Mô phỏng quyết định', stress_test: 'Stress test', spending: 'Tra cứu chi tiêu', health_score: 'Điểm sức khỏe', list_alerts: 'Cảnh báo', savings_plan_status: 'Kế hoạch' }[t] || t);
function md(s) { return esc(s).split('\n').reduce((acc, line) => { const li = line.match(/^\s*[-•*]\s+(.*)/); if (li) { if (!acc.inList) { acc.h += '<ul>'; acc.inList = true; } acc.h += `<li>${inl(li[1])}</li>`; } else { if (acc.inList) { acc.h += '</ul>'; acc.inList = false; } if (line.trim()) acc.h += `<p>${inl(line)}</p>`; } return acc; }, { h: '', inList: false }).h + ''; }
const inl = s => s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|\s)_(.+?)_(?=\s|$|[.,])/g, '$1<em>$2</em>');
async function aiAnswer(question, localObj, history, opts = {}) {
  // trả về {text, verify, tools, logIdx, local}
  const sink = [];
  const allowed = FT.collectNumbers(FT.overview(S));
  FT.numbersInText(question).forEach(n => allowed.add(n.v));
  const localData = localObj ? localObj.data : null;
  const ctxData = localObj ? localObj.ctx : null;
  if (ctxData) FT.collectNumbers(ctxData, allowed);
  const turns = [{ role: 'user', content: RULES + (AItools && !opts.noTools ? '\n\nBạn có các công cụ tính toán; hãy gọi công cụ phù hợp trước khi trả lời.' : '') + `\n\nTỔNG QUAN HIỆN TẠI:\n${JSON.stringify(FT.overview(S))}` + (ctxData ? `\n\nKẾT QUẢ TÍNH SẴN:\n${JSON.stringify(ctxData)}` : '') }];
  (history || []).slice(-6).forEach(m => turns.push({ role: m.role, content: m.content || '…' }));
  turns.push({ role: 'user', content: question });
  const payload = turns.map(t => t.content).join('\n---\n');
  logAI(opts.purpose || 'Chatbot', payload);
  const o = { cache: false, onText: opts.onText };
  if (AItools && !opts.noTools) o.tools = makeTools(sink);
  if (!o.tools) o.modelTier = 'default';
  const { text } = await AI(turns, o);
  sink.forEach(s => FT.collectNumbers(s.out, allowed));
  if (sink.length) { S.aiLog[0].preview += '\n\n[Kết quả công cụ đã gửi lại cho AI]\n' + JSON.stringify(sink.map(s => ({ cong_cu: s.name, ket_qua: s.out }))).slice(0, 2400); save(); }
  return { text, verify: FT.verifyNumbers(text, allowed), tools: sink.map(s => s.name), logIdx: 0 };
}

/* ---------- Chat sheet ---------- */
const CHATQ = ['Hôm nay tôi được tiêu bao nhiêu?', 'Tháng này tôi chi bao nhiêu cho Grab?', 'Nếu mua điện thoại 20 triệu hôm nay thì sao?', 'Điểm sức khỏe tài chính của tôi thế nào?', 'Có gì bất thường tôi cần chú ý?', 'Muốn có 100 triệu sau hai năm thì cần thay đổi gì?'];
function openChat() {
  if (!isPro()) { openPricing('Chatbot AI là tính năng Pro.'); return; }
  $('#layer').innerHTML = `<div class="scrim" data-act="scrim"><div class="sheet full" role="dialog" aria-modal="true" aria-label="Chatbot tài chính"><div class="sheet-h"><span class="cico" style="background:var(--twin-soft);color:var(--twin)">${ic('chat')}</span><h2>Hỏi Twin</h2><button class="iconbtn" data-act="close" aria-label="Đóng">${ic('close')}</button></div>
    <div class="chatwrap"><div class="chatlog" id="chatlog">${chatHtml()}</div>
    <form class="chat-composer" id="chatform"><input class="in" id="chatin" placeholder="Hỏi về tiền của bạn…" autocomplete="off" aria-label="Câu hỏi"><button class="send" aria-label="Gửi">${ic('send')}</button></form></div></div></div>`;
  scrollChat();
}
function chatHtml() {
  return `<div class="msg-a"><p><b>Tôi là bản sao tài chính của bạn.</b> Tôi trả lời bằng số liệu thật trong app. Mọi con số do bộ máy tính toán đưa ra, tôi chỉ giải thích.</p><div class="by">${AI ? `${ic('spark')} AI đang bật${AItools ? ' · gọi công cụ tính toán' : ''} · tự kiểm tra số liệu` : `${ic('chart')} Chế độ tính tự động`}</div></div>
    ${chat.map((m, i) => m.role === 'user' ? `<div class="msg-u">${esc(m.content)}</div>` : msgA(m, i)).join('')}
    <div class="chips">${CHATQ.map((q, i) => `<button class="chip" data-act="chatq" data-i="${i}">${esc(q)}</button>`).join('')}</div><div id="chatEnd"></div>`;
}
function msgA(m, i) {
  return `<div class="msg-a">${m.pending && !m.content ? '<span class="typing">Đang tính…</span>' : md(m.content)}${m.card ? cardHtml(m.card) : ''}
    ${m.verify ? `<div><span class="verify ${m.verify.bad.length ? 'no' : 'ok'}">${ic(m.verify.bad.length ? 'warn' : 'check')}${m.verify.bad.length ? `${m.verify.bad.length} con số chưa khớp: ${esc(m.verify.bad.slice(0, 2).map(b => b.raw).join(', '))}` : m.verify.total ? `${m.verify.ok}/${m.verify.total} con số khớp bộ máy tính toán` : 'Không có con số cần kiểm tra'}</span></div>` : ''}
    ${m.tools && m.tools.length ? `<div class="tools-used">Đã gọi: ${m.tools.map(t => `<span>${esc(toolName(t))}</span>`).join('')}</div>` : ''}
    ${m.local && m.verify && m.verify.bad.length ? `<details class="builder" style="margin-top:6px"><summary>${ic('chev', 'chev')} Xem bản tính chuẩn</summary><div style="margin-top:6px">${md(m.local)}</div></details>` : ''}
    ${m.by ? `<div class="by">${m.by}</div>` : ''}${m.logIdx != null ? `<button class="linkbtn" data-act="ailog" style="margin-top:4px">Xem dữ liệu đã gửi AI</button>` : ''}</div>`;
}
function cardHtml(c) {
  if (c.kind === 'whatif') { const w = c.data; return `<div class="mini">${w.rows.slice(0, 4).map(r => `<div class="ln"><span>${esc(r.label)}</span><b class="${r.worse ? 'up' : ''}">${cellText(r, r.after)}</b></div>`).join('')}</div><button class="linkbtn" data-act="opentwin" data-v="${esc(c.q)}" style="margin-top:6px">Mở trong Twin ${'→'}</button>`; }
  if (c.kind === 'stress') return `<button class="linkbtn" data-act="openstress" style="margin-top:6px">Mở Stress test ${'→'}</button>`;
  if (c.kind === 'goal') return `<button class="linkbtn" data-act="opentwin" data-v="${esc(c.q)}" style="margin-top:6px">Xem kế hoạch trong Twin ${'→'}</button>`;
  if (c.kind === 'health') return `<button class="linkbtn" data-act="health" style="margin-top:6px">Xem chi tiết điểm ${'→'}</button>`;
  return '';
}
function scrollChat() { const e = $('#chatEnd'); if (e) e.scrollIntoView({ block: 'end' }); }
function refreshChat() { const log = $('#chatlog'); if (log) { log.innerHTML = chatHtml(); scrollChat(); } }
async function askChat(q) {
  if (asking || !q.trim()) return; asking = true;
  const hist = chat.slice(); chat.push({ role: 'user', content: q });
  const loc = FT.localChat(q, S);
  const msg = { role: 'assistant', content: '', pending: true, card: loc.kind === 'whatif' || loc.kind === 'stress' || loc.kind === 'goal' || loc.kind === 'health' ? { kind: loc.kind, data: loc.data, q } : null };
  chat.push(msg); refreshChat();
  if (AI) {
    try {
      const ctx = !AItools ? ctxForLocal(loc) : null;
      const r = await aiAnswer(q, ctx ? { ctx } : null, hist.filter(m => !m.pending).map(m => ({ role: m.role, content: m.content })), { onText: ({ text }) => { msg.content = text; msg.pending = false; const els = document.querySelectorAll('#chatlog .msg-a'); const el = els[els.length - 1]; if (el) { el.innerHTML = md(text); scrollChat(); } } });
      msg.content = r.text; msg.verify = r.verify; msg.tools = r.tools; msg.logIdx = r.logIdx; msg.local = loc.md; msg.by = '';
    } catch (e) {
      if (['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled', 'capability_removed'].includes(e && e.code)) AI = null;
      if (e && e.code === 'tools_unavailable') AItools = false;
      msg.content = loc.md; msg.by = `${ic('chart')} Tính tự động bằng bộ máy${e && e.code === 'rate_limited' ? ' · AI đang bận' : ''}`;
    }
  } else { await new Promise(r => setTimeout(r, 300)); msg.content = loc.md; msg.by = `${ic('chart')} Tính tự động bằng bộ máy tính toán`; }
  msg.pending = false; asking = false; refreshChat();
}
function ctxForLocal(loc) {
  if (loc.kind === 'whatif') return compactWhatIf(loc.data);
  if (loc.kind === 'stress') return compactStress(loc.data);
  if (loc.kind === 'goal') return compactPlan(loc.data.plan);
  if (loc.kind === 'health') return compactHealth(loc.data);
  if (loc.kind === 'alerts') return compactAlerts(loc.data);
  if (loc.kind === 'safe') { const s = loc.data; return { duoc_tieu_hom_nay: s.safe, da_tieu: s.spentToday, con_lai: s.left, ngay_luong: s.nextPay, so_ngay: s.D, khoan_phai_tra: s.obl, du_phong: s.buffer, tien_hien_co: s.net, dang_chi_tb: s.pace, du_kien_truoc_luong: Math.round(s.atPace) }; }
  if (loc.kind === 'spend') return loc.data;
  return { tra_loi_tinh_san: loc.md };
}

/* ---------- Báo cáo, sức khỏe ---------- */
function openHealth() {
  const H = FT.health(S);
  sheet('Sức khỏe tài chính', `<div class="row" style="gap:16px">${gauge(H.total, H.band[0])}<div><div style="font-family:var(--f-display);font-size:22px;font-weight:600">${H.total}/100 · ${H.band[1]}</div><div class="small muted">Tổng của 6 yếu tố. Mỗi yếu tố có trọng số riêng.</div></div></div>
    ${H.factors.map(f => `<section class="card"><div class="row between"><b>${esc(f.name)}</b><span class="pill ${f.score >= .75 ? 'good' : f.score >= .4 ? 'warn' : 'bad'}">${f.points}/${f.weight}</span></div><div class="prog" style="margin:8px 0"><span style="width:${f.score * 100}%;background:${f.score >= .75 ? 'var(--good)' : f.score >= .4 ? 'var(--warn)' : 'var(--bad)'}"></span></div><div style="font-weight:600;font-size:14px">${esc(f.value)}</div><div class="small muted">${esc(f.explain)}</div>${f.lost ? `<div class="small" style="margin-top:6px">${ic('bulb')} ${esc(f.tip)} <b>(+${f.lost} điểm tối đa)</b></div>` : ''}</section>`).join('')}`, '', { full: true });
}
function openAllAlerts() { const A = FT.alerts2(S); sheet('Cảnh báo chủ động', `<p class="small muted" style="margin:0">Mỗi cảnh báo nói rõ chuyện gì xảy ra, vì sao, ảnh hưởng bao nhiêu tiền, nên làm gì và độ tin cậy.</p><div class="card">${alertList(A)}</div>`, '', { full: true }); }
function openReport() {
  if (!isPro()) { openPricing('Báo cáo tuần và tháng đầy đủ là tính năng Pro.'); return; }
  const r = FT.report(S, reportPeriod); const mx = Math.max(...r.cats.map(c => c[1]), 1); const diff = r.a.spend - r.b.spend;
  sheet('Báo cáo', `<div class="seg">${[['week', '7 ngày qua'], ['month', 'Tháng này']].map(([k, v]) => `<button class="${reportPeriod === k ? 'on' : ''}" data-act="rperiod" data-id="${k}">${v}</button>`).join('')}</div>
    <div class="eyebrow">${esc(r.label)}</div>
    <div class="stats"><div class="stat"><div class="k">Tổng thu</div><div class="v">${money(r.a.income)}</div></div><div class="stat"><div class="k">Tổng chi</div><div class="v">${money(r.a.spend)}</div><div class="s ${diff > 0 ? 'up' : 'down'}">${diff > 0 ? '▲' : '▼'} ${money(Math.abs(diff))} so với ${esc(r.prevLabel)}</div></div>
      <div class="stat"><div class="k">Tỷ lệ tiết kiệm</div><div class="v num">${r.rate == null ? '—' : Math.round(r.rate * 100) + '%'}</div><div class="s">${reportPeriod === 'week' ? 'Tuần có thể chưa có lương' : '(Thu − chi) ÷ thu'}</div></div><div class="stat"><div class="k">Đã để dành</div><div class="v">${money(r.a.saved)}</div></div></div>
    <section class="card"><div class="card-h"><h2>Nhóm chi nhiều nhất</h2></div><div class="stack" style="gap:10px">${r.cats.slice(0, 6).map(([c, v]) => { const pv = r.b.byCat[c] || 0; return `<div class="rep-bar"><span class="row" style="gap:6px;min-width:0"><span style="width:8px;height:8px;border-radius:3px;background:${FT.catOf(c).color};flex:none"></span><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${FT.catOf(c).name}</span></span><span class="track"><span style="width:${v / mx * 100}%;background:${FT.catOf(c).color}"></span></span><span class="v num">${money(v)}<br><span class="${v > pv ? 'up' : 'down'}" style="font-size:11px;font-weight:500">${v > pv ? '+' : '−'}${S.settings.hide ? '•••' : FT.short(Math.abs(v - pv))}</span></span></div>`; }).join('') || '<p class="muted small">Chưa có khoản chi.</p>'}</div></section>
    ${r.unusual.length ? `<section class="card"><div class="card-h"><h2>Khoản chi bất thường</h2></div>${r.unusual.map(a => `<div class="alert warn"><span class="bar"></span><div><div class="t">${esc(a.title)}</div><div class="b">${esc(a.body)}</div></div></div>`).join('')}</section>` : ''}
    <section class="card"><div class="card-h"><h2>Tiến độ mục tiêu</h2></div>${r.goals.map(({ g, c }) => `<div style="padding:6px 0"><div class="row between small"><b>${esc(g.name)}</b><span class="num muted">${Math.round(c.pct * 100)}%</span></div><div class="prog" style="margin-top:6px"><span style="width:${Math.min(100, c.pct * 100)}%"></span></div></div>`).join('') || '<p class="muted small">Chưa có mục tiêu.</p>'}</section>
    <section class="card" style="border:1.5px solid var(--accent)"><div class="card-h"><h2>3 việc nên làm tiếp theo</h2></div>${r.actions.map((a, i) => `<div class="action"><span class="n">${i + 1}</span><div><div style="font-weight:600">${esc(a.t)}</div><div class="small muted">${esc(a.d)}</div></div></div>`).join('')}</section>`, '', { full: true });
}

/* ---------- Thêm giao dịch ---------- */
let addMode = 'text', drafts = [], quick = { type: 'expense', cat: 'an-uong', amount: '', merchant: '', account: null };
let imp = null; // {drafts, opening, boot, steps, accountId, source}
let redact = null;
function openAdd(mode) { if (mode === 'file' && !isPro()) { openPricing('Nhập sao kê PDF/Excel là tính năng Pro. Bạn vẫn có thể ghi chép miễn phí bằng văn bản hoặc chọn nhanh.'); return; } if (!S.accounts.length && mode !== 'file') { openOnboard(); return; } addMode = mode || addMode; drafts = []; imp = null; renderAdd(); }
function renderAdd() {
  if (imp) return renderImport();
  if (redact) return renderRedact();
  if (drafts.length) return renderConfirm();
  const tabs = [['text', 'type', 'Gõ / nói'], ['image', 'camera', 'Ảnh'], ['file', 'doc', 'Sao kê, file'], ['quick', 'grid', 'Chọn nhanh']];
  let body = `<div class="seg">${tabs.map(([k, i, v]) => `<button class="${addMode === k ? 'on' : ''}" data-act="addmode" data-id="${k}" style="display:grid;justify-items:center;gap:2px;font-size:12.5px">${ic(i)}${v}</button>`).join('')}</div>`;
  if (addMode === 'text') body += `<label class="f">Nhập như khi nhắn tin, hoặc dán thông báo ngân hàng<textarea class="in" id="txtin" placeholder="Ăn trưa 45 nghìn&#10;Chiều nay đổ xăng 100 nghìn&#10;Grab 62k bằng thẻ, Highlands 59k momo"></textarea></label>
    <div class="chips">${['Ăn trưa 45 nghìn', 'Chiều nay đổ xăng 100 nghìn', 'Grab 62k bằng thẻ', 'Đi chợ 320k hôm qua', 'Nhận thưởng 2tr'].map(x => `<button class="chip" data-act="ex" data-v="${esc(x)}">${esc(x)}</button>`).join('')}<button class="chip" data-act="exnoti">Dán thông báo mẫu</button></div>
    <div class="note row" style="align-items:flex-start">${ic('mic')}<span>Muốn nói thay vì gõ? Chạm vào ô nhập rồi bấm micro trên bàn phím điện thoại. App tự nhận ra thông báo biến động số dư khi bạn dán vào, và che số tài khoản.</span></div>`;
  else if (addMode === 'image') body += `<div class="drop" id="drop">${ic('camera')}<b>Chụp hóa đơn hoặc ảnh giao dịch</b><span class="small muted">Bạn sẽ tô đen vùng nhạy cảm (số tài khoản, tên) trước khi ảnh được gửi cho AI.</span>
      <label class="btn" style="cursor:pointer">${ic('camera')} Chọn ảnh<input type="file" id="imgin" accept="image/*" hidden></label></div>
      ${AI && AIimg ? '' : `<div class="note">Bản xem này chưa gửi được ảnh cho AI. Dùng thử luồng xác nhận với ảnh mẫu bên dưới.</div>`}
      <div class="grid2"><button class="btn ghost" data-act="sampleimg" data-id="receipt">Hóa đơn mẫu</button><button class="btn ghost" data-act="sampleimg" data-id="statement">Ảnh giao dịch mẫu</button></div>`;
  else if (addMode === 'file') body += `<div class="drop" id="drop">${ic('upload')}<b>Tải sao kê PDF, file CSV hoặc Excel</b><span class="small muted">App đọc từng dòng, che số tài khoản, phát hiện giao dịch trùng, tự phân loại và đánh dấu dòng cần xem lại.</span>
      <label class="btn" style="cursor:pointer">${ic('upload')} Chọn file<input type="file" id="filein" accept=".pdf,.csv,.xlsx,.xls,.txt,application/pdf,text/csv" hidden></label></div>
      ${S.sample ? `<div class="note row" style="align-items:flex-start">${ic('bulb')}<span>Bạn đang xem dữ liệu mẫu. Sao kê bạn tải lên sẽ <b>dựng bảng điều khiển mới từ dữ liệu của bạn</b>, thay cho dữ liệu mẫu.</span></div>` : S.accounts.length ? `<label class="f">Ghi vào ví<select class="in" id="impacc">${accOpts((S.accounts.find(a => a.type === 'bank') || S.accounts[0]).id)}</select></label>` : ''}
      <section class="card stack" style="gap:8px"><b>Thử ngay với dữ liệu mẫu</b>
        <button class="btn block" data-act="demoboot">${ic('bolt')} Demo: dựng bảng điều khiển từ sao kê 3 tháng</button>
        ${S.accounts.length && !S.sample ? `<button class="btn ghost block" data-act="sampleweek">Nhập sao kê mẫu 7 ngày (có giao dịch trùng)</button>` : ''}
        <button class="btn ghost block" data-act="dlsample">${ic('download')} Tải file sao kê mẫu (CSV)</button></section>`;
  else { quick.account = quick.account && S.accounts.some(a => a.id === quick.account) ? quick.account : (S.accounts.find(a => a.type === 'cash') || S.accounts[0]).id;
    body += `<div style="display:flex;justify-content:center"><div class="typeseg">${[['expense', 'Chi'], ['income', 'Thu']].map(([k, v]) => `<button class="${quick.type === k ? 'on' : ''}" data-act="qtype" data-id="${k}">${v}</button>`).join('')}</div></div>
    <input class="in big num" id="qamt" inputmode="numeric" placeholder="0đ" value="${esc(quick.amount)}" aria-label="Số tiền">
    <div class="catgrid">${(quick.type === 'income' ? FT.INCATS : FT.CATS).map(c => `<button class="catbtn ${quick.cat === c.id ? 'on' : ''}" data-act="qcat" data-id="${c.id}"><span class="cico" style="background:${c.color}22;color:${c.color};width:32px;height:32px">${ic(c.icon)}</span>${c.name}</button>`).join('')}</div>
    <div class="grid2"><label class="f">Nội dung<input class="in" id="qmer" value="${esc(quick.merchant)}" placeholder="Không bắt buộc"></label><label class="f">Ví<select class="in" id="qacc">${accOpts(quick.account)}</select></label></div>`; }
  const foot = addMode === 'text' ? `<button class="btn block" data-act="parse">${ic('spark')} Nhận diện</button>` : addMode === 'quick' ? `<button class="btn block" data-act="quicknext">Kiểm tra & lưu</button>` : '';
  sheet('Thêm giao dịch', body, foot);
}
function renderConfirm() {
  const body = `<div class="note row">${ic('shield')}<span>Kiểm tra lại trước khi lưu. Bạn có thể sửa mọi trường.</span></div>` + drafts.map((d, i) => `<div class="draft">
    ${d.src ? `<div class="src">“${esc(d.src)}”</div>` : ''}
    ${d.ask ? `<div class="ask">${esc(d.ask.q)}<div class="chips">${d.ask.options.map(([c, l]) => `<button class="chip ${d.cat === c ? 'on' : ''}" data-act="answer" data-i="${i}" data-id="${c}">${l}</button>`).join('')}</div></div>` : ''}
    ${d.dup ? `<div class="note" style="background:var(--warn-soft);color:var(--warn)">${ic('warn')} Có thể trùng với ${esc(d.dup)}</div>` : ''}
    <div class="row between"><div class="typeseg">${[['expense', 'Chi'], ['income', 'Thu']].map(([k, v]) => `<button class="${d.type === k ? 'on' : ''}" data-act="dtype" data-i="${i}" data-id="${k}">${v}</button>`).join('')}</div>
      <div class="row" style="gap:6px">${d.learned ? '<span class="pill twin">Theo thói quen</span>' : ''}${d.sample ? '<span class="pill neutral">Mẫu</span>' : ''}<button class="iconbtn" style="width:34px;height:34px;box-shadow:none;background:var(--surface-2)" data-act="rmdraft" data-i="${i}" aria-label="Bỏ khoản này">${ic('close')}</button></div></div>
    <label class="f">Số tiền${d.missingAmount ? ' <span style="color:var(--bad)">· chưa nhận ra, hãy nhập</span>' : d.guessed ? ' <span style="color:var(--warn)">· đoán là nghìn đồng</span>' : ''}<input class="in num" data-f="amount" data-i="${i}" inputmode="numeric" value="${fmtIn(d.amount)}" style="font-weight:600;font-size:17px"></label>
    <div class="grid2"><label class="f">Danh mục<select class="in" data-f="cat" data-i="${i}">${catOpts(d.cat, d.type === 'income')}</select></label><label class="f">Ngày<input class="in" type="date" data-f="date" data-i="${i}" value="${d.date}"></label></div>
    <div class="grid2"><label class="f">Người bán / nội dung<input class="in" data-f="merchant" data-i="${i}" value="${esc(d.merchant)}"></label><label class="f">${d.type === 'income' ? 'Nhận vào' : 'Thanh toán bằng'}<select class="in" data-f="account" data-i="${i}">${accOpts(d.account)}</select></label></div>
  </div>`).join('');
  sheet('Xác nhận ' + drafts.length + ' giao dịch', body, `<button class="btn ghost" data-act="backadd" aria-label="Quay lại">${ic('back')}</button><button class="btn block" data-act="savedrafts">${ic('check')} Lưu ${drafts.length} giao dịch</button>`);
}
function markDupDrafts() { drafts.forEach(d => { const e = S.txns.find(t => t.type === d.type && t.amount === d.amount && Math.abs(FT.dayDiff(t.date, d.date)) <= 1 && FT.norm(t.merchant) === FT.norm(d.merchant)); d.dup = e ? `${e.merchant} ${FT.vnd(e.amount)} ngày ${FT.dShort(e.date)}` : null; }); }
function saveDrafts() {
  if (drafts.find(d => !d.amount || d.amount <= 0)) { toast('Có khoản chưa có số tiền.'); return; }
  const learned = [];
  drafts.forEach(d => { const key = FT.norm(d.merchant);
    if (d.type === 'expense' && d.autoCat && d.cat !== d.autoCat && !d.ask && key && key !== 'grab') { S.rules[key] = d.cat; learned.push(`${d.merchant} → ${FT.catOf(d.cat).name}`); }
    S.txns.push({ id: 'u' + FT.uid(), date: d.date, type: d.type, amount: Math.round(d.amount), cat: d.cat, merchant: d.merchant || FT.catOf(d.cat).name, account: d.account, note: d.note || undefined, src: d.srcLabel || undefined }); });
  const n = drafts.length; drafts = []; changed(); save(); closeSheet(); render();
  toast(learned.length ? `Đã lưu ${n} giao dịch. Đã nhớ: ${learned[0]}` : `Đã lưu ${n} giao dịch`);
}
const NOTI_SAMPLE = () => { const { d, m, y } = FT.pd(T()); return `VCB: TK 0011004567890 -156,000VND luc ${d}/${m}/${y} 12:41. SD 3,512,300VND. ND: GRABFOOD ORDER 88123\n\nTPBank: TK 02251987654 GD: -89,000VND ${d}/${m}/${y} 18:05 SD: 1,204,000VND ND: CIRCLE K TRAN DUY HUNG`; };
const SAMPLE_RECEIPT = () => [{ date: T(), type: 'expense', amount: 386000, cat: 'an-uong', merchant: 'WinMart', note: 'Hóa đơn 12 món', account: (S.accounts.find(a => a.type === 'credit') || S.accounts[0]).id, src: 'Ảnh hóa đơn mẫu: WinMart, tổng 386.000đ, quẹt thẻ' }];
const SAMPLE_SHOT = () => { const bank = (S.accounts.find(a => a.type === 'bank') || S.accounts[0]).id; return [
  { date: FT.addDays(T(), -1), type: 'expense', amount: 125000, cat: 'an-uong', merchant: 'ShopeeFood', account: bank, src: 'Dòng 1: SHOPEEFOOD -125,000' },
  { date: T(), type: 'income', amount: 500000, cat: 'thu-khac', merchant: 'Bạn trả tiền', account: bank, src: 'Dòng 2: NGUYEN VAN A chuyen tien +500,000' }]; };

// ảnh: tô đen vùng nhạy cảm rồi gửi AI
function startRedact(file) {
  const url = URL.createObjectURL(file); const img = new Image();
  img.onload = () => { const scale = Math.min(1, 1600 / Math.max(img.width, img.height)); redact = { img, w: Math.round(img.width * scale), h: Math.round(img.height * scale), boxes: [], url }; renderAdd(); };
  img.onerror = () => toast('Không mở được ảnh này.'); img.src = url;
}
function renderRedact() {
  sheet('Che vùng nhạy cảm', `<p class="small muted" style="margin:0">Kéo trên ảnh để tô đen số tài khoản, số thẻ, họ tên. Chỉ phần còn lại được gửi cho AI.</p><div class="redact-wrap"><canvas id="rcv" width="${redact.w}" height="${redact.h}"></canvas></div><div class="row"><button class="btn-sm" data-act="rundo">Hoàn tác</button><span class="small muted">${redact.boxes.length} vùng đã che</span></div>`,
    `<button class="btn ghost" data-act="rcancel">Hủy</button><button class="btn block" data-act="rsend">${ic('spark')} Gửi cho AI đọc</button>`);
  drawRedact(); bindRedact();
}
function drawRedact(temp) { const c = $('#rcv'); if (!c) return; const g = c.getContext('2d'); g.drawImage(redact.img, 0, 0, redact.w, redact.h); g.fillStyle = '#000'; redact.boxes.concat(temp ? [temp] : []).forEach(b => g.fillRect(Math.min(b.x0, b.x1), Math.min(b.y0, b.y1), Math.abs(b.x1 - b.x0), Math.abs(b.y1 - b.y0))); }
function bindRedact() {
  const c = $('#rcv'); let cur = null;
  const pt = e => { const r = c.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * redact.w, y: (e.clientY - r.top) / r.height * redact.h }; };
  c.addEventListener('pointerdown', e => { c.setPointerCapture(e.pointerId); const p = pt(e); cur = { x0: p.x, y0: p.y, x1: p.x, y1: p.y }; });
  c.addEventListener('pointermove', e => { if (!cur) return; const p = pt(e); cur.x1 = p.x; cur.y1 = p.y; drawRedact(cur); });
  c.addEventListener('pointerup', () => { if (cur && Math.abs(cur.x1 - cur.x0) > 4 && Math.abs(cur.y1 - cur.y0) > 4) redact.boxes.push(cur); cur = null; renderRedact(); });
}
async function sendRedacted() {
  const c = $('#rcv'); const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.9));
  const boxes = redact.boxes.length; URL.revokeObjectURL(redact.url); redact = null;
  await readImages([blob], boxes);
}
async function readImages(files, masked) {
  if (!AI || !AIimg) { toast('Bản xem này chưa đọc ảnh bằng AI. Hãy thử ảnh mẫu.'); renderAdd(); return; }
  sheet('Đang đọc ảnh…', `<div class="empty">${ic('spark')}<b>AI đang đọc ảnh…</b><span class="small">Thường mất 10–30 giây.</span></div>`, '');
  const prompt = `Đây là ảnh hóa đơn mua hàng hoặc ảnh chụp giao dịch ngân hàng/ví điện tử của người dùng Việt Nam. Vùng tô đen là thông tin đã che. Hôm nay là ${T()}.
Trích xuất từng giao dịch nhìn thấy (với hóa đơn: một giao dịch, dùng TỔNG TIỀN phải trả). Chỉ trả về một mảng JSON, mỗi phần tử:
{"date":"YYYY-MM-DD hoặc null","amount":số nguyên VND dương,"type":"expense" hoặc "income","merchant":"tên ngắn gọn","category":một trong [${FT.CATS.concat(FT.INCATS).map(c => '"' + c.id + '"').join(',')}],"account":một trong [${S.accounts.map(a => '"' + a.id + '"').join(',')}] hoặc null,"note":"ghi chú ngắn hoặc rỗng","sure":true nếu đọc rõ, false nếu mờ}
Các ví: ${S.accounts.map(a => `${a.id}: ${a.name} (${a.type})`).join('; ')}. Không đọc được thì trả về [].`;
  logAI('Đọc ảnh giao dịch', prompt + `\n[1 ảnh, đã che ${masked || 0} vùng]`, 1);
  try {
    const arr = await AI.json(prompt, { images: files, modelTier: 'default' });
    const list = (Array.isArray(arr) ? arr : [arr]).filter(x => x && Number(x.amount) > 0);
    if (!list.length) { toast('Không tìm thấy giao dịch trong ảnh. Hãy thử ảnh rõ hơn.'); renderAdd(); return; }
    drafts = list.map(x => { const isIn = x.type === 'income'; const cat = (isIn ? FT.INCATS : FT.CATS).some(c => c.id === x.category) ? x.category : (isIn ? 'thu-khac' : 'khac');
      return { id: FT.uid(), date: /^\d{4}-\d{2}-\d{2}$/.test(x.date || '') ? x.date : T(), type: isIn ? 'income' : 'expense', amount: Math.round(Number(x.amount)), cat, autoCat: cat, merchant: String(x.merchant || '').slice(0, 60) || FT.catOf(cat).name, account: S.accounts.some(a => a.id === x.account) ? x.account : S.accounts[0].id, note: x.note ? String(x.note).slice(0, 80) : '', src: x.sure === false ? 'AI đọc từ ảnh · chưa chắc chắn, hãy kiểm tra' : 'AI đọc từ ảnh', srcLabel: 'ảnh' }; });
    markDupDrafts(); renderConfirm();
  } catch (e) { toast(e && e.code === 'image_rejected' ? 'Ảnh không hợp lệ. Hãy chọn ảnh JPG hoặc PNG khác.' : e && e.code === 'rate_limited' ? 'AI đang bận, thử lại sau ít phút.' : 'Chưa đọc được ảnh. Hãy thử lại.'); renderAdd(); }
}

/* ---------- Nhập sao kê / file ---------- */
function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('load ' + src)); document.head.appendChild(s); }); }
const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/';
async function pdfjsLines(buf) {
  if (!window.pdfjsLib) await loadScript(PDFJS + 'pdf.min.js');
  if (!window.pdfjsWorker) await loadScript(PDFJS + 'pdf.worker.min.js');
  const lib = window.pdfjsLib; lib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js';
  const doc = await lib.getDocument({ data: new Uint8Array(buf), isEvalSupported: false, disableFontFace: true }).promise;
  const lines = [];
  for (let p = 1; p <= doc.numPages; p++) { const page = await doc.getPage(p); const tc = await page.getTextContent(); groupLines(tc.items.map(it => ({ x: it.transform[4], y: it.transform[5], str: it.str })), lines); }
  return { lines, pages: doc.numPages };
}
function groupLines(items, out) {
  const rows = []; items.filter(i => i.str && i.str.trim()).forEach(it => { const r = rows.find(r => Math.abs(r.y - it.y) <= 2.5); if (r) r.items.push(it); else rows.push({ y: it.y, items: [it] }); });
  rows.sort((a, b) => b.y - a.y).forEach(r => { const items = r.items.sort((a, b) => a.x - b.x); out.push({ text: items.map(i => i.str).join(' '), items }); });
  return out;
}
async function inflate(u8) { const ds = new DecompressionStream('deflate'); const stream = new Blob([u8]).stream().pipeThrough(ds); return new TextDecoder('latin1').decode(await new Response(stream).arrayBuffer()); }
function pdfStr(s) { return s.replace(/\\([nrtbf()\\]|[0-7]{1,3})/g, (m, c) => ({ n: '\n', r: '\r', t: '\t', b: '\b', f: '\f', '(': '(', ')': ')', '\\': '\\' }[c] ?? String.fromCharCode(parseInt(c, 8)))); }
function a85(str) {
  let s = str.replace(/\s+/g, ''); if (s.startsWith('<~')) s = s.slice(2); const e = s.indexOf('~>'); if (e >= 0) s = s.slice(0, e);
  const out = []; let i = 0;
  while (i < s.length) {
    if (s[i] === 'z') { out.push(0, 0, 0, 0); i++; continue; }
    const chunk = s.slice(i, i + 5); i += 5; const pad = 5 - chunk.length; const c = chunk + 'u'.repeat(pad);
    let v = 0; for (let k = 0; k < 5; k++) v = v * 85 + (c.charCodeAt(k) - 33);
    const b4 = [(v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255]; out.push(...b4.slice(0, 4 - pad));
  }
  return new Uint8Array(out);
}
async function miniPdfLines(buf) {
  const bytes = new Uint8Array(buf); const latin = new TextDecoder('latin1').decode(bytes); const lines = []; let pages = 0;
  const re = /(?<!end)stream\r?\n/g; let m;
  while ((m = re.exec(latin))) {
    const start = m.index + m[0].length; const end = latin.indexOf('endstream', start); if (end < 0) break;
    const dict = latin.slice(latin.lastIndexOf('<<', m.index), m.index); let content;
    try { let data = bytes.slice(start, end); if (/ASCII85Decode/.test(dict)) data = a85(latin.slice(start, end)); content = /FlateDecode/.test(dict) ? await inflate(data) : new TextDecoder('latin1').decode(data); } catch (e) { re.lastIndex = end + 9; continue; }
    re.lastIndex = end + 9;
    if (!/\bBT\b/.test(content) || !/T[jJ]\b/.test(content)) continue;
    pages++; const items = []; let x = 0, y = 0, lx = 0, ly = 0;
    const tok = /(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+Tm|(-?[\d.]+)\s+(-?[\d.]+)\s+T[dD]|\((?:\\.|[^\\)])*\)\s*Tj|\[((?:\\.|[^\]])*)\]\s*TJ|\bT\*|\bBT\b/g; let t;
    while ((t = tok.exec(content))) {
      const s = t[0];
      if (t[1] !== undefined) { x = lx = +t[5]; y = ly = +t[6]; }
      else if (t[7] !== undefined) { lx += +t[7]; ly += +t[8]; x = lx; y = ly; }
      else if (s === 'BT') { x = lx = 0; y = ly = 0; }
      else if (s === 'T*') { }
      else if (s.endsWith('Tj')) { items.push({ x, y, str: pdfStr(s.slice(s.indexOf('(') + 1, s.lastIndexOf(')'))) }); }
      else if (t[9] !== undefined) { const parts = [...t[9].matchAll(/\((?:\\.|[^\\)])*\)/g)].map(p => pdfStr(p[0].slice(1, -1))); items.push({ x, y, str: parts.join('') }); }
    }
    groupLines(items, lines);
  }
  return { lines, pages };
}
async function readFile(file) {
  if (!isPro() && /\.(pdf|xlsx?|xls)$/i.test(file.name || '')) { openPricing('Nhập sao kê PDF/Excel là tính năng Pro.'); return; }
  const name = file.name.toLowerCase(); const accId = val('impacc');
  try {
    let rows, opening = null, masked = 0, info = '';
    if (name.endsWith('.pdf')) {
      const buf = await file.arrayBuffer(); let res = null;
      try { res = await Promise.race([pdfjsLines(buf), new Promise((_, rj) => setTimeout(() => rj(new Error('timeout')), 15000))]); } catch (e) { res = null; }
      if (!res || !res.lines.length) res = await miniPdfLines(buf);
      if (!res.lines.length) { toast('Không đọc được chữ trong PDF này. Nếu là bản scan, hãy chụp ảnh và dùng mục Ảnh.'); return; }
      masked = FT.maskSensitive(res.lines.map(l => l.text).join('\n')).count;
      const out = FT.parseStatementLines(res.lines, baseForImport()); rows = out.rows; opening = out.opening; info = `${res.pages} trang, ${res.lines.length} dòng chữ`;
    } else if (/\.xlsx?$/.test(name)) {
      if (!window.XLSX) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
      const wb = window.XLSX.read(await file.arrayBuffer(), { type: 'array' }); const ws = wb.Sheets[wb.SheetNames[0]];
      const table = window.XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: '' });
      masked = FT.maskSensitive(table.map(r => r.join(' ')).join('\n')).count;
      const out = FT.tableToRows(table, baseForImport()); rows = out.rows; opening = out.opening; info = `${table.length} dòng`;
    } else {
      const text = await file.text(); masked = FT.maskSensitive(text).count;
      const table = FT.parseCSV(text); const out = FT.tableToRows(table, baseForImport()); rows = out.rows; opening = out.opening; info = `${table.length} dòng`;
      if (!rows.length && FT.looksLikeNotification(text)) { rows = FT.parseNotification(text, baseForImport()); opening = null; info = 'thông báo'; }
    }
    if (!rows.length) { toast('Không tìm thấy giao dịch nào. Kiểm tra file có cột ngày và số tiền.'); return; }
    startImport(rows, { opening, masked, info, accountId: accId, boot: !S.accounts.length || !!S.sample, source: file.name });
  } catch (e) { console.warn(e); toast(/load/.test(String(e && e.message)) ? 'Không tải được bộ đọc file. Hãy lưu file dạng CSV rồi thử lại.' : 'Chưa đọc được file này. Thử lưu dạng CSV.'); }
}
const baseForImport = () => S.accounts.length && !S.sample ? S : { ...FT.emptyState(), today: FT.realToday() };
function startImport(rows, o) {
  const base = o.boot ? { ...FT.emptyState(), today: FT.realToday() } : S;
  const accountId = o.accountId || (S.accounts.find(a => a.type === 'bank') || S.accounts[0] || { id: 'bank' }).id;
  const d = FT.reviewImport(base, rows, accountId);
  const dups = d.filter(x => x.dup).length, unsure = d.filter(x => !x.dup && x.conf < 0.8).length;
  const recurring = o.boot ? '' : '';
  imp = { drafts: d, opening: o.opening, boot: o.boot, accountId, source: o.source, label: o.label, stage: 0, showSure: d.length <= 8,
    steps: [`Đọc ${o.info || rows.length + ' dòng'}`, `Tìm thấy ${rows.length} giao dịch`, o.masked ? `Che ${o.masked} số tài khoản, số thẻ` : 'Không có số tài khoản cần che', `Phát hiện ${dups} giao dịch trùng`, `Tự phân loại ${d.length - unsure - dups} giao dịch`, `${unsure} giao dịch cần bạn xem lại`] };
  renderImport(); let i = 0; const tick = () => { if (!imp) return; imp.stage = ++i; renderImport(); if (i < imp.steps.length) setTimeout(tick, 380); }; setTimeout(tick, 300);
}
function renderImport() {
  const I = imp; const running = I.stage < I.steps.length;
  const stepsHtml = `<div class="steps-run">${I.steps.map((s, i) => `<div class="st ${i < I.stage ? 'done' : ''}"><span class="dot">${ic('check')}</span>${esc(s)}</div>`).join('')}</div>`;
  if (running) { sheet('Đang xử lý sao kê', stepsHtml, ''); return; }
  const grp = (title, list, open) => list.length ? `<div class="imp-grp"><span>${title} (${list.length})</span>${title.startsWith('Chắc') ? `<button class="linkbtn" data-act="impsure">${I.showSure ? 'Thu gọn' : 'Xem'}</button>` : ''}</div>${open ? `<div class="card" style="padding:4px 12px">${list.map(impRow).join('')}</div>` : ''}` : '';
  const dup = I.drafts.filter(d => d.dup), unsure = I.drafts.filter(d => !d.dup && d.conf < 0.8), sure = I.drafts.filter(d => !d.dup && d.conf >= 0.8);
  const n = I.drafts.filter(d => d.sel).length;
  sheet(I.boot ? 'Dựng bảng điều khiển từ sao kê' : 'Xác nhận giao dịch từ ' + (I.label || (I.source ? 'file' : 'sao kê')), `${stepsHtml}
    <div class="note row">${ic('shield')}<span>Chưa có gì được lưu. Bỏ chọn dòng không muốn nhập, sửa danh mục nếu cần, rồi xác nhận.</span></div>
    ${grp('Cần xem lại', unsure, true)}${grp('Có thể trùng, mặc định bỏ qua', dup, true)}${grp('Chắc chắn', sure, I.showSure)}`,
    `<button class="btn ghost" data-act="impcancel">Hủy</button><button class="btn block" data-act="impsave">${ic('check')} ${I.boot ? `Dựng bảng điều khiển (${n})` : `Lưu ${n} giao dịch`}</button>`, { full: true });
}
function impRow(d) {
  const income = d.type === 'income', tr = d.type === 'transfer';
  return `<div class="imp-row ${d.sel ? '' : 'off'}"><input type="checkbox" data-imp="${d.id}" ${d.sel ? 'checked' : ''} aria-label="Chọn giao dịch"><div style="min-width:0"><div class="t">${esc(d.merchant)}</div><div class="s">${FT.dShort(d.date)} · ${esc(d.desc).slice(0, 60)}</div>
    ${d.dup ? `<div class="why2">Trùng với ${esc(d.dup.label)} (${Math.round(d.dup.conf * 100)}%)</div>` : d.reasons.length ? `<div class="why2">${esc(d.reasons.join('; '))}</div>` : ''}
    ${tr ? `<div class="s">Chuyển sang ${esc(FT.accName(S, d.to))}, không tính là chi</div>` : `<select data-impcat="${d.id}" aria-label="Danh mục">${catOpts(d.cat, income)}</select>`}</div>
    <div class="amt ${income ? 'in' : ''}">${income ? '+' : tr ? '' : '−'}${money(d.amount)}</div></div>`;
}
function saveImport() {
  const I = imp; const sel = I.drafts.filter(d => d.sel);
  if (!sel.length) { toast('Chưa chọn giao dịch nào.'); return; }
  if (I.boot) {
    const base0 = S; const st = FT.bootstrapFromRows(sel, I.opening || 0, base0);
    if (base0 && (base0.sample || base0.accounts.length) && !createProfile()) return;
    st.settings = { ...st.settings, buffer: 500000, pinOn: false }; st.aiLog = base0 ? base0.aiLog : [];
    S = st; fixState(); imp = null; changed(); save(); closeSheet(); tab = 'home'; render();
    toast(`Đã dựng xong từ ${sel.length} giao dịch: phát hiện ${S.bills.length} khoản định kỳ, gợi ý ${Object.keys(S.budgets).length} ngân sách.`); return;
  }
  sel.forEach(d => { const key = FT.norm(d.merchant);
    if (d.type === 'expense' && d.autoCat && d.cat !== d.autoCat && key) S.rules[key] = d.cat;
    S.txns.push(d.type === 'transfer' ? { id: 'u' + FT.uid(), date: d.date, type: 'transfer', amount: d.amount, account: d.account, to: d.to, merchant: d.merchant, src: 'sao kê' } : { id: 'u' + FT.uid(), date: d.date, type: d.type, amount: d.amount, cat: d.cat, merchant: d.merchant, account: d.account, src: 'sao kê' }); });
  const n = sel.length, skipped = I.drafts.length - n; imp = null; changed(); save(); closeSheet(); render(); toast(`Đã lưu ${n} giao dịch${skipped ? `, bỏ qua ${skipped}` : ''}.`);
}
function stmtEnd() { const t = FT.realToday(); return FT.pd(t).d >= 20 ? t.slice(0, 8) + '20' : FT.shiftM(FT.mkey(t), -1) + '-20'; }
function statementCSV(ss) {
  const q = s => `"${String(s).replace(/"/g, '""')}"`; const f = n => Math.abs(n).toLocaleString('en-US');
  return ['Sao kê tài khoản - Ngân hàng Demo (dữ liệu giả lập)', `Số dư đầu kỳ,${q(f(ss.opening))}`, 'Ngày giao dịch,Nội dung,Ghi nợ,Ghi có,Số dư'].concat(ss.rows.map(r => { const [y, m, d] = r.date.split('-'); return [`${d}/${m}/${y}`, q(r.desc), r.signed < 0 ? q(f(r.signed)) : '', r.signed > 0 ? q(f(r.signed)) : '', q(f(r.bal))].join(','); })).join('\n');
}
function sampleWeekRows() {
  const t = T(); const rows = [];
  const add = (off, desc, signed) => rows.push({ date: FT.addDays(t, -off), desc, signed });
  const g = S.txns.find(x => FT.norm(x.merchant) === 'grabfood' && x.date >= FT.addDays(t, -6));
  if (g) add(FT.dayDiff(g.date, t), 'GRABFOOD ORDER 77120934', -g.amount);
  const h = S.txns.filter(x => x.merchant === 'Highlands Coffee').slice(-1)[0]; if (h && h.date >= FT.addDays(t, -6)) add(FT.dayDiff(h.date, t), 'HIGHLANDS COFFEE QR', -h.amount);
  add(0, 'NETFLIX.COM 4111 2222 3333 4444', -260000); add(1, 'CIRCLE K TRAN DUY HUNG', -89000); add(2, 'CK DEN NGUYEN THI MAI FT2611023', -300000); add(3, 'NAP TIEN VI MOMO 0912345678', -500000); add(4, 'PHARMACITY LANG HA', -132000); add(5, 'NHAN TIEN TU TRAN VAN BINH HOAN TIEN AN', 250000);
  return rows.map(r => ({ ...r, amount: Math.abs(r.signed), src: 'sao kê', ...FT.classify(r.desc, r.signed, S) }));
}

/* ---------- Sửa giao dịch, ngân sách, mục tiêu, hóa đơn ---------- */
let editType = 'expense', confirmDel = null;
function openTxEdit(id) {
  const t = S.txns.find(x => x.id === id); if (!t) return;
  if (t.type === 'transfer') { sheet('Chuyển tiền giữa các ví', `<div class="note">Chuyển tiền giữa ví của bạn không tính là chi tiêu.</div><label class="f">Số tiền<input class="in num" id="e_amount" value="${fmtIn(t.amount)}" inputmode="numeric"></label><div class="grid2"><label class="f">Từ<select class="in" id="e_account">${accOpts(t.account)}</select></label><label class="f">Đến<select class="in" id="e_to">${accOpts(t.to)}</select></label></div><label class="f">Ngày<input class="in" type="date" id="e_date" value="${t.date}"></label>`,
    `<button class="btn danger" data-act="deltx" data-id="${t.id}">${ic('trash')}</button><button class="btn block" data-act="savetx" data-id="${t.id}">Lưu</button>`); return; }
  sheet('Sửa giao dịch', `<div class="typeseg" style="justify-self:center">${[['expense', 'Chi'], ['income', 'Thu']].map(([k, v]) => `<button class="${t.type === k ? 'on' : ''}" data-act="etype" data-id="${k}">${v}</button>`).join('')}</div>
    <label class="f">Số tiền<input class="in num" id="e_amount" value="${fmtIn(t.amount)}" inputmode="numeric" style="font-weight:600;font-size:17px"></label>
    <div class="grid2"><label class="f">Danh mục<select class="in" id="e_cat">${catOpts(t.cat, t.type === 'income')}</select></label><label class="f">Ngày<input class="in" type="date" id="e_date" value="${t.date}"></label></div>
    <div class="grid2"><label class="f">Người bán / nội dung<input class="in" id="e_merchant" value="${esc(t.merchant)}"></label><label class="f">Ví<select class="in" id="e_account">${accOpts(t.account)}</select></label></div>
    <label class="f">Ghi chú<input class="in" id="e_note" value="${esc(t.note || '')}"></label>${t.billId ? '<div class="note">Giao dịch này gắn với một khoản định kỳ.</div>' : ''}${t.src ? `<div class="note">Nguồn: ${esc(t.src)}</div>` : ''}`,
    `<button class="btn danger" data-act="deltx" data-id="${t.id}">${ic('trash')}</button><button class="btn block" data-act="savetx" data-id="${t.id}">Lưu thay đổi</button>`);
  editType = t.type;
}
function openBudgetEdit() {
  sheet('Ngân sách tháng', `<p class="small muted" style="margin:0">Để trống nếu không muốn đặt hạn mức cho nhóm đó.</p>` + FT.CATS.map(c => `<label class="row">${catIco(c.id)}<span class="grow" style="font-weight:600">${c.name}</span><input class="in num" style="max-width:150px;text-align:right" data-bud="${c.id}" inputmode="numeric" value="${fmtIn(S.budgets[c.id] || 0)}" placeholder="0"></label>`).join('')
    + `<button class="btn ghost" data-act="suggestbud">${ic('spark')} Gợi ý theo 3 tháng gần nhất</button>`, `<button class="btn block" data-act="savebud">Lưu ngân sách</button>`);
}
function openGoalEdit(id) {
  const g = S.goals.find(x => x.id === id) || { name: '', target: 0, saved: 0, deadline: FT.shiftM(FT.mkey(T()), 6) + '-28', monthly: 0 };
  sheet(id ? 'Sửa mục tiêu' : 'Mục tiêu mới', `${id ? '' : `<div class="chips">${['Quỹ khẩn cấp', 'Mua laptop', 'Đi du lịch', 'Đóng học phí', 'Trả hết nợ'].map(n => `<button class="chip" data-act="gname" data-v="${n}">${n}</button>`).join('')}</div>`}
    <label class="f">Tên mục tiêu<input class="in" id="g_name" value="${esc(g.name)}"></label>
    <div class="grid2"><label class="f">Số tiền cần<input class="in num" id="g_target" inputmode="numeric" value="${fmtIn(g.target)}"></label><label class="f">Đã có<input class="in num" id="g_saved" inputmode="numeric" value="${fmtIn(g.saved)}"></label></div>
    <div class="grid2"><label class="f">Hạn hoàn thành<input class="in" type="date" id="g_deadline" value="${g.deadline}"></label><label class="f">Góp mỗi tháng<input class="in num" id="g_monthly" inputmode="numeric" value="${fmtIn(g.monthly)}" placeholder="0"></label></div>
    <label class="row small"><input type="checkbox" id="g_em" ${FT.isEmergency(g) ? 'checked' : ''}> Đây là quỹ dự phòng khẩn cấp</label>`,
    `${id ? `<button class="btn danger" data-act="delgoal" data-id="${id}">${ic('trash')}</button>` : ''}<button class="btn block" data-act="savegoal" data-id="${id || ''}">Lưu mục tiêu</button>`);
}
function openContribute(id) {
  const g = S.goals.find(x => x.id === id); const c = FT.goalCalc(S, g);
  sheet('Góp vào “' + g.name + '”', `<label class="f">Số tiền<input class="in big num" id="c_amt" inputmode="numeric" value="${fmtIn(S.plan && S.plan.active && S.plan.goalId === id ? S.plan.transfer : c.need)}"></label><label class="f">Lấy từ<select class="in" id="c_acc">${accOpts((S.accounts.find(a => a.type === 'bank') || S.accounts[0]).id, a => a.type !== 'credit')}</select></label><div class="note">Khoản góp được ghi là chi “Tiết kiệm”, không tính vào chi tiêu.</div>`, `<button class="btn block" data-act="savecontrib" data-id="${id}">Góp</button>`);
}
const KINDS = [['bill', 'Hóa đơn'], ['sub', 'Dịch vụ đăng ký'], ['loan', 'Khoản vay / trả góp'], ['saving', 'Tiết kiệm tự động'], ['income', 'Thu nhập (lương...)']];
function openBillEdit(id, preset) {
  const b = S.bills.find(x => x.id === id) || preset || { name: '', amount: 0, day: 1, kind: 'bill', cat: 'nha-o', account: (S.accounts.find(a => a.type === 'bank') || S.accounts[0]).id };
  sheet(id ? 'Sửa khoản định kỳ' : 'Khoản định kỳ mới', `<label class="f">Tên<input class="in" id="b_name" value="${esc(b.name)}" placeholder="Tiền nhà, điện, Netflix, lương…"></label>
    <div class="grid2"><label class="f">Số tiền<input class="in num" id="b_amountx" inputmode="numeric" value="${fmtIn(b.amount)}"></label><label class="f">Ngày trong tháng<input class="in" id="b_day" type="number" min="1" max="31" value="${b.day}"></label></div>
    <div class="grid2"><label class="f">Loại<select class="in" id="b_kind">${KINDS.map(([k, v]) => `<option value="${k}" ${b.kind === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label><label class="f">Danh mục<select class="in" id="b_cat">${FT.CATS.concat(FT.INCATS).map(c => `<option value="${c.id}" ${c.id === b.cat ? 'selected' : ''}>${c.name}</option>`).join('')}</select></label></div>
    <div class="grid2"><label class="f">Ví<select class="in" id="b_acc">${accOpts(b.account)}</select></label><label class="f">Còn bao nhiêu kỳ (trả góp)<input class="in" id="b_left" type="number" min="0" max="360" value="${b.monthsLeft ?? ''}" placeholder="Không giới hạn"></label></div>
    <label class="f">Mức sử dụng (dịch vụ đăng ký)<select class="in" id="b_usage"><option value="">Chưa đánh giá</option><option value="often" ${b.usage === 'often' ? 'selected' : ''}>Dùng thường xuyên</option><option value="rarely" ${b.usage === 'rarely' ? 'selected' : ''}>Ít dùng</option></select></label>
    ${id ? `<label class="row small"><input type="checkbox" id="b_paused" ${b.paused ? 'checked' : ''}> Tạm dừng khoản này</label>` : ''}`,
    `${id ? `<button class="btn danger" data-act="delbill" data-id="${id}">${ic('trash')}</button>` : ''}<button class="btn block" data-act="savebill" data-id="${id || ''}">Lưu</button>`);
}

/* ---------- Cài đặt, quyền riêng tư ---------- */
function openSettings() {
  const bal = FT.balances(S);
  sheet('Cài đặt', `${accountCard()}<section class="card"><div class="card-h"><h2>Hồ sơ</h2><button class="btn-sm" data-act="profiles">Đổi hồ sơ</button></div><div class="row"><span class="cico" style="background:var(--accent-soft);color:var(--accent)">${ic(S.sample ? 'spark' : 'coach')}</span><div class="grow"><b>${esc(curProfile().name)}</b><div class="small muted">${PR.list.length} hồ sơ trên thiết bị này</div></div><button class="btn-sm acc" data-act="newprofile">${ic('plus')} Tạo mới</button></div></section>
  <section class="card"><div class="card-h"><h2>Gói dịch vụ</h2><span class="pill ${isPro() ? 'good' : 'neutral'}">${isPro() ? 'PRO' : 'MIỄN PHÍ'}</span></div><div class="row"><span class="cico" style="background:var(--twin-soft);color:var(--twin)">${ic('star')}</span><div class="grow"><b>${isPro() ? proPlanName() : 'Gói miễn phí'}</b><div class="small muted">${isPro() ? proValidity() : twinLeft() + '/3 lượt mô phỏng còn lại trong tháng'}</div></div><button class="btn-sm acc" data-act="pricing">${isPro() ? 'Chi tiết' : 'Nâng cấp'}</button></div></section>
  <section class="card"><div class="card-h"><h2>Ví và số dư</h2><button class="btn-sm" data-act="addacc">${ic('plus')} Thêm ví</button></div>
    ${S.accounts.map(a => `<div class="li"><span class="cico" style="background:var(--accent-soft);color:var(--accent)">${ic(a.type === 'credit' ? 'card' : a.type === 'cash' ? 'wallet' : a.type === 'ewallet' ? 'spark' : 'home')}</span><div class="main"><div class="t">${esc(a.name)}</div><div class="s">${a.type === 'credit' ? 'Dư nợ hiện tại ' + FT.vnd(Math.max(0, -(bal[a.id] || 0))) : 'Số dư hiện tại ' + FT.vnd(bal[a.id] || 0)}</div></div><button class="btn-sm" data-act="editacc" data-id="${a.id}">Sửa</button></div>`).join('')}
    <div class="field-row" style="margin-top:10px"><span class="small"><b>Dự phòng tối thiểu</b><br><span class="muted">Luôn giữ trong tài khoản khi tính Safe-to-Spend</span></span><input class="in num" id="set_buffer" value="${fmtIn(S.settings.buffer)}" inputmode="numeric" aria-label="Dự phòng tối thiểu"></div>
    <p class="small muted" style="margin:8px 0 0">Bản dự thi chưa kết nối ngân hàng. Số dư ban đầu do bạn nhập, giao dịch sau đó tự cộng trừ.</p></section>
  <section class="card"><div class="card-h"><h2>Bảo mật và quyền riêng tư</h2></div>
    <div class="li"><div class="main"><div class="t">Khóa bằng mã PIN, mã hóa dữ liệu</div><div class="s">${S.settings.pinOn ? 'Đang bật · dữ liệu mã hóa AES-GCM 256-bit' : 'Mã 4 số; dữ liệu được mã hóa bằng khóa sinh từ PIN'}</div></div><button class="toggle ${S.settings.pinOn ? 'on' : ''}" data-act="pin" aria-label="Khóa bằng mã PIN" aria-pressed="${!!S.settings.pinOn}"></button></div>
    <div class="li"><div class="main"><div class="t">Ẩn số tiền</div><div class="s">Che số khi dùng app nơi đông người</div></div><button class="toggle ${S.settings.hide ? 'on' : ''}" data-act="hide" aria-label="Ẩn số tiền" aria-pressed="${!!S.settings.hide}"></button></div>
    <div class="li tap" data-act="ailog"><div class="main"><div class="t">Dữ liệu đã gửi cho AI</div><div class="s">${S.aiLog.length ? S.aiLog.length + ' lần gần nhất, xem đúng nội dung đã gửi' : 'Chưa gửi lần nào'}</div></div>${ic('chev', 'chev')}</div>
    <div class="li"><div class="main"><div class="t">Vân tay / Face ID</div><div class="s">Có trong bản ứng dụng điện thoại</div></div><span class="pill neutral">Sắp có</span></div>
    <div class="note" style="margin-top:8px;display:grid;gap:4px"><span>• Không yêu cầu và không lưu mật khẩu ngân hàng.</span><span>• Số tài khoản, số thẻ trong văn bản được tự động che trước khi gửi AI. Với ảnh, bạn tô đen vùng nhạy cảm trước khi gửi.</span><span>• AI chỉ đọc kết quả tính toán; không có quyền ghi dữ liệu hay chuyển tiền.</span><span>• Mọi con số do bộ máy tính toán xác định; app kiểm tra số trong câu trả lời của AI.</span><span>• Dữ liệu AI đọc từ ảnh, sao kê luôn chờ bạn xác nhận trước khi lưu.</span></div></section>
  <section class="card"><div class="card-h"><h2>Dữ liệu</h2></div><div class="stack" style="gap:8px">
    <div class="grid2"><button class="btn ghost" data-act="export" data-id="csv">${ic('download')} Xuất CSV</button><button class="btn ghost" data-act="export" data-id="json">${ic('download')} Xuất JSON</button></div>
    <button class="btn ghost" data-act="newprofile">${S.sample ? 'Tạo hồ sơ và nhập dữ liệu của tôi' : 'Tạo hồ sơ mới (người khác hoặc làm lại từ đầu)'}</button>
    <button class="btn ghost" data-act="demoboot">Thử dựng từ sao kê mẫu</button>
    <button class="btn ghost" data-act="resetsample">${S.sample ? 'Nạp lại dữ liệu mẫu' : 'Xem dữ liệu mẫu'}</button>
    <button class="btn danger" data-act="wipe">${confirmDel === 'wipe' ? 'Bấm lần nữa để xóa vĩnh viễn' : 'Xóa toàn bộ dữ liệu của hồ sơ này'}</button></div></section>
  <p class="small muted" style="text-align:center;margin:0">Financial Twin · bản dự thi ${new Date().getFullYear()}</p>`, '', { full: true });
}
function openProfiles() {
  sheet('Hồ sơ', `<p class="small muted" style="margin:0">Mỗi hồ sơ là một bộ dữ liệu riêng trên thiết bị này. Dữ liệu mẫu luôn được giữ để trình diễn.</p>
    <div class="card" style="padding:4px 14px">${PR.list.map(p => `<div class="li tap" data-act="switchprofile" data-id="${p.id}"><span class="cico" style="background:${p.id === PR.active ? 'var(--accent-soft)' : 'var(--surface-2)'};color:${p.id === PR.active ? 'var(--accent)' : 'var(--muted)'}">${ic(p.sample ? 'spark' : 'coach')}</span><div class="main"><div class="t">${esc(p.name)}</div><div class="s">${p.sample ? 'Dữ liệu mô phỏng' : lsGet(skey(p.id))?.enc ? 'Có mã PIN, dữ liệu mã hóa' : 'Dữ liệu cá nhân'}</div></div>${p.id === PR.active ? '<span class="pill good">Đang dùng</span>' : ic('chev', 'chev')}</div>`).join('')}</div>
    <button class="btn block" data-act="newprofile">${ic('plus')} Tạo hồ sơ mới</button>
    ${PR.list.length > 1 ? `<button class="btn danger block" data-act="delprofile">${confirmDel === 'delprofile' ? `Bấm lần nữa để xóa hồ sơ “${esc(curProfile().name)}”` : `Xóa hồ sơ đang dùng`}</button>` : ''}`, '', { full: false });
}
function openNewProfile() {
  if (!isPro() && personalProfileCount() >= 1) { openPricing('Gói Miễn phí chỉ được tạo 1 hồ sơ cá nhân. Nâng cấp Pro để tạo không giới hạn hồ sơ.'); return; }
  sheet('Tạo hồ sơ mới', `<p class="small muted" style="margin:0">Dữ liệu cũ vẫn được giữ, bạn chuyển qua lại giữa các hồ sơ bất cứ lúc nào.</p>
    <label class="f">Tên hồ sơ hoặc tên của bạn<input class="in" id="np_name" placeholder="Ví dụ: Minh"></label>
    <button class="card row" data-act="np" data-id="manual" style="text-align:left;width:100%"><span class="cico" style="background:var(--accent-soft);color:var(--accent)">${ic('edit')}</span><div class="grow"><b>Nhập thông tin trong 3 phút</b><div class="small muted">Thu nhập, số dư từng ví, khoản cố định, trả góp, ngân sách, quỹ đang có, mục tiêu.</div></div>${ic('chev', 'chev')}</button>
    <button class="card row" data-act="np" data-id="statement" style="text-align:left;width:100%"><span class="cico" style="background:var(--twin-soft);color:var(--twin)">${ic('upload')}</span><div class="grow"><b>Tải sao kê ngân hàng</b><div class="small muted">PDF, CSV hoặc Excel 1–3 tháng. App tự nhận lương, hóa đơn, gợi ý ngân sách.</div></div>${ic('chev', 'chev')}</button>
    <button class="card row" data-act="np" data-id="blank" style="text-align:left;width:100%"><span class="cico" style="background:var(--surface-2);color:var(--muted)">${ic('plus')}</span><div class="grow"><b>Bắt đầu trống</b><div class="small muted">Tự thêm ví và giao dịch sau.</div></div>${ic('chev', 'chev')}</button>`, '');
}
function openAiLog() {
  sheet('Dữ liệu đã gửi cho AI', `<p class="small muted" style="margin:0">Mỗi lần app gọi AI, nội dung gửi đi được ghi lại tại đây. Số tài khoản đã được che. Nhật ký chỉ lưu trên thiết bị này.</p>
    <div class="privacy-log">${S.aiLog.length ? S.aiLog.map(e => `<div class="entry"><div class="row between"><b>${esc(e.purpose)}</b><span class="muted">${new Date(e.t).toLocaleString('vi-VN')}</span></div><div class="muted">${e.chars.toLocaleString('vi-VN')} ký tự${e.images ? ` · ${e.images} ảnh` : ''}</div><pre>${esc(e.preview)}</pre></div>`).join('') : '<div class="empty">Chưa gửi dữ liệu nào cho AI.</div>'}</div>
    ${S.aiLog.length ? `<button class="btn ghost" data-act="clearlog">Xóa nhật ký</button>` : ''}`, '', { full: true });
}
function openAccEdit(id) {
  const a = S.accounts.find(x => x.id === id) || { name: '', type: 'bank', opening: 0 };
  sheet(id ? 'Sửa ví' : 'Ví mới', `<label class="f">Tên ví<input class="in" id="a_name" value="${esc(a.name)}" placeholder="Techcombank, Ví ZaloPay…"></label>
    <label class="f">Loại<select class="in" id="a_type">${[['cash', 'Tiền mặt'], ['bank', 'Tài khoản ngân hàng'], ['ewallet', 'Ví điện tử'], ['credit', 'Thẻ tín dụng']].map(([k, v]) => `<option value="${k}" ${a.type === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
    <label class="f">${a.type === 'credit' ? 'Dư nợ ban đầu' : 'Số dư ban đầu'}<input class="in num" id="a_open" inputmode="numeric" value="${fmtIn(a.type === 'credit' ? -a.opening : a.opening)}"></label>
    <div class="note">Số dư ban đầu là số tiền trước giao dịch đầu tiên được ghi. Muốn khớp số dư hôm nay, hãy sửa con số này.</div>`, `<button class="btn block" data-act="saveacc" data-id="${id || ''}">Lưu</button>`);
}
async function saveFile(name, data, label) {
  try { const dl = await window.claude?.use?.('downloads'); if (dl) { await dl.save({ filename: name, data }); toast('Đã gửi ' + label); return; } } catch (e) { if (e && e.code === 'cancelled') return; }
  sheet('Sao chép dữ liệu', `<p class="small muted" style="margin:0">Bản xem này chưa tải file được. Chọn toàn bộ và sao chép nội dung dưới đây vào một file ${esc(name.split('.').pop().toUpperCase())}.</p><textarea class="in" style="min-height:260px;font-size:12px" readonly>${esc(data)}</textarea>`, '');
}
function doExport(kind) {
  if (kind === 'csv') { const rows = [['Ngày', 'Loại', 'Số tiền', 'Danh mục', 'Nội dung', 'Ví', 'Ví nhận', 'Ghi chú']].concat(S.txns.map(t => [t.date, t.type === 'income' ? 'Thu' : t.type === 'expense' ? 'Chi' : 'Chuyển', t.amount, t.type === 'transfer' ? '' : FT.catOf(t.cat).name, t.merchant, FT.accName(S, t.account), t.to ? FT.accName(S, t.to) : '', t.note || '']));
    saveFile('financial-twin-giao-dich.csv', '\ufeff' + rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n'), 'file CSV'); }
  else saveFile('financial-twin-du-lieu.json', JSON.stringify({ ...S, aiLog: undefined }, null, 2), 'file JSON');
}

/* ---------- Thiết lập ban đầu ---------- */
let ob = null;
function openOnboard(initialName = '') {
  ob = { step: 1, name: initialName, payday: 5, income: 0, accounts: [['Tiền mặt', 'cash', 0], ['Tài khoản ngân hàng', 'bank', 0], ['Ví điện tử', 'ewallet', 0], ['Thẻ tín dụng (dư nợ)', 'credit', 0]],
    bills: [['Tiền nhà', 'bill', 'nha-o', 0, 5], ['Điện nước', 'bill', 'nha-o', 0, 15], ['Internet', 'bill', 'nha-o', 0, 10], ['Học phí', 'bill', 'hoc-tap', 0, 5], ['Trả góp / khoản vay', 'loan', 'no', 0, 25, 12], ['Netflix / Spotify', 'sub', 'giai-tri', 0, 12], ['Chuyển tiết kiệm', 'saving', 'tiet-kiem', 0, 6]], budgets: null, reserve: 0, goal: { name: '', target: 0, months: 12 } };
  renderOnboard();
}
function obRead() {
  const q = id => document.getElementById(id);
  if (ob.step === 1) { ob.name = q('o_name').value.trim(); ob.payday = Math.min(31, Math.max(1, Number(q('o_payday').value) || 5)); ob.income = parseMoney(q('o_income').value); }
  if (ob.step === 2) ob.accounts.forEach((a, i) => { a[0] = q('o_an' + i).value.trim() || a[0]; a[2] = parseMoney(q('o_ab' + i).value); });
  if (ob.step === 3) ob.bills.forEach((b, i) => { b[3] = parseMoney(q('o_bm' + i).value); b[4] = Math.min(31, Math.max(1, Number(q('o_bd' + i).value) || b[4])); if (b[1] === 'loan' && q('o_bl' + i)) b[5] = Math.max(1, Number(q('o_bl' + i).value) || 12); });
  if (ob.step === 4) Object.keys(ob.budgets).forEach(c => ob.budgets[c] = parseMoney(q('o_bg' + c).value));
  if (ob.step === 5) { ob.reserve = parseMoney(q('o_res').value); ob.goal = { name: q('o_gn').value.trim(), target: parseMoney(q('o_gt').value), months: Math.max(1, Number(q('o_gm').value) || 12) }; }
}
function renderOnboard() {
  const st = ob.step; let body = `<div class="steps">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= st ? 'on' : ''}"></i>`).join('')}</div>`;
  if (st === 1) body += `<h2>Bắt đầu trong 3 phút</h2><p class="muted small" style="margin:0">Chỉ cần số liệu gần đúng. Có thể sửa bất cứ lúc nào. Muốn nhanh hơn? <button class="linkbtn" data-act="addmode" data-id="file">Tải sao kê để app tự dựng</button>.</p>
    <label class="f">Tên của bạn<input class="in" id="o_name" value="${esc(ob.name)}" placeholder="Minh"></label>
    <div class="grid2"><label class="f">Thu nhập mỗi tháng<input class="in num" id="o_income" inputmode="numeric" value="${fmtIn(ob.income)}" placeholder="15.000.000"></label><label class="f">Ngày nhận lương<input class="in" id="o_payday" type="number" min="1" max="31" value="${ob.payday}"></label></div>`;
  if (st === 2) body += `<h2>Bạn đang có bao nhiêu tiền?</h2><p class="muted small" style="margin:0">Nhập số dư hôm nay của từng ví. Bỏ trống ví không dùng.</p>` + ob.accounts.map((a, i) => `<div class="grid2"><label class="f">Tên ví<input class="in" id="o_an${i}" value="${esc(a[0])}"></label><label class="f">${a[1] === 'credit' ? 'Dư nợ' : 'Số dư'}<input class="in num" id="o_ab${i}" inputmode="numeric" value="${fmtIn(a[2])}" placeholder="0"></label></div>`).join('');
  if (st === 3) body += `<h2>Các khoản cố định mỗi tháng</h2><p class="muted small" style="margin:0">Nhập số tiền và ngày. Bỏ trống khoản không có.</p>` + ob.bills.map((b, i) => `<div class="row">${catIco(b[2])}<span class="grow" style="font-weight:600;font-size:14px">${b[0]}</span><input class="in num" style="max-width:120px;text-align:right" id="o_bm${i}" inputmode="numeric" value="${fmtIn(b[3])}" placeholder="0"><input class="in" style="max-width:64px" id="o_bd${i}" type="number" min="1" max="31" value="${b[4]}" aria-label="Ngày"></div>${b[1] === 'loan' ? `<div class="row small muted" style="justify-content:flex-end;gap:6px;margin-top:-4px">còn <input class="in" style="max-width:64px" id="o_bl${i}" type="number" min="1" max="360" value="${b[5] || 12}" aria-label="Số kỳ còn lại"> kỳ</div>` : ''}`).join('');
  if (st === 4) { if (!ob.budgets) { const fixed = FT.sum(ob.bills.map(b => b[3])); const flex = Math.max(0, ob.income - fixed); const r = x => Math.round(flex * x / 100000) * 100000; ob.budgets = { 'an-uong': r(.38), 'di-lai': r(.12), 'mua-sam': r(.14), 'giai-tri': r(.08), 'suc-khoe': r(.06) }; }
    body += `<h2>Ngân sách gợi ý</h2><p class="muted small" style="margin:0">Chia phần còn lại sau khoản cố định, giữ khoảng 20% làm quỹ dự phòng.</p>` + Object.entries(ob.budgets).map(([c, v]) => `<label class="row">${catIco(c)}<span class="grow" style="font-weight:600">${FT.catOf(c).name}</span><input class="in num" style="max-width:150px;text-align:right" id="o_bg${c}" inputmode="numeric" value="${fmtIn(v)}"></label>`).join(''); }
  if (st === 5) { const G = ob.goal; body += `<h2>Quỹ và mục tiêu</h2><p class="muted small" style="margin:0">Tiền dự phòng bạn đang để riêng (gửi tiết kiệm, quỹ khẩn cấp) và một mục tiêu muốn đạt. Bỏ trống nếu chưa có.</p>
    <label class="f">Quỹ dự phòng đang có<input class="in num" id="o_res" inputmode="numeric" value="${fmtIn(ob.reserve)}" placeholder="0"></label>
    <div class="chips">${['Mua laptop', 'Du lịch', 'Mua xe', 'Học thêm', 'Đám cưới'].map(n => `<button class="chip ${G.name === n ? 'on' : ''}" data-act="obgoal" data-id="${n}">${n}</button>`).join('')}</div>
    <label class="f">Tên mục tiêu<input class="in" id="o_gn" value="${esc(G.name)}" placeholder="Ví dụ: Mua laptop"></label>
    <div class="grid2"><label class="f">Số tiền cần<input class="in num" id="o_gt" inputmode="numeric" value="${fmtIn(G.target)}" placeholder="20.000.000"></label><label class="f">Trong bao nhiêu tháng<input class="in" id="o_gm" type="number" min="1" max="120" value="${G.months}"></label></div>`; }
  sheet('Thiết lập hồ sơ', body, `${st > 1 ? `<button class="btn ghost" data-act="obback" aria-label="Quay lại">${ic('back')}</button>` : ''}<button class="btn block" data-act="obnext">${st < 5 ? 'Tiếp tục' : 'Hoàn tất'}</button>`, { full: true });
}
function finishOnboard() {
  const st = FT.emptyState(); st.v = 2; st.profile = { name: ob.name, payday: ob.payday };
  const ids = { cash: 'cash', bank: 'bank', ewallet: 'ewallet', credit: 'card' };
  ob.accounts.forEach(a => { if (a[2] > 0 || a[1] !== 'credit') st.accounts.push({ id: ids[a[1]], name: a[0], type: a[1], opening: a[1] === 'credit' ? -a[2] : a[2] }); });
  const gid = 'g' + FT.uid();
  if (ob.income > 0) st.bills.push({ id: 'b' + FT.uid(), name: 'Lương', amount: ob.income, day: ob.payday, kind: 'income', cat: 'luong', account: 'bank' });
  const sv = ob.bills.find(b => b[1] === 'saving' && b[3] > 0);
  ob.bills.filter(b => b[3] > 0).forEach(b => st.bills.push({ id: 'b' + FT.uid(), name: b[0], amount: b[3], day: b[4], kind: b[1], cat: b[2], account: b[2] === 'giai-tri' && st.accounts.some(a => a.id === 'card') ? 'card' : 'bank', ...(b[1] === 'saving' ? { goalId: gid } : {}), ...(b[1] === 'loan' ? { monthsLeft: b[5] || 12 } : {}) }));
  st.budgets = { ...ob.budgets }; if (sv) st.budgets['tiet-kiem'] = sv[3];
  const burn = FT.sum(ob.bills.filter(b => b[1] !== 'saving').map(b => b[3])) + FT.sum(Object.values(ob.budgets || {}));
  const r10 = x => Math.round(x / 1e6) * 1e6;
  st.goals = [{ id: gid, name: 'Quỹ khẩn cấp', target: Math.max(r10(burn * 3), r10(ob.reserve + 5e6), 10000000), saved: ob.reserve || 0, deadline: FT.shiftM(FT.mkey(FT.realToday()), 12) + '-28', monthly: sv ? sv[3] : 0, emergency: true }];
  const G = ob.goal; if (G && G.target > 0) st.goals.push({ id: 'g' + FT.uid(), name: G.name || 'Mục tiêu của tôi', target: G.target, saved: 0, deadline: FT.shiftM(FT.mkey(FT.realToday()), G.months) + '-28', monthly: Math.ceil(G.target / G.months / 10000) * 10000 });
  st.settings = { hide: false, buffer: 500000, pinOn: S.settings.pinOn }; st.aiLog = S.aiLog; st.plan = null;
  S = st; fixState(); ob = null; chat = []; changed(); save(); closeSheet(); tab = 'home'; render(); toast(`Đã tạo hồ sơ${st.profile.name ? ' của ' + st.profile.name : ''}. Bấm + để ghi khoản chi đầu tiên.`);
}

/* ---------- PIN / khóa ---------- */
let pinBuf = '', pinMode = null, pinFirst = '';
function showLock(mode) { pinMode = mode || 'unlock'; pinBuf = ''; const L = document.getElementById('lock') || document.createElement('div'); L.id = 'lock'; L.className = 'lock'; document.body.appendChild(L); drawLock(); }
function drawLock(err) {
  const L = $('#lock'); if (!L) return;
  const title = pinMode === 'unlock' ? 'Nhập mã PIN' : pinMode === 'set1' ? 'Tạo mã PIN 4 số' : 'Nhập lại mã PIN';
  L.innerHTML = `<div style="text-align:center"><div class="mark" style="margin:0 auto 14px;width:52px;height:52px;border-radius:16px;background:var(--hero-2)">${ic('lock')}</div><h2 style="font-size:20px">${title}</h2><div style="color:${err ? '#FFB3BC' : 'var(--hero-muted)'};font-size:13.5px;min-height:20px">${err || (pinMode === 'unlock' ? 'Dữ liệu đang được mã hóa' : 'Dữ liệu sẽ được mã hóa bằng mã này')}</div>
  <div class="dots">${[0, 1, 2, 3].map(i => `<i class="${i < pinBuf.length ? 'f' : ''}"></i>`).join('')}</div>
  <div class="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button data-act="pinkey" data-id="${n}">${n}</button>`).join('')}<button data-act="pinkey" data-id="x" style="font-size:14px">${pinMode === 'unlock' ? '' : 'Hủy'}</button><button data-act="pinkey" data-id="0">0</button><button data-act="pinkey" data-id="del" aria-label="Xóa">${ic('back')}</button></div>
  ${pinMode === 'unlock' ? `<div style="margin-top:6px;color:var(--hero-muted);font-size:13px">${esc(curProfile() ? curProfile().name : '')}</div><button data-act="forgot" style="margin-top:14px;color:var(--hero-muted);font-size:13px">Quên mã PIN</button>${PR.list.length > 1 ? `<button data-act="lockswitch" style="margin-top:14px;margin-left:18px;color:var(--hero-muted);font-size:13px">Đổi hồ sơ</button>` : ''}` : ''}</div>`;
}
async function pinKey(k) {
  if (k === 'x') { if (pinMode !== 'unlock') { $('#lock').remove(); openSettings(); } return; }
  if (k === 'del') { pinBuf = pinBuf.slice(0, -1); drawLock(); return; }
  if (pinBuf.length >= 4) return; pinBuf += k; drawLock(); if (pinBuf.length < 4) return;
  if (pinMode === 'unlock') { drawLock('Đang mở khóa…'); const st = await tryUnlock(pinBuf, lockedRaw); if (st) { S = st; fixState(); lockedRaw = null; $('#lock').remove(); render(); } else { pinBuf = ''; drawLock('Sai mã PIN, thử lại'); } }
  else if (pinMode === 'set1') { pinFirst = pinBuf; pinMode = 'set2'; pinBuf = ''; drawLock(); }
  else { if (pinBuf === pinFirst) { try { cryptoSalt = crypto.getRandomValues(new Uint8Array(16)); cryptoKey = await deriveKey(pinBuf, cryptoSalt); S.settings.pinOn = true; save(); $('#lock').remove(); toast('Đã bật mã PIN và mã hóa dữ liệu'); openSettings(); } catch (e) { $('#lock').remove(); toast('Thiết bị này không hỗ trợ mã hóa.'); } } else { pinMode = 'set1'; pinBuf = ''; drawLock('Hai lần nhập không khớp'); } }
}

/* ---------- sheet ---------- */
function sheet(title, body, foot, opt = {}) {
  const prev = $('#layer .sheet-b'); const keep = prev && $('#layer .sheet-h h2') && $('#layer .sheet-h h2').textContent === title ? prev.scrollTop : 0;
  $('#layer').innerHTML = `<div class="scrim" data-act="scrim"><div class="sheet ${opt.full ? 'full' : ''}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="sheet-h"><h2>${esc(title)}</h2><button class="iconbtn" data-act="close" aria-label="Đóng">${ic('close')}</button></div><div class="sheet-b">${body}</div>${foot ? `<div class="sheet-f">${foot}</div>` : ''}</div></div>`;
  const nb = $('#layer .sheet-b'); if (nb && keep) nb.scrollTop = keep;
}
function closeSheet() { $('#layer').innerHTML = ''; confirmDel = null; redact = null; imp = null; }

/* ---------- AI giải thích Twin / Coach ---------- */
async function twinExplain() {
  const w = twinRes; if (!w || !AI) return; w.ai = { text: '', pending: true }; render();
  const ctx = compactWhatIf(w);
  try { const r = await aiAnswer(`Giải thích ngắn gọn kết quả mô phỏng "${w.title}" và nên làm gì.`, { ctx }, [], { noTools: true, purpose: 'Giải thích mô phỏng Twin', onText: ({ text }) => { w.ai.text = text; w.ai.pending = false; const el = $('#twinai'); if (el) el.innerHTML = aiBlock(w.ai); } });
    w.ai = { text: r.text, verify: r.verify, logIdx: r.logIdx, local: FT.whatIfMd(w) };
  } catch (e) { w.ai = { text: FT.whatIfMd(w) }; }
  const el = $('#twinai'); if (el) el.innerHTML = aiBlock(w.ai);
}
async function coachAI() {
  const p = S.plan; if (!p || !AI) return; const R = FT.weeklyReview(S, p);
  const ctx = { ...compactPlan(p), danh_gia_tuan: R.rows.map(r => ({ khoan: r.it.label, dat: r.ok, tuan_nay: r.week, gioi_han_tuan: r.weekLimit, tuan_truoc: r.prevWeek, trang_thai: r.status })), da_chuyen_thang_nay: R.transferred, dieu_chinh: R.adjust };
  S._coachAi = { text: '', pending: true }; render();
  try { const r = await aiAnswer('Nhận xét tuần này của kế hoạch tiết kiệm: điểm tốt, điểm cần sửa, và một việc cụ thể cho tuần tới.', { ctx }, [], { noTools: true, purpose: 'AI Coach nhận xét tuần', onText: ({ text }) => { S._coachAi.text = text; S._coachAi.pending = false; const el = $('#coachai'); if (el) el.innerHTML = aiBlock(S._coachAi); } });
    S._coachAi = { text: r.text, verify: r.verify, logIdx: r.logIdx };
  } catch (e) { S._coachAi = null; toast('AI chưa trả lời được, thử lại sau.'); }
  render();
}

/* ---------- events ---------- */
document.addEventListener('click', async e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const a = el.dataset.act, id = el.dataset.id, i = Number(el.dataset.i);
  if (a === 'scrim') { if (e.target === el) closeSheet(); return; }
  if (a !== 'wipe') confirmDel = confirmDel === 'wipe' ? null : confirmDel;
  if (a !== 'endplan') S && (S._confirmEnd = false);
  if (a !== 'startplan') S && (S._confirmReplace = false);
  switch (a) {
    case 'tab': tab = id; render(); window.scrollTo(0, 0); break;
    case 'goplan': if (id === 'coach' && !isPro()) { openPricing('AI Coach là tính năng Pro.'); break; } closeSheet(); tab = 'plan'; planTab = id; render(); window.scrollTo(0, 0); break;
    case 'ptab': if (id === 'coach' && !isPro()) { openPricing('AI Coach là tính năng Pro.'); break; } planTab = id; render(); break;
    case 'twintab': if (id === 'stress' && !isPro()) { openPricing('Stress Test là tính năng Pro.'); break; } twinTab = id; render(); break;
    case 'twin': closeSheet(); tab = 'twin'; twinTab = 'whatif'; render(); window.scrollTo(0, 0); break;
    case 'hide': S.settings.hide = !S.settings.hide; save(); render(); if ($('#layer .sheet') && $('#layer .sheet-h h2').textContent === 'Cài đặt') openSettings(); break;
    case 'settings': openSettings(); break;
    case 'googlelogin': await signInGoogle(); break;
    case 'googlelogout': await signOutGoogle(); break;
    case 'pricing': clearInterval(payTimer); payOrder = null; openPricing(); break;
    case 'buy': createPayment(id); break;
    case 'report': openReport(); break;
    case 'rperiod': reportPeriod = id; openReport(); break;
    case 'health': closeSheet(); openHealth(); break;
    case 'allalerts': openAllAlerts(); break;
    case 'alert': { if (openAlerts.has(id)) openAlerts.delete(id); else openAlerts.add(id); const box = el.closest('.al'); box.classList.toggle('open'); el.setAttribute('aria-expanded', box.classList.contains('open')); break; }
    case 'usage': { const b = S.bills.find(x => x.id === id); b.usage = el.dataset.v; save(); changed(); render(); if ($('#layer .sheet')) openAllAlerts(); toast('Đã ghi nhận'); break; }
    case 'pausebill': { const b = S.bills.find(x => x.id === id); if (b) { b.paused = true; save(); changed(); render(); if ($('#layer .sheet')) closeSheet(); toast(`Đã tạm dừng ${b.name}. Dự báo đã cập nhật.`); } break; }
    case 'deldup': { const t = S.txns.find(x => x.id === id); S.txns = S.txns.filter(x => x.id !== id); save(); changed(); render(); toast(t ? `Đã xóa bản trùng ${t.merchant} ${FT.vnd(t.amount)}` : 'Đã xóa'); break; }
    case 'close': closeSheet(); break;
    case 'chat': openChat(); break;
    case 'chatq': askChat(CHATQ[i]); break;
    case 'opentwin': closeSheet(); useTwin(el.dataset.v); break;
    case 'openstress': if (!isPro()) { openPricing('Stress Test là tính năng Pro.'); break; } closeSheet(); tab = 'twin'; twinTab = 'stress'; render(); break;
    case 'twinq': useTwin(el.dataset.v); break;
    case 'followplan': followPlan = !followPlan; if (twinRes && twinRes.sc) runTwin(twinQ, twinRes.sc); else render(); break;
    case 'btype': builder.type = id; render(); break;
    case 'brun': { const b = builder; b.amount = parseMoney(val('b_amount')) || b.amount; b.months = Number(val('b_months')) || b.months; b.rate = val('b_rate') !== '' ? Number(val('b_rate')) : b.rate; b.pct = Number(val('b_pct')) || b.pct; b.target = parseMoney(val('b_target')) || b.target;
      const sc = b.type === 'purchase' ? { type: 'purchase', amount: b.amount, label: 'Khoản mua lớn' } : b.type === 'installment' ? { type: 'installment', amount: b.amount, months: b.months, rate: b.rate / 100, label: 'Khoản trả góp' } : b.type === 'jobloss' ? { type: 'jobloss', months: Math.min(12, b.months) } : b.type === 'incomecut' ? { type: 'incomecut', pct: b.pct / 100, months: b.months } : { type: 'goal', target: b.target, months: b.months, name: 'Mục tiêu ' + FT.short(b.target) };
      useTwin('', sc); break; }
    case 'altinst': useTwin('', { type: 'installment', amount: twinRes.sc.amount, months: 12, rate: 0, label: twinRes.sc.label }); break;
    case 'twinexplain': twinExplain(); break;
    case 'adoptplan': { if (!isPro() && S.goals.length >= 2) { openPricing('Gói Miễn phí chỉ được tạo tối đa 2 mục tiêu tài chính. Nâng cấp Pro để tạo không giới hạn.'); break; } const p = twinRes.plan; const gid = 'g' + FT.uid(); S.goals.push({ id: gid, name: p.name, target: p.target, saved: 0, deadline: FT.shiftM(FT.mkey(T()), p.months) + '-28', monthly: p.need }); S.plan = { ...p, active: true, goalId: gid, goalName: p.name, start: T() }; save(); changed(); tab = 'plan'; planTab = 'coach'; render(); window.scrollTo(0, 0); toast('Đã tạo mục tiêu và kế hoạch'); break; }
    case 'sset': stressCfg[el.dataset.k] = Number(el.dataset.v); render(); break;
    case 'stog': stressCfg.medical = parseMoney(val('s_medical')) || stressCfg.medical; stressCfg.emergencyBuy = parseMoney(val('s_emergency')) || stressCfg.emergencyBuy; stressCfg[el.dataset.k] = !stressCfg[el.dataset.k]; render(); break;
    case 'srun': if (!isPro()) { openPricing('Stress Test là tính năng Pro.'); break; } runStress(); break;
    case 'plangap': { planForm = { name: 'Quỹ khẩn cấp', target: Math.round(stressRes.gap6 / 100000) * 100000, months: 12 }; draftPlan = null; tab = 'plan'; planTab = 'coach'; render(); window.scrollTo(0, 0); break; }
    case 'pform': planForm = { name: el.dataset.n, target: Number(el.dataset.t), months: Number(el.dataset.m) }; draftPlan = null; render(); break;
    case 'makeplan': { planForm.name = val('pf_name').trim() || 'Kế hoạch tiết kiệm'; planForm.target = parseMoney(val('pf_target')); planForm.months = Number(val('pf_months')) || 6; if (!planForm.target) { toast('Hãy nhập số tiền cần.'); return; } draftPlan = FT.makePlan(S, { name: planForm.name, target: planForm.target, months: planForm.months }); render(); setTimeout(() => { const v = document.querySelectorAll('.verdict'); if (v.length) v[v.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 30); break; }
    case 'startplan': { if (S.plan && S.plan.active && !S._confirmReplace) { S._confirmReplace = true; render(); return; } const p = draftPlan; let g = S.goals.find(x => FT.norm(x.name) === FT.norm(p.name) && !FT.isEmergency(x)) || (FT.norm(p.name).includes('khan cap') ? S.goals.find(FT.isEmergency) : null);
      if (!g) { g = { id: 'g' + FT.uid(), name: p.name, target: p.target, saved: 0, deadline: FT.shiftM(FT.mkey(T()), p.months) + '-28', monthly: p.need }; S.goals.push(g); } else { g.monthly = p.need; if (!FT.isEmergency(g)) { g.target = g.saved + p.target; g.deadline = FT.shiftM(FT.mkey(T()), p.months) + '-28'; } }
      S.plan = { ...p, active: true, goalId: g.id, goalName: g.name, start: T() }; S._confirmReplace = false; S._coachAi = null; draftPlan = null; save(); changed(); render(); window.scrollTo(0, 0); toast('Đã bắt đầu kế hoạch'); break; }
    case 'endplan': if (!S._confirmEnd) { S._confirmEnd = true; render(); return; } S.plan = null; S._confirmEnd = false; save(); changed(); render(); toast('Đã kết thúc kế hoạch'); break;
    case 'coachai': if (!isPro()) { openPricing('AI Coach là tính năng Pro.'); break; } coachAI(); break;
    case 'add': openAdd(); break;
    case 'addmode': if (id === 'file' && !isPro()) { openPricing('Nhập sao kê PDF/Excel là tính năng Pro.'); break; } if (!$('#layer .sheet')) { openAdd(id); } else { addMode = id; renderAdd(); } break;
    case 'ex': { const t = $('#txtin'); t.value = (t.value.trim() ? t.value.trim() + '\n' : '') + el.dataset.v; t.focus(); break; }
    case 'exnoti': { const t = $('#txtin'); t.value = NOTI_SAMPLE(); break; }
    case 'parse': { const txt = val('txtin'); if (!txt.trim()) { toast('Hãy nhập ít nhất một khoản, ví dụ “Ăn trưa 45 nghìn”.'); return; }
      if (FT.looksLikeNotification(txt)) { const rows = FT.parseNotification(txt, S); if (rows.length) { startImport(rows, { label: 'thông báo', masked: FT.maskSensitive(txt).count, info: `${rows.length} thông báo`, accountId: (S.accounts.find(x => x.type === 'bank') || S.accounts[0]).id }); return; } }
      drafts = FT.parseText(txt, S).map(d => ({ ...d, autoCat: d.cat, srcLabel: 'nhập nhanh' })); if (!drafts.length) { toast('Chưa nhận ra khoản nào.'); return; } markDupDrafts(); renderConfirm(); break; }
    case 'sampleimg': drafts = (id === 'receipt' ? SAMPLE_RECEIPT() : SAMPLE_SHOT()).map(d => ({ id: FT.uid(), ...d, autoCat: d.cat, sample: true, srcLabel: 'ảnh mẫu' })); markDupDrafts(); renderConfirm(); break;
    case 'rundo': redact.boxes.pop(); renderRedact(); break;
    case 'rcancel': URL.revokeObjectURL(redact.url); redact = null; renderAdd(); break;
    case 'rsend': sendRedacted(); break;
    case 'demoboot': { const ss = FT.sampleStatement(stmtEnd()); const csv = statementCSV(ss); const tbl = FT.parseCSV(csv); const out = FT.tableToRows(tbl, { ...FT.emptyState(), today: FT.realToday() });
      ob = null; startImport(out.rows, { opening: out.opening, masked: FT.maskSensitive(csv).count, info: `sao kê mẫu 3 tháng, ${tbl.length} dòng`, boot: true, source: 'sao-ke-mau.csv' }); break; }
    case 'sampleweek': { const rows = sampleWeekRows(); startImport(rows, { masked: 2, info: `sao kê mẫu 7 ngày, ${rows.length} dòng`, accountId: val('impacc') }); break; }
    case 'dlsample': saveFile('sao-ke-mau-financial-twin.csv', '\ufeff' + statementCSV(FT.sampleStatement(stmtEnd())), 'file sao kê mẫu'); break;
    case 'impsure': imp.showSure = !imp.showSure; renderImport(); break;
    case 'impcancel': imp = null; closeSheet(); break;
    case 'impsave': saveImport(); break;
    case 'qtype': quick.type = id; quick.cat = id === 'income' ? 'luong' : 'an-uong'; quick.amount = val('qamt'); quick.merchant = val('qmer'); renderAdd(); break;
    case 'qcat': quick.cat = id; quick.amount = val('qamt'); quick.merchant = val('qmer'); quick.account = val('qacc'); renderAdd(); break;
    case 'quicknext': { const amt = parseMoney(val('qamt')); if (!amt) { toast('Hãy nhập số tiền.'); return; } drafts = [{ id: FT.uid(), date: T(), type: quick.type, amount: amt, cat: quick.cat, autoCat: quick.cat, merchant: val('qmer') || FT.catOf(quick.cat).name, account: val('qacc'), srcLabel: 'chọn nhanh' }]; quick.amount = ''; quick.merchant = ''; markDupDrafts(); renderConfirm(); break; }
    case 'answer': drafts[i].cat = id; drafts[i].autoCat = id; drafts[i].ask = null; renderConfirm(); break;
    case 'dtype': drafts[i].type = id; drafts[i].cat = id === 'income' ? 'thu-khac' : 'khac'; renderConfirm(); break;
    case 'rmdraft': drafts.splice(i, 1); drafts.length ? renderConfirm() : renderAdd(); break;
    case 'backadd': drafts = []; renderAdd(); break;
    case 'savedrafts': saveDrafts(); break;
    case 'txf': txFilter = id; txLimit = 60; render(); break;
    case 'more': txLimit += 80; render(); break;
    case 'edittx': confirmDel = null; openTxEdit(id); break;
    case 'etype': editType = id; document.querySelectorAll('[data-act="etype"]').forEach(b => b.classList.toggle('on', b.dataset.id === id)); $('#e_cat').innerHTML = catOpts(id === 'income' ? 'thu-khac' : 'khac', id === 'income'); break;
    case 'savetx': { const t = S.txns.find(x => x.id === id); const amt = parseMoney(val('e_amount')); if (!amt) { toast('Số tiền chưa hợp lệ.'); return; }
      t.amount = amt; t.date = val('e_date') || t.date; t.account = val('e_account');
      if (t.type === 'transfer') t.to = val('e_to'); else { t.type = editType; const oldCat = t.cat; t.cat = val('e_cat'); const m = val('e_merchant').trim(); if (m) t.merchant = m; t.note = val('e_note').trim() || undefined;
        const key = FT.norm(t.merchant); if (t.type === 'expense' && oldCat !== t.cat && key && key !== 'grab') S.rules[key] = t.cat; }
      save(); changed(); closeSheet(); render(); toast('Đã lưu thay đổi'); break; }
    case 'deltx': if (confirmDel !== id) { confirmDel = id; el.textContent = 'Xóa?'; return; } S.txns = S.txns.filter(x => x.id !== id); save(); changed(); closeSheet(); render(); toast('Đã xóa giao dịch'); break;
    case 'editbudget': openBudgetEdit(); break;
    case 'suggestbud': { const M = FT.model(S, { followPlan: false }); FT.CATS.forEach(c => { const inp = document.querySelector(`[data-bud="${c.id}"]`); const avg = M.varByCat[c.id] || 0; if (['an-uong', 'di-lai', 'mua-sam', 'giai-tri', 'suc-khoe'].includes(c.id) && avg) inp.value = fmtIn(Math.round(avg * .95 / 100000) * 100000); }); toast('Đã gợi ý thấp hơn 5% so với mức chi trung bình'); break; }
    case 'savebud': document.querySelectorAll('[data-bud]').forEach(inp => { const v = parseMoney(inp.value); if (v > 0) S.budgets[inp.dataset.bud] = v; else delete S.budgets[inp.dataset.bud]; }); save(); changed(); closeSheet(); render(); toast('Đã lưu ngân sách'); break;
    case 'editgoal': if (!id && !isPro() && S.goals.length >= 2) openPricing('Gói Miễn phí chỉ được tạo tối đa 2 mục tiêu tài chính. Nâng cấp Pro để tạo không giới hạn.'); else openGoalEdit(id); break;
    case 'gname': $('#g_name').value = el.dataset.v; if (el.dataset.v === 'Quỹ khẩn cấp') $('#g_em').checked = true; break;
    case 'savegoal': { const name = val('g_name').trim(), target = parseMoney(val('g_target')); if (!name || !target) { toast('Cần tên và số tiền mục tiêu.'); return; }
      const em = $('#g_em').checked; if (em) S.goals.forEach(x => { if (x.id !== id) x.emergency = false; });
      const g = { id: id || 'g' + FT.uid(), name, target, saved: parseMoney(val('g_saved')), deadline: val('g_deadline') || FT.shiftM(FT.mkey(T()), 6) + '-28', monthly: parseMoney(val('g_monthly')), emergency: em };
      if (!id && !isPro() && S.goals.length >= 2) { openPricing('Gói Miễn phí chỉ được tạo tối đa 2 mục tiêu tài chính. Nâng cấp Pro để tạo không giới hạn.'); break; }
      if (id) Object.assign(S.goals.find(x => x.id === id), g); else S.goals.push(g); save(); changed(); closeSheet(); render(); toast('Đã lưu mục tiêu'); break; }
    case 'delgoal': if (confirmDel !== id) { confirmDel = id; el.textContent = 'Xóa?'; return; } S.goals = S.goals.filter(x => x.id !== id); if (S.plan && S.plan.goalId === id) S.plan = null; save(); changed(); closeSheet(); render(); break;
    case 'contribute': openContribute(id); break;
    case 'savecontrib': { const g = S.goals.find(x => x.id === id); const amt = parseMoney(val('c_amt')); if (!amt) return; g.saved += amt;
      S.txns.push({ id: 'u' + FT.uid(), date: T(), type: 'expense', amount: amt, cat: 'tiet-kiem', merchant: 'Góp: ' + g.name, account: val('c_acc'), goalId: g.id }); save(); changed(); closeSheet(); render(); toast(`Đã góp ${FT.vnd(amt)} vào ${g.name}`); break; }
    case 'editbill': openBillEdit(id); break;
    case 'addrec': { const r = FT.detectRecurring(S)[i]; if (r) openBillEdit(null, { name: r.name, amount: r.amount, day: r.day, kind: 'bill', cat: r.cat, account: r.account }); break; }
    case 'savebill': { const name = val('b_name').trim(), amount = parseMoney(val('b_amountx')); if (!name || !amount) { toast('Cần tên và số tiền.'); return; }
      const left = val('b_left'); const b = { id: id || 'b' + FT.uid(), name, amount, day: Math.min(31, Math.max(1, Number(val('b_day')) || 1)), kind: val('b_kind'), cat: val('b_cat'), account: val('b_acc'), usage: val('b_usage') || undefined, monthsLeft: left === '' ? undefined : Number(left), paused: $('#b_paused') ? $('#b_paused').checked : false };
      if (id) Object.assign(S.bills.find(x => x.id === id), b); else { S.bills.push(b); const key = FT.norm(name); S.txns.filter(x => FT.norm(x.merchant) === key && !x.billId).forEach(x => x.billId = b.id); }
      save(); changed(); closeSheet(); render(); toast('Đã lưu khoản định kỳ'); break; }
    case 'delbill': if (confirmDel !== id) { confirmDel = id; el.textContent = 'Xóa?'; return; } S.bills = S.bills.filter(x => x.id !== id); save(); changed(); closeSheet(); render(); break;
    case 'paybill': { const b = S.bills.find(x => x.id === id); S.txns.push({ id: 'u' + FT.uid(), date: T(), type: b.kind === 'income' ? 'income' : 'expense', amount: b.amount, cat: b.cat, merchant: b.name, account: b.account, billId: b.id, ...(b.goalId ? { goalId: b.goalId } : {}) });
      if (b.kind === 'loan' && b.monthsLeft > 0) b.monthsLeft--; if (b.goalId) { const g = S.goals.find(x => x.id === b.goalId); if (g) g.saved += b.amount; }
      save(); changed(); render(); toast(`Đã ghi ${b.name} ${FT.vnd(b.amount)}`); break; }
    case 'addacc': openAccEdit(); break;
    case 'editacc': openAccEdit(id); break;
    case 'saveacc': { const name = val('a_name').trim(); if (!name) { toast('Cần tên ví.'); return; } const type = val('a_type'); const v = parseMoney(val('a_open'));
      const acc = { id: id || 'a' + FT.uid(), name, type, opening: type === 'credit' ? -v : v }; if (id) Object.assign(S.accounts.find(x => x.id === id), acc); else S.accounts.push(acc); save(); changed(); render(); openSettings(); toast('Đã lưu ví'); break; }
    case 'pin': if (S.settings.pinOn) { S.settings.pinOn = false; cryptoKey = null; save(); toast('Đã tắt mã PIN. Dữ liệu không còn mã hóa.'); openSettings(); } else { closeSheet(); pinFirst = ''; showLock('set1'); } break;
    case 'pinkey': pinKey(id); break;
    case 'forgot': if (confirmDel !== 'forgot') { confirmDel = 'forgot'; el.textContent = 'Dữ liệu đã mã hóa của hồ sơ này sẽ bị xóa. Bấm lần nữa để bắt đầu lại.'; return; } confirmDel = null; lsDel(skey(PR.active)); openProfile(PR.active); $('#lock').remove(); tab = 'home'; render(); break;
    case 'lockswitch': $('#lock').remove(); if (!S) { S = Object.assign(FT.emptyState(), { v: 2 }); fixState(); } render(); openProfiles(); break;
    case 'ailog': openAiLog(); break;
    case 'clearlog': S.aiLog = []; save(); openAiLog(); break;
    case 'export': doExport(id); break;
    case 'onboard': if ((S.sample || S.accounts.length) && !createProfile()) break; openOnboard(); break;
    case 'obgoal': obRead(); ob.goal.name = el.dataset.id; renderOnboard(); break;
    case 'profiles': confirmDel = null; openProfiles(); break;
    case 'newprofile': openNewProfile(); break;
    case 'np': { const m = el.dataset.id, profileName = val('np_name').trim() || 'Financial Twin'; if (!createProfile(profileName)) break; S.profile.name = profileName === 'Financial Twin' ? '' : profileName; save(); tab = 'home'; render();
      if (m === 'manual') openOnboard(profileName === 'Financial Twin' ? '' : profileName); else if (m === 'statement') openAdd('file'); else { closeSheet(); openAccEdit(); toast(`Đã tạo hồ sơ ${profileName}. Thêm ví đầu tiên của bạn.`); } break; }
    case 'switchprofile': { const id = el.dataset.id; if (id === PR.active) { closeSheet(); break; } const selected = PR.list.find(p => p.id === id); if (selected) selected.lastUsedAt = Date.now(); closeSheet(); const ok = openProfile(id); tab = 'home'; if (!ok) { S = Object.assign(FT.emptyState(), { v: 2 }); fixState(); render(); showLock('unlock'); } else { render(); toast('Đã chuyển sang ' + curProfile().name); } break; }
    case 'delprofile': { if (confirmDel !== 'delprofile') { confirmDel = 'delprofile'; openProfiles(); return; } confirmDel = null; const gone = PR.active; lsDel(skey(gone)); PR.list = PR.list.filter(p => p.id !== gone); if (!PR.list.length) PR.list.push({ id: 'p' + FT.uid(), name: 'Dữ liệu mẫu', sample: true }); saveProfiles(); closeSheet(); const ok = openProfile(PR.list[0].id); tab = 'home'; if (!ok) { S = Object.assign(FT.emptyState(), { v: 2 }); fixState(); render(); showLock('unlock'); } else { render(); toast('Đã xóa hồ sơ'); } break; }
    case 'hidestart': S.settings.hideStart = true; save(); render(); break;
    case 'obnext': obRead(); if (ob.step === 2 && !ob.accounts.some(x => x[1] !== 'credit' && x[2] > 0)) { toast('Hãy nhập số dư ít nhất một ví.'); return; } if (ob.step < 5) { ob.step++; renderOnboard(); } else finishOnboard(); break;
    case 'obback': obRead(); ob.step--; renderOnboard(); break;
    case 'resetsample': { closeSheet(); tab = 'home';
      if (S.sample) { const keep = { pinOn: S.settings.pinOn }; S = FT.sampleState(sampleToday()); S.settings.pinOn = keep.pinOn; fixState(); chat = []; changed(); save(); render(); toast('Đã nạp lại dữ liệu mẫu'); break; }
      let sp = PR.list.find(p => p.sample); if (!sp) { sp = { id: 'p' + FT.uid(), name: 'Dữ liệu mẫu', sample: true }; PR.list.push(sp); saveProfiles(); }
      const ok = openProfile(sp.id); if (!ok) { S = Object.assign(FT.emptyState(), { v: 2 }); fixState(); render(); showLock('unlock'); break; } if (!S.sample) { S = FT.sampleState(sampleToday()); fixState(); } save(); render(); toast('Đã chuyển sang dữ liệu mẫu. Hồ sơ của bạn vẫn được giữ.'); break; }
    case 'wipe': if (confirmDel !== 'wipe') { confirmDel = 'wipe'; el.textContent = 'Bấm lần nữa để xóa vĩnh viễn'; return; } S = FT.emptyState(); S.v = 2; fixState(); cryptoKey = null; cryptoSalt = null; lsDel(skey(PR.active)); confirmDel = null; chat = []; changed(); save(); closeSheet(); tab = 'home'; render(); toast('Đã xóa toàn bộ dữ liệu'); break;
  }
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'txq') { txQuery = t.value; const pos = t.selectionStart; render(); const n = $('#txq'); n.focus(); n.setSelectionRange(pos, pos); return; }
  if (t.dataset.f && drafts[t.dataset.i]) { const d = drafts[t.dataset.i]; if (t.dataset.f === 'amount') { d.amount = parseMoney(t.value); d.missingAmount = false; d.guessed = false; } else d[t.dataset.f] = t.value; }
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.f === 'amount') t.value = fmtIn(parseMoney(t.value));
  if (t.dataset.f === 'cat' && drafts[t.dataset.i]) drafts[t.dataset.i].learned = false;
  if (t.dataset.imp && imp) { const d = imp.drafts.find(x => x.id === t.dataset.imp); d.sel = t.checked; renderImport(); }
  if (t.dataset.impcat && imp) { const d = imp.drafts.find(x => x.id === t.dataset.impcat); if (!d.autoCat) d.autoCat = d.cat; d.cat = t.value; }
  if (t.id === 'imgin' && t.files && t.files[0]) startRedact(t.files[0]);
  if (t.id === 'filein' && t.files && t.files[0]) readFile(t.files[0]);
  if (t.id === 'set_buffer') { S.settings.buffer = parseMoney(t.value); t.value = fmtIn(S.settings.buffer); save(); changed(); render(); }
  if (['e_amount', 'qamt', 'g_target', 'g_saved', 'g_monthly', 'b_amountx', 'a_open', 'c_amt', 'b_amount', 'b_target', 's_medical', 's_emergency', 'pf_target'].includes(t.id) || /^o_(ab|bm|bg|income)/.test(t.id) || t.dataset.bud) t.value = fmtIn(parseMoney(t.value));
});
document.addEventListener('submit', e => {
  e.preventDefault();
  if (e.target.id === 'chatform') { const v = $('#chatin').value; $('#chatin').value = ''; askChat(v); }
  if (e.target.id === 'twinform') useTwin(val('twinq'));
  if (e.target.id === 'homeask') { const q = val('homeq'); if (q.trim()) useTwin(q); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#layer .scrim')) closeSheet(); if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && e.target.id === 'txtin') document.querySelector('[data-act="parse"]')?.click(); });
document.addEventListener('dragover', e => { const d = e.target.closest && e.target.closest('#drop'); if (d) { e.preventDefault(); d.classList.add('over'); } });
document.addEventListener('drop', e => { const d = e.target.closest && e.target.closest('#drop'); if (!d) return; e.preventDefault(); d.classList.remove('over'); const f = e.dataTransfer.files[0]; if (!f) return; if (addMode === 'file') readFile(f); else if (/^image\//.test(f.type)) startRedact(f); });

loadProfiles();
openProfile(PR.active);
render();
initAuth().then(() => refreshEntitlement()).then(() => render());
(async () => { try { const s = await window.claude?.use?.('sample'); if (s) { AI = s; const lim = await s.limits().catch(() => null); AIimg = !!(lim && lim.images); AItools = !!(lim && lim.tools); if (S && (tab === 'twin' || tab === 'plan')) render(); } } catch (e) {} })();
window.__FT_TEST__ = { get S() { return S; }, runTwin, runStress, askChat, startImport, miniPdfLines, readFile };
})();

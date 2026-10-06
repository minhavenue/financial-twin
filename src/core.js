/* ===== Financial Twin — lõi tính toán (không phụ thuộc giao diện) ===== */
const FT = (() => {
  const pad = n => String(n).padStart(2, '0');
  const ymd = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;
  const pd = s => { const [y, m, d] = s.split('-').map(Number); return { y, m, d }; };
  const dim = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate();
  const addDays = (s, n) => { const { y, m, d } = pd(s); const t = new Date(Date.UTC(y, m - 1, d + n)); return ymd(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()); };
  const wday = s => { const { y, m, d } = pd(s); return new Date(Date.UTC(y, m - 1, d)).getUTCDay(); };
  const mkey = s => s.slice(0, 7);
  const shiftM = (mk, n) => { let [y, m] = mk.split('-').map(Number); m += n; while (m > 12) { m -= 12; y++; } while (m < 1) { m += 12; y--; } return `${y}-${pad(m)}`; };
  const dayDiff = (a, b) => { const A = pd(a), B = pd(b); return Math.round((Date.UTC(B.y, B.m - 1, B.d) - Date.UTC(A.y, A.m - 1, A.d)) / 864e5); };
  const realToday = () => { const t = new Date(); return ymd(t.getFullYear(), t.getMonth() + 1, t.getDate()); };
  const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/\s+/g, ' ').trim();
  const median = a => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); const h = s.length >> 1; return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2; };
  const sum = a => a.reduce((x, y) => x + y, 0);
  const uid = () => Math.random().toString(36).slice(2, 10);

  const CATS = [
    { id: 'an-uong', name: 'Ăn uống', color: '#E07A3F', icon: 'food' },
    { id: 'nha-o', name: 'Nhà ở', color: '#5B6CC9', icon: 'home' },
    { id: 'di-lai', name: 'Đi lại', color: '#2F9FD0', icon: 'car' },
    { id: 'hoc-tap', name: 'Học tập', color: '#8A5CC7', icon: 'book' },
    { id: 'mua-sam', name: 'Mua sắm', color: '#D4498A', icon: 'bag' },
    { id: 'giai-tri', name: 'Giải trí', color: '#D99A1E', icon: 'play' },
    { id: 'suc-khoe', name: 'Sức khỏe', color: '#3BA272', icon: 'heart' },
    { id: 'no', name: 'Nợ & trả góp', color: '#C4553F', icon: 'card' },
    { id: 'tiet-kiem', name: 'Tiết kiệm', color: '#0E8F7E', icon: 'piggy' },
    { id: 'khac', name: 'Khác', color: '#8A94A0', icon: 'dots' },
  ];
  const INCATS = [
    { id: 'luong', name: 'Lương', color: '#1F9D6B', icon: 'wallet' },
    { id: 'thuong', name: 'Thưởng', color: '#1F9D6B', icon: 'star' },
    { id: 'thu-khac', name: 'Thu khác', color: '#1F9D6B', icon: 'plus' },
  ];
  const catOf = id => CATS.find(c => c.id === id) || INCATS.find(c => c.id === id) || CATS[9];

  /* ---------- Dữ liệu mẫu ---------- */
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  function sampleState(today, SALARY = 19000000, OPEN = 3000000) {
    const rnd = mulberry32(20261002);
    const R = (a, b, step = 1000) => Math.round((a + rnd() * (b - a)) / step) * step;
    const pick = a => a[Math.floor(rnd() * a.length)];
    const accounts = [
      { id: 'cash', name: 'Tiền mặt', type: 'cash', opening: 1500000 },
      { id: 'vcb', name: 'Vietcombank', type: 'bank', opening: OPEN },
      { id: 'momo', name: 'Ví MoMo', type: 'ewallet', opening: 400000 },
      { id: 'card', name: 'Thẻ tín dụng TPBank', type: 'credit', opening: 0 },
    ];
    const bills = [
      { id: 'b-hoc', name: 'Học phí tiếng Anh', amount: 1500000, day: 3, kind: 'bill', cat: 'hoc-tap', account: 'vcb' },
      { id: 'b-luong', name: 'Lương công ty', amount: SALARY, day: 5, kind: 'income', cat: 'luong', account: 'vcb' },
      { id: 'b-tk', name: 'Chuyển quỹ tiết kiệm', amount: 2000000, day: 6, kind: 'saving', cat: 'tiet-kiem', account: 'vcb' },
      { id: 'b-nha', name: 'Tiền nhà', amount: 6000000, day: 7, kind: 'bill', cat: 'nha-o', account: 'vcb' },
      { id: 'b-net', name: 'Internet FPT', amount: 250000, day: 10, kind: 'bill', cat: 'nha-o', account: 'vcb' },
      { id: 'b-netflix', name: 'Netflix', amount: 260000, day: 12, kind: 'sub', cat: 'giai-tri', account: 'card' },
      { id: 'b-dien', name: 'Điện nước', amount: 900000, day: 15, kind: 'bill', cat: 'nha-o', account: 'vcb' },
      { id: 'b-spotify', name: 'Spotify', amount: 59000, day: 20, kind: 'sub', cat: 'giai-tri', account: 'card' },
      { id: 'b-tragop', name: 'Trả góp điện thoại', amount: 1250000, day: 25, kind: 'loan', cat: 'no', account: 'vcb' },
    ];
    const txns = [];
    const bal = {}; accounts.forEach(a => bal[a.id] = a.opening);
    const add = t => { t.id = 't' + (txns.length + 1); txns.push(t);
      if (t.type === 'expense') bal[t.account] -= t.amount;
      else if (t.type === 'income') bal[t.account] += t.amount;
      else { bal[t.account] -= t.amount; bal[t.to] += t.amount; } };
    const curM = mkey(today);
    const start = shiftM(curM, -3) + '-01';
    let lastMonthEndCard = 0;
    for (let day = start; day <= today; day = addDays(day, 1)) {
      const { d } = pd(day); const w = wday(day); const cur = mkey(day) === curM;
      const boost = cur ? 1.3 : 1;
      if (d === 1) lastMonthEndCard = bal.card;
      // khoản cố định
      bills.forEach(b => { if (b.day === d) {
        const amt = b.id === 'b-dien' ? R(820000, 980000, 1000) : b.amount;
        add({ date: day, type: b.kind === 'income' ? 'income' : 'expense', amount: amt, cat: b.cat, merchant: b.name, account: b.account, billId: b.id });
      } });
      if (d === 2) add({ date: day, type: 'expense', amount: 450000, cat: 'suc-khoe', merchant: 'California Fitness', account: 'vcb' });
      if (d === 15 && lastMonthEndCard < 0) add({ date: day, type: 'transfer', amount: -lastMonthEndCard, account: 'vcb', to: 'card', merchant: 'Thanh toán thẻ tín dụng' });
      if (d === 6 || d === 20) add({ date: day, type: 'transfer', amount: 1500000, account: 'vcb', to: 'cash', merchant: 'Rút tiền ATM' });
      if (d === 8 || d === 22) add({ date: day, type: 'transfer', amount: 500000, account: 'vcb', to: 'momo', merchant: 'Nạp ví MoMo' });
      const weekday = w >= 1 && w <= 5;
      if (weekday) add({ date: day, type: 'expense', amount: R(30000, 50000, 5000), cat: 'an-uong', merchant: pick(['Cơm văn phòng', 'Phở Thìn', 'Bún chả Hương Liên', 'Bánh mì Phố Huế', 'Cơm văn phòng']), account: rnd() < .6 ? 'cash' : 'momo' });
      if (rnd() < .22 * boost) { const c = pick([['Highlands Coffee', 45000, 59000], ['Phúc Long', 55000, 65000], ['The Coffee House', 45000, 55000]]); add({ date: day, type: 'expense', amount: R(c[1], c[2], 1000), cat: 'an-uong', merchant: c[0], account: rnd() < .5 ? 'momo' : 'card' }); }
      if (rnd() < .33) add({ date: day, type: 'expense', amount: R(32000, 95000, 1000), cat: 'di-lai', merchant: 'Grab', account: 'card' });
      if (rnd() < .08 * boost) add({ date: day, type: 'expense', amount: R(90000, 180000, 1000), cat: 'an-uong', merchant: 'GrabFood', account: 'card' });
      if (!weekday && rnd() < .3 * boost) add({ date: day, type: 'expense', amount: R(180000, 380000, 10000), cat: 'an-uong', merchant: pick(['Lẩu Phan', 'Nhà hàng Ngon', 'Nướng Gogi', 'Pizza 4P\'s']), account: 'card' });
      if (!weekday && rnd() < .22) add({ date: day, type: 'expense', amount: R(180000, 260000, 10000), cat: 'giai-tri', merchant: 'CGV', account: 'card' });
      if (d % 7 === 3) add({ date: day, type: 'expense', amount: R(140000, 320000, 1000), cat: 'an-uong', merchant: pick(['WinMart', 'Bách Hóa Xanh']), account: rnd() < .5 ? 'cash' : 'card' });
      if (d % 6 === 1) add({ date: day, type: 'expense', amount: R(80000, 110000, 1000), cat: 'di-lai', merchant: 'Petrolimex', account: 'cash' });
      if (rnd() < .07 * boost) add({ date: day, type: 'expense', amount: R(120000, 480000, 1000), cat: 'mua-sam', merchant: pick(['Shopee', 'Shopee', 'Lazada', 'Uniqlo']), account: 'card' });
      if (rnd() < .035) add({ date: day, type: 'expense', amount: R(60000, 240000, 1000), cat: 'suc-khoe', merchant: pick(['Pharmacity', 'Long Châu']), account: 'cash' });
      if (rnd() < .025) add({ date: day, type: 'expense', amount: R(60000, 150000, 10000), cat: 'khac', merchant: pick(['Cắt tóc', 'Quà sinh nhật', 'Gửi xe tháng']), account: 'cash' });
      if (cur && d === 14) add({ date: day, type: 'expense', amount: 2450000, cat: 'mua-sam', merchant: 'Shopee', note: 'Tai nghe Sony', account: 'card' });
      if (cur && d === 11) add({ date: day, type: 'expense', amount: 1150000, cat: 'an-uong', merchant: 'Nhà hàng Ngon', note: 'Sinh nhật bạn', account: 'card' });
      if (mkey(day) === shiftM(curM, -2) && d === 21) add({ date: day, type: 'expense', amount: 2300000, cat: 'mua-sam', merchant: 'Điện Máy Xanh', note: 'Tủ lạnh mini', account: 'card' });
      if (mkey(day) === shiftM(curM, -2) && d === 18) add({ date: day, type: 'income', amount: 1800000, cat: 'thu-khac', merchant: 'Dịch thuật tự do', account: 'vcb' });
    }
    return {
      v: 1, sample: true, today,
      profile: { name: 'Hà', payday: 5 },
      accounts, bills, txns,
      budgets: { 'an-uong': 3500000, 'di-lai': 1000000, 'mua-sam': 1500000, 'giai-tri': 700000, 'suc-khoe': 800000, 'tiet-kiem': 2000000 },
      goals: [
        { id: 'g1', name: 'Quỹ khẩn cấp', target: 30000000, saved: 8000000, deadline: shiftM(curM, 12) + '-28', monthly: 2000000 },
        { id: 'g2', name: 'Du lịch Đà Nẵng', target: 8000000, saved: 2500000, deadline: shiftM(curM, 3) + '-15', monthly: 1000000 },
        { id: 'g3', name: 'Mua laptop', target: 20000000, saved: 5000000, deadline: shiftM(curM, 10) + '-28', monthly: 1500000 },
      ],
      rules: { 'highlands coffee': 'an-uong' },
      settings: { hide: false, pin: null },
    };
  }

  function emptyState() {
    return { v: 1, sample: false, today: null, profile: { name: '', payday: 5 }, accounts: [], bills: [], txns: [], budgets: {}, goals: [], rules: {}, settings: { hide: false, pin: null } };
  }

  /* ---------- Tính toán ---------- */
  const todayOf = st => st.today || realToday();

  function balances(st, upto) {
    const b = {}; st.accounts.forEach(a => b[a.id] = Number(a.opening) || 0);
    st.txns.forEach(t => { if (upto && t.date > upto) return;
      if (!(t.account in b)) b[t.account] = 0;
      if (t.type === 'expense') b[t.account] -= t.amount;
      else if (t.type === 'income') b[t.account] += t.amount;
      else if (t.type === 'transfer') { b[t.account] -= t.amount; if (t.to in b) b[t.to] += t.amount; } });
    return b;
  }
  function position(st, upto) {
    const b = balances(st, upto); let cash = 0, debt = 0;
    st.accounts.forEach(a => { const v = b[a.id] || 0; if (a.type === 'credit') debt += Math.max(0, -v); else cash += v; });
    return { cash, debt, net: cash - debt, b };
  }
  const isSpend = t => t.type === 'expense' && t.cat !== 'tiet-kiem';
  const isVar = t => isSpend(t) && !t.billId;

  function periodStats(st, from, to) {
    const tx = st.txns.filter(t => t.date >= from && t.date <= to);
    const income = sum(tx.filter(t => t.type === 'income').map(t => t.amount));
    const spend = sum(tx.filter(isSpend).map(t => t.amount));
    const saved = sum(tx.filter(t => t.type === 'expense' && t.cat === 'tiet-kiem').map(t => t.amount));
    const byCat = {}; tx.filter(t => t.type === 'expense').forEach(t => byCat[t.cat] = (byCat[t.cat] || 0) + t.amount);
    return { income, spend, saved, byCat, tx };
  }
  function monthRange(mk, uptoDay) { const [y, m] = mk.split('-').map(Number); const L = dim(y, m); return [mk + '-01', mk + '-' + pad(Math.min(uptoDay || L, L))]; }

  function unusualSet(st) {
    const out = new Set();
    st.txns.forEach(t => { if (!isVar(t)) return; const mk = mkey(t.date); const months = [-3, -2, -1, 0, 1, 2, 3].map(i => shiftM(mk, i));
      const hist = st.txns.filter(x => x !== t && isVar(x) && x.cat === t.cat && months.includes(mkey(x.date))).map(x => x.amount);
      const med = median(hist); if ((hist.length >= 3 && t.amount >= Math.max(med * 4, 800000)) || (hist.length < 3 && t.amount >= 1500000)) out.add(t.id); });
    return out;
  }
  function billPaid(st, b, mk) { return st.txns.some(t => t.billId === b.id && mkey(t.date) === mk); }

  function forecast(st) {
    const T = todayOf(st); const { y, m, d } = pd(T); const L = dim(y, m); const mk = mkey(T);
    const daysLeft = L - d;
    const pos = position(st, T);
    const pending = st.bills.filter(b => !b.paused && !(b.kind === 'loan' && b.monthsLeft === 0) && Math.min(b.day, L) <= L && !billPaid(st, b, mk)).map(b => ({ ...b, overdue: b.day <= d }));
    const upIncome = sum(pending.filter(b => b.kind === 'income').map(b => b.amount));
    const upOut = sum(pending.filter(b => b.kind !== 'income').map(b => b.amount));
    const UN = unusualSet(st); const curVarTx = st.txns.filter(t => isVar(t) && mkey(t.date) === mk && t.date <= T);
    const thisVar = sum(curVarTx.map(t => t.amount)); const oneOff = sum(curVarTx.filter(t => UN.has(t.id)).map(t => t.amount));
    let daily, dailyBasis;
    if (d >= 7) { daily = (thisVar - oneOff) / d; dailyBasis = 'this'; }
    else { const pm = shiftM(mk, -1); const [a, b] = monthRange(pm); const pv = sum(st.txns.filter(t => isVar(t) && t.date >= a && t.date <= b && !UN.has(t.id)).map(t => t.amount)); const pdays = dim(...pm.split('-').map(Number));
      daily = pv ? pv / pdays : (thisVar / Math.max(d, 1)); dailyBasis = pv ? 'prev' : 'this'; }
    if (!daily) { const bud = sum(Object.entries(st.budgets || {}).filter(([c]) => c !== 'tiet-kiem').map(([, v]) => v)); if (bud) { daily = bud / L; dailyBasis = 'budget'; } }
    daily = Math.round(daily / 1000) * 1000;
    const available = pos.cash - pos.debt + upIncome - upOut;
    const need = daily * daysLeft;
    const end = available - need;
    const safeDaily = daysLeft > 0 ? Math.max(0, Math.floor(available / daysLeft / 1000) * 1000) : available;
    // chuỗi số dư
    const series = [];
    for (let k = 1; k <= d; k++) series.push({ day: k, v: position(st, ymd(y, m, k)).net, actual: true });
    let v = pos.net; const proj = [{ day: d, v }];
    for (let k = d + 1; k <= L; k++) {
      v -= daily;
      pending.forEach(b => { const due = b.overdue ? d + 1 : b.day; if (due === k) v += b.kind === 'income' ? b.amount : -b.amount; });
      proj.push({ day: k, v });
    }
    const risk = proj.filter(p => p.day > d && p.v < 0);
    return { T, d, L, daysLeft, mk, pos, pending, upIncome, upOut, thisVar, oneOff, daily, dailyBasis, available, need, end, safeDaily, series, proj, firstRisk: risk[0] || null, minProj: proj.reduce((a, b) => b.v < a.v ? b : a, proj[0]) };
  }

  function monthSummary(st, mk, uptoDay) { const [a, b] = monthRange(mk, uptoDay); const s = periodStats(st, a, b); s.rate = s.income > 0 ? (s.income - s.spend) / s.income : null; return s; }

  function history(st, n = 4) {
    const mk = mkey(todayOf(st)); const out = [];
    for (let i = n - 1; i >= 0; i--) { const k = shiftM(mk, -i); const s = monthSummary(st, k, i === 0 ? pd(todayOf(st)).d : undefined); out.push({ mk: k, income: s.income, spend: s.spend, partial: i === 0 }); }
    return out;
  }

  function budgetStatus(st) {
    const f = forecast(st); const s = monthSummary(st, f.mk, f.d); const tr = f.d / f.L;
    return Object.entries(st.budgets).filter(([, v]) => v > 0).map(([cat, limit]) => {
      const spent = s.byCat[cat] || 0; const pct = spent / limit;
      const level = pct >= 1 ? 'over' : pct >= .9 ? 'p90' : pct >= .7 ? 'p70' : 'ok';
      const fast = cat !== 'tiet-kiem' && pct < 1 && pct > tr + .15;
      const projected = cat === 'tiet-kiem' ? spent : Math.round(spent / f.d * f.L);
      return { cat, limit, spent, pct, level, fast, projected, timeRatio: tr };
    });
  }

  function prior3(st, mk) { return [1, 2, 3].map(i => shiftM(mk, -i)); }

  function alerts(st) {
    const f = forecast(st); const out = [];
    if (f.end < 0) out.push({ sev: 'bad', title: `Có thể thiếu ${vnd(-f.end)} cuối tháng`, body: `Giữ mức chi ${vnd(f.daily)}/ngày thì đến ngày ${f.L} bạn hụt tiền.` + (f.firstRisk ? ` Số dư bắt đầu âm từ ngày ${f.firstRisk.day}.` : ''), tag: 'Dự báo' });
    budgetStatus(st).filter(b => b.cat !== 'tiet-kiem').forEach(b => { const n = catOf(b.cat).name;
      if (b.level === 'over') out.push({ sev: 'bad', title: `${n} đã vượt ngân sách`, body: `Đã chi ${vnd(b.spent)} / ${vnd(b.limit)} (${Math.round(b.pct * 100)}%).`, tag: 'Ngân sách' });
      else if (b.level === 'p90') out.push({ sev: 'warn', title: `${n} đã dùng ${Math.round(b.pct * 100)}% ngân sách`, body: `Còn ${vnd(b.limit - b.spent)} cho ${f.daysLeft} ngày.`, tag: 'Ngân sách' });
      else if (b.fast) out.push({ sev: 'warn', title: `${n} đang tiêu quá nhanh`, body: `Mới qua ${Math.round(b.timeRatio * 100)}% tháng nhưng đã dùng ${Math.round(b.pct * 100)}% ngân sách.`, tag: 'Tốc độ' });
      else if (b.level === 'p70') out.push({ sev: 'info', title: `${n} đã dùng ${Math.round(b.pct * 100)}% ngân sách`, body: `Còn ${vnd(b.limit - b.spent)}.`, tag: 'Ngân sách' }); });
    // khoản lớn bất thường
    const months = prior3(st, f.mk);
    const cur = st.txns.filter(t => isVar(t) && mkey(t.date) === f.mk);
    const UN0 = unusualSet(st);
    cur.filter(t => UN0.has(t.id)).forEach(t => { const hist = st.txns.filter(x => isVar(x) && x.cat === t.cat && months.includes(mkey(x.date))).map(x => x.amount);
      const med = median(hist); out.push({ sev: 'warn', title: `Khoản chi lớn bất thường: ${vnd(t.amount)}`, body: `${t.merchant}${t.note ? ' · ' + t.note : ''} ngày ${pd(t.date).d}/${pd(t.date).m}. Cao gấp ${Math.round(t.amount / med)} lần một khoản ${catOf(t.cat).name.toLowerCase()} thông thường (${vnd(med)}).`, tag: 'Bất thường' }); });
    // nhóm tăng vọt
    const UN = unusualSet(st);
    const varBy = (from, to) => { const o = {}; st.txns.filter(t => isVar(t) && t.date >= from && t.date <= to && !UN.has(t.id)).forEach(t => o[t.cat] = (o[t.cat] || 0) + t.amount); return o; };
    const curVar = varBy(...monthRange(f.mk, f.d));
    CATS.forEach(c => { if (c.id === 'tiet-kiem') return; const avg = sum(months.map(mk => varBy(...monthRange(mk))[c.id] || 0)) / 3; const proj = (curVar[c.id] || 0) / f.d * f.L;
      if (avg > 0 && proj > avg * 1.3 && proj - avg > 400000 && !out.some(a => a.title.startsWith(c.name))) out.push({ sev: 'info', title: `${c.name} tăng ${Math.round((proj / avg - 1) * 100)}% so với mọi tháng`, body: `Dự kiến ${vnd(proj)} tháng này, trung bình 3 tháng trước là ${vnd(avg)}.`, tag: 'Xu hướng' }); });
    // gia hạn
    f.pending.filter(b => b.kind === 'sub' && !b.overdue && b.day - f.d <= 3).forEach(b => out.push({ sev: 'info', title: `${b.name} gia hạn ${b.day - f.d === 0 ? 'hôm nay' : 'sau ' + (b.day - f.d) + ' ngày'}`, body: `${vnd(b.amount)} trừ vào ${accName(st, b.account)} ngày ${b.day}.`, tag: 'Định kỳ' }));
    const rank = { bad: 0, warn: 1, info: 2 }; return out.sort((a, b) => rank[a.sev] - rank[b.sev]);
  }

  function detectRecurring(st) {
    const T = todayOf(st); const groups = {};
    st.txns.filter(t => t.type === 'expense' && !t.billId).forEach(t => { const k = norm(t.merchant); (groups[k] = groups[k] || []).push(t); });
    const out = [];
    Object.values(groups).forEach(g => { const months = new Set(g.map(t => mkey(t.date))); if (months.size < 3) return;
      const amts = g.map(t => t.amount); const med = median(amts); if (!amts.every(a => Math.abs(a - med) <= med * .15)) return;
      if (g.length > months.size + 1) return;
      const day = Math.round(median(g.map(t => pd(t.date).d)));
      if (st.bills.some(b => norm(b.name) === norm(g[0].merchant))) return;
      out.push({ name: g[0].merchant, amount: med, day, cat: g[0].cat, account: g[0].account, count: g.length }); });
    return out;
  }

  function monthsBetween(a, b) { const A = pd(a), B = pd(b); return (B.y - A.y) * 12 + (B.m - A.m) + (B.d >= A.d ? 0 : -1); }
  function goalCalc(st, g) {
    const T = todayOf(st); const remaining = Math.max(0, g.target - g.saved);
    const monthsLeft = Math.max(1, monthsBetween(T, g.deadline) + 1);
    const need = Math.ceil(remaining / monthsLeft / 10000) * 10000;
    const monthly = g.monthly || need;
    const mNeeded = monthly > 0 ? Math.ceil(remaining / monthly) : Infinity;
    const eta = isFinite(mNeeded) ? shiftM(mkey(T), mNeeded) : null;
    const skipNeed = monthsLeft > 1 ? Math.ceil(remaining / (monthsLeft - 1) / 10000) * 10000 : remaining;
    const onTrack = monthly >= need;
    return { remaining, monthsLeft, need, monthly, mNeeded, eta, skipNeed, skipExtra: skipNeed - need, onTrack, pct: g.target ? g.saved / g.target : 0 };
  }

  function avgMonthly(st, cat, n = 3) { const mk = mkey(todayOf(st)); return sum(prior3(st, mk).slice(0, n).map(k => monthSummary(st, k).byCat[cat] || 0)) / n; }
  function avgSurplus(st) { const mk = mkey(todayOf(st)); return sum(prior3(st, mk).map(k => { const s = monthSummary(st, k); return s.income - s.spend - s.saved; })) / 3; }

  function cutSuggestion(st) {
    const opts = ['an-uong', 'mua-sam', 'giai-tri', 'di-lai'].map(c => ({ cat: c, avg: avgMonthly(st, c) })).filter(o => o.avg > 0).sort((a, b) => b.avg - a.avg);
    if (!opts.length) return null; const o = opts[0]; return { ...o, cut: Math.round(o.avg * .2 / 10000) * 10000 };
  }

  /* ---------- Nhận diện câu gõ ---------- */
  const MERCHANTS = ['Highlands Coffee|highlands', 'Phúc Long|phuc long', 'Starbucks|starbucks', 'The Coffee House|coffee house|tch', 'GrabFood|grabfood|grab food', 'Grab|grab', 'Be|be bike|be car|xanh sm', 'ShopeeFood|shopeefood|shopee food', 'Shopee|shopee', 'Lazada|lazada', 'Tiki|tiki', 'WinMart|winmart|vinmart', 'Bách Hóa Xanh|bach hoa xanh', 'Circle K|circle k|circlek', 'GS25|gs25', 'CGV|cgv', 'Pharmacity|pharmacity', 'Long Châu|long chau', 'Petrolimex|petrolimex', 'Netflix|netflix', 'Spotify|spotify', 'KFC|kfc', 'Lotteria|lotteria', 'Jollibee|jollibee', 'Uniqlo|uniqlo', 'Phở Thìn|pho thin', 'California Fitness|california'].map(s => { const [name, ...k] = s.split('|'); return { name, keys: k }; });
  const CATKW = {
    'an-uong': ['an', 'an trua', 'an sang', 'an toi', 'an vat', 'com', 'pho', 'bun', 'mien', 'banh mi', 'cafe', 'ca phe', 'cf', 'coffee', 'tra sua', 'tra', 'nha hang', 'lau', 'nuong', 'do an', 'di cho', 'cho', 'sieu thi', 'hoa qua', 'trai cay', 'bia', 'nuoc ngot', 'banh', 'pizza', 'highlands', 'phuc long', 'starbucks', 'grabfood', 'shopeefood', 'winmart', 'bach hoa xanh', 'kfc', 'lotteria', 'jollibee', 'circle k', 'gs25'],
    'nha-o': ['tien nha', 'thue nha', 'dien', 'tien dien', 'tien nuoc', 'dien nuoc', 'internet', 'wifi', 'mang', 'gas', 'phi quan ly', 'chung cu', 'sua nha', 'fpt', 'viettel'],
    'di-lai': ['xang', 'do xang', 'taxi', 'gui xe', 've xe', 've may bay', 'may bay', 'xe bus', 'xe buyt', 'sua xe', 'rua xe', 'be', 'xanh sm', 'petrolimex', 'grab bike', 'grabbike', 'grab car', 'di chuyen'],
    'hoc-tap': ['hoc', 'hoc phi', 'sach', 'khoa hoc', 'tieng anh', 'lop hoc', 'udemy', 'van phong pham'],
    'mua-sam': ['mua', 'shopee', 'lazada', 'tiki', 'quan ao', 'ao', 'quan', 'giay', 'dep', 'tui', 'my pham', 'son', 'dien thoai', 'tai nghe', 'do gia dung', 'uniqlo'],
    'giai-tri': ['phim', 'xem phim', 'cgv', 'netflix', 'spotify', 'game', 'karaoke', 'du lich', 'concert', 'bida', 'youtube'],
    'suc-khoe': ['thuoc', 'kham', 'kham benh', 'benh vien', 'nha khoa', 'rang', 'vitamin', 'gym', 'yoga', 'pharmacity', 'long chau', 'bao hiem y te'],
    'no': ['tra gop', 'tra no', 'no', 'vay', 'lai vay', 'tra the', 'the tin dung'],
    'tiet-kiem': ['tiet kiem', 'gui tiet kiem', 'bo heo', 'quy du phong'],
    'khac': ['cat toc', 'qua', 'mung', 'hieu', 'cuoi', 'tu thien', 'phi'],
  };
  const INKW = { 'luong': ['luong', 'nhan luong'], 'thuong': ['thuong', 'bonus'], 'thu-khac': ['nhan', 'duoc tra', 'hoan tien', 'ban', 'thu nhap', 'lai', 'duoc cho', 'freelance', 'tra lai'] };
  const ACCKW = [['cash', ['tien mat', 'cash']], ['ewallet', ['momo', 'vi momo', 'zalopay', 'vi']], ['credit', ['the tin dung', 'quet the', 'the', 'visa', 'credit']], ['bank', ['chuyen khoan', 'ck', 'ngan hang', 'vcb', 'vietcombank', 'techcombank', 'banking', 'qr']]];

  function parseAmount(n) {
    let m;
    if ((m = n.match(/(\d+(?:[.,]\d+)?)\s*(tr|trieu|cu|m)\s*(\d{1,3})?(?![\d.,])/))) {
      let v = parseFloat(m[1].replace(',', '.')) * 1e6;
      if (m[3]) v += Number(m[3]) * (m[3].length === 1 ? 1e5 : m[3].length === 2 ? 1e4 : 1e3);
      return { v: Math.round(v), raw: m[0] };
    }
    if ((m = n.match(/(\d+(?:[.,]\d+)?)\s*lit\b/))) return { v: Math.round(parseFloat(m[1].replace(',', '.')) * 1e5), raw: m[0] };
    if ((m = n.match(/(\d+(?:[.,]\d+)?)\s*(k|nghin|ngan|n)\b/))) return { v: Math.round(parseFloat(m[1].replace(',', '.')) * 1e3), raw: m[0] };
    if ((m = n.match(/(\d{1,3}(?:[.,]\d{3})+|\d{4,})\s*(d|vnd|dong)?\b/))) return { v: Number(m[1].replace(/[.,]/g, '')), raw: m[0] };
    if ((m = n.match(/\b(\d{1,3})\b(?!\s*\/)/))) { const x = Number(m[1]); if (x > 0) return { v: x * 1000, raw: m[0], guessed: true }; }
    return null;
  }
  const hasKw = (n, k) => (' ' + n + ' ').includes(' ' + k + ' ');

  function parseOne(text, st) {
    const T = todayOf(st); const n = norm(text);
    const am = parseAmount(n);
    let date = T; let m;
    if (hasKw(n, 'hom qua') || /\b(toi|sang|trua|chieu|dem) qua\b/.test(n)) date = addDays(T, -1); else if (hasKw(n, 'hom kia')) date = addDays(T, -2);
    else if ((m = n.match(/\b(\d{1,2})\/(\d{1,2})\b/))) { const y = pd(T).y; date = ymd(y, Number(m[2]), Number(m[1])); if (date > T) date = ymd(y - 1, Number(m[2]), Number(m[1])); }
    let account = null; for (const [ty, ks] of ACCKW) { const acc = st.accounts.find(a => a.type === ty); if (acc && ks.some(k => hasKw(n, k))) { account = acc.id; break; } }
    if (!account) { const typeHint = /\b(the|visa)\b/.test(n) ? 'credit' : (Object.values(INKW).some(ks => ks.some(k => hasKw(n, k))) ? 'bank' : null); const a = st.accounts.find(a => a.type === typeHint) || st.accounts.find(a => a.type === 'cash') || st.accounts[0]; account = a ? a.id : null; }
    let merchant = null; for (const mm of MERCHANTS) if (mm.keys.some(k => hasKw(n, k))) { merchant = mm.name; break; }
    let type = 'expense', cat = null, ask = null, learned = false;
    for (const [c, ks] of Object.entries(INKW)) if (ks.some(k => hasKw(n, k))) { type = 'income'; cat = c; break; }
    if (type === 'expense') {
      const key = merchant ? norm(merchant) : null;
      if (key && st.rules[key]) { cat = st.rules[key]; learned = true; }
      else if (merchant === 'Grab' && !/(do an|giao|food|bike|car|di lam|ve nha)/.test(n)) { ask = { q: 'Khoản Grab này là gì?', options: [['di-lai', 'Di chuyển'], ['an-uong', 'Giao đồ ăn']] }; cat = 'di-lai'; }
      else { let best = null, bl = 0; for (const [c, ks] of Object.entries(CATKW)) for (const k of ks) if (hasKw(n, k) && k.length > bl) { best = c; bl = k.length; } cat = best || 'khac'; }
    }
    if (!merchant) { let desc = text; if (am) { const re = new RegExp(am.raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); desc = norm(desc) === n ? desc : desc; }
      desc = desc.replace(/\d+([.,]\d+)?\s*(k|nghìn|ngàn|nghin|ngan|tr|triệu|trieu|củ|lít|đ|vnd|đồng)?\b/gi, '').replace(/((sáng|trưa|chiều|tối|đêm) (nay|qua)|hôm qua|hôm kia|hôm nay|bằng|tiền mặt|chuyển khoản|thẻ tín dụng|quẹt thẻ|ví momo|momo|\bck\b|\d{1,2}\/\d{1,2})/gi, '').replace(/\s+/g, ' ').trim();
      merchant = desc ? desc[0].toUpperCase() + desc.slice(1) : (cat ? catOf(cat).name : 'Giao dịch'); }
    return { id: uid(), date, type, amount: am ? am.v : 0, cat, merchant, account, ask, learned, guessed: am && am.guessed, missingAmount: !am, src: text.trim() };
  }
  function parseText(text, st) { return text.split(/\n|;|,(?!\d)|\s+và\s+|\s+va\s+/i).map(s => s.trim()).filter(s => s.length > 1).map(s => parseOne(s, st)); }

  /* ---------- Định dạng ---------- */
  function vnd(n) { let v = Math.round(Number(n) || 0); if (Math.abs(v) >= 10000) v = Math.round(v / 1000) * 1000; return (v < 0 ? '−' : '') + Math.abs(v).toLocaleString('vi-VN') + 'đ'; }
  function short(n) { const a = Math.abs(n), s = n < 0 ? '−' : ''; if (a >= 1e9) return s + (a / 1e9).toFixed(1).replace('.', ',').replace(',0', '') + ' tỷ'; if (a >= 1e6) return s + (a / 1e6).toFixed(1).replace('.', ',').replace(',0', '') + 'tr'; if (a >= 1e3) return s + Math.round(a / 1e3) + 'k'; return s + a; }
  function accName(st, id) { const a = st.accounts.find(a => a.id === id); return a ? a.name : '—'; }
  const MONTHS = ['', 'Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
  const mLabel = mk => { const [y, m] = mk.split('-').map(Number); return 'tháng ' + m + '/' + y; };
  const dLabel = s => { const { d, m } = pd(s); return d + '/' + m; };

  /* ---------- Trợ lý tính tự động ---------- */
  function amountIn(n) { const a = parseAmount(n.replace(/(\d+)\s*thang/, '')); return a && !a.guessed ? a.v : null; }
  function supportAnswer(q) {
    const n = norm(q);
    const has = re => re.test(n);
    if (has(/^(xin chao|chao|hello|hi)\b|ban la ai|chatbot.*lam gi|hoi twin/)) return `**Tôi là Hỏi Twin, trợ lý sử dụng và tài chính của Financial Twin.**\n- Tôi hướng dẫn mọi thao tác trong app và giải thích Free/Pro, đăng nhập, đồng bộ, thanh toán.\n- Tôi cũng đọc số liệu trong hồ sơ để trả lời về chi tiêu, Safe-to-Spend, mục tiêu và mô phỏng quyết định.\n- Bạn chỉ cần hỏi bằng lời thường, ví dụ: “Cách nhập sao kê?” hoặc “Nếu mua điện thoại 20 triệu thì sao?”.`;
    if (has(/app.*(chuc nang|lam duoc gi)|co nhung tinh nang|gioi thieu.*app|financial twin.*la gi/)) return `**Financial Twin là trợ lý bản sao tài chính cá nhân, giúp bạn hiểu hiện tại và thử quyết định trước khi dùng tiền thật.**\n- Ghi thu chi, quản lý ví, ngân sách, mục tiêu và hóa đơn định kỳ.\n- Safe-to-Spend, cảnh báo chủ động, điểm sức khỏe và báo cáo tài chính.\n- Twin mô phỏng mua sắm, trả góp, giảm thu nhập; Stress Test kiểm tra các cú sốc.\n- AI Coach lập kế hoạch tiết kiệm; Hỏi Twin hướng dẫn thao tác và trả lời câu hỏi từ dữ liệu của bạn.`;
    if (has(/dang nhap|gmail|google|tai khoan/)) return `**Bạn đăng nhập bằng Google trong mục Cài đặt.**\n- Mở Cài đặt → chọn “Tiếp tục với Google” → chọn tài khoản Gmail.\n- Sau khi đăng nhập, hồ sơ và quyền Pro được tự động đồng bộ theo cùng tài khoản.\n- Nếu đổi điện thoại hoặc trình duyệt, hãy đăng nhập đúng Gmail cũ rồi chờ trạng thái đồng bộ cập nhật.\n- Bạn phải đăng nhập trước khi mua Pro để gói được gắn đúng tài khoản.`;
    if (has(/dong bo|khac thiet bi|dien thoai.*web|web.*dien thoai|khong thay.*ho so/)) return `**Dữ liệu tự đồng bộ sau khi bạn đăng nhập cùng một tài khoản Google.**\n- Không cần bấm nút đồng bộ thủ công.\n- Dòng “Lần cuối…” trong Cài đặt cho biết thời điểm đồng bộ gần nhất.\n- Nếu chưa thấy dữ liệu, kiểm tra hai thiết bị dùng đúng Gmail, có Internet rồi tải lại trang.\n- Không đăng nhập thì dữ liệu chỉ nằm trên trình duyệt của thiết bị đang dùng.`;
    if (has(/goi free|goi mien phi|mien phi.*duoc|free.*duoc|so sanh goi|khac.*pro|pro.*khac/)) return `**Gói Miễn phí đủ cho nhu cầu ghi chép cơ bản; Pro mở toàn bộ công cụ nâng cao.**\n- Miễn phí: ghi thu chi, Safe-to-Spend, 1 hồ sơ, 2 mục tiêu, cảnh báo cơ bản và 3 lượt mô phỏng/tháng.\n- Pro: không giới hạn hồ sơ, mục tiêu và mô phỏng; thêm Stress Test, AI Coach, nhập PDF/Excel và báo cáo đầy đủ.\n- Chatbot Hỏi Twin có ở cả hai gói.`;
    if (has(/gia|bao nhieu.*thang|pro thang|tron doi|nang cap|mua goi/)) return `**Financial Twin có Pro tháng 39.000đ và Pro trọn đời 399.000đ.**\n- Pro tháng dùng trong 30 ngày.\n- Pro trọn đời thanh toán một lần; ưu đãi dành cho 100 người đầu tiên.\n- Đăng nhập Google trước, sau đó vào Cài đặt → Gói dịch vụ → Nâng cấp và chọn gói.`;
    if (has(/thanh toan|sepay|vietqr|chuyen khoan|qr|chua kich hoat|chua mo goi|giao dich loi/)) return `**Thanh toán Pro hiện dùng VietQR và SePay để tự động kích hoạt.**\n- Đăng nhập Google → chọn gói → quét QR hoặc chuyển đúng số tiền và giữ nguyên nội dung đơn FT.\n- Khi ngân hàng báo có, SePay gửi xác nhận và app tự mở Pro sau vài giây.\n- Nếu đã trừ tiền nhưng chưa mở gói, giữ ảnh giao dịch cùng mã FT và liên hệ email minhavenue@gmail.com hoặc Zalo 0945141935.\n- Thanh toán thẻ và tự động gia hạn đang trong lộ trình nâng cấp.`;
    if (has(/hoan tien|refund/)) return `**Quy trình hoàn tiền đang được hoàn thiện.**\n- Bạn hãy giữ mã đơn FT, ảnh giao dịch, thời gian và số tiền thanh toán.\n- Gửi thông tin tới minhavenue@gmail.com hoặc Zalo 0945141935 để được kiểm tra thủ công.\n- Không gửi mật khẩu, mã OTP hoặc thông tin đăng nhập ngân hàng.`;
    if (has(/ghi.*thu|ghi.*chi|them giao dich|nhap giao dich|xoa giao dich|sua giao dich/)) return `**Để ghi giao dịch, bấm nút “+” ở thanh điều hướng.**\n- Bạn có thể gõ tự nhiên, ví dụ “ăn trưa 55k tiền mặt”; app tự nhận số tiền và phân loại.\n- Kiểm tra lại ngày, ví và danh mục trước khi lưu.\n- Muốn sửa hoặc xóa, mở danh sách Giao dịch rồi chọn giao dịch cần thay đổi.`;
    if (has(/safe.to.spend|duoc tieu|muc chi an toan/)) return `**Safe-to-Spend cho biết số tiền bạn có thể tiêu hôm nay mà vẫn đủ đến kỳ lương.**\n- App tính từ tiền hiện có, nợ, hóa đơn sắp tới, khoản dự phòng và số ngày đến lương.\n- Xem con số này tại màn hình Tổng quan.\n- Cập nhật ví, ngày lương và hóa đơn đầy đủ để kết quả chính xác hơn.`;
    if (has(/financial twin|ban sao tai chinh|mo phong|neu mua|quyet dinh/)) return `**Bản sao tài chính giúp bạn thử một quyết định trước khi dùng tiền thật.**\n- Mở tab Twin → chọn loại quyết định như mua một lần, trả góp, giảm thu nhập hoặc mục tiêu.\n- Nhập số tiền và thời gian rồi chạy mô phỏng.\n- App so sánh hiện tại với sau quyết định: số dư, quỹ dự phòng, mức chi an toàn và thời điểm đạt mục tiêu.\n- Gói Miễn phí có 3 lượt/tháng; Pro không giới hạn.`;
    if (has(/stress test|stress|mat viec|vien phi|cu soc/)) return `**Stress Test kiểm tra khả năng chịu đựng khi nhiều rủi ro xảy ra cùng lúc.**\n- Mở Twin → Stress Test, chọn mất việc, giảm thu nhập, viện phí, tăng tiền nhà hoặc khoản mua khẩn cấp.\n- Kết quả cho biết quỹ dự phòng trụ được bao lâu, thời điểm nguy hiểm và khoản nên cắt trước.\n- Đây là tính năng Pro.`;
    if (has(/ai coach|coach|lap ke hoach|ke hoach tiet kiem/)) return `**AI Coach biến mục tiêu thành kế hoạch tiết kiệm cụ thể.**\n- Mở Kế hoạch → AI Coach, nhập tên mục tiêu, số tiền và số tháng.\n- App đề xuất mức chuyển ngày lương, khoản nên cắt và đánh giá tiến độ từng tuần.\n- Bạn có thể nhận phương án từ mô phỏng Twin rồi tạo mục tiêu trực tiếp.\n- Đây là tính năng Pro.`;
    if (has(/muc tieu/)) return `**Bạn quản lý mục tiêu tại Kế hoạch → Mục tiêu.**\n- Nhập số tiền cần đạt, số đã có, hạn hoàn thành và mức góp mỗi tháng.\n- App hiển thị tiến độ và mức cần góp để kịp hạn.\n- Gói Miễn phí tạo tối đa 2 mục tiêu; Pro không giới hạn.`;
    if (has(/ngan sach/)) return `**Bạn thiết lập hạn mức tại Kế hoạch → Ngân sách.**\n- Đặt ngân sách cho từng nhóm như ăn uống, đi lại, mua sắm hoặc giải trí.\n- App theo dõi phần trăm đã dùng, cảnh báo khi tiêu nhanh hoặc sắp vượt.\n- Ghi giao dịch đúng danh mục giúp cảnh báo chính xác.`;
    if (has(/hoa don|dinh ky|dang ky|subscription/)) return `**Các khoản định kỳ được quản lý tại Kế hoạch → Hóa đơn.**\n- Thêm lương, tiền nhà, điện nước, đăng ký dịch vụ, tiết kiệm hoặc trả góp cùng ngày phát sinh.\n- Khi đã thanh toán hoặc nhận tiền, bấm trạng thái tương ứng.\n- App dùng các khoản này để dự báo và nhắc trước hạn.`;
    if (has(/sao ke|pdf|excel|csv|tai file|nhap file/)) return `**Bạn nhập sao kê bằng nút “+” → chọn Nhập file.**\n- Hỗ trợ CSV; PDF/Excel dành cho Pro.\n- App đọc và phân loại trước, sau đó luôn cho bạn kiểm tra, sửa và xác nhận mới lưu.\n- Nếu file ngân hàng có bố cục lạ, hãy xuất CSV hoặc liên hệ hỗ trợ để bổ sung mẫu đọc.`;
    if (has(/bao cao|thong ke|phan tich/)) return `**Báo cáo giúp xem thu, chi, tiết kiệm và xu hướng theo tuần hoặc tháng.**\n- Mở tab Báo cáo để xem nhóm chi lớn, so sánh kỳ trước, khoản bất thường và việc nên làm tiếp theo.\n- Báo cáo đầy đủ là tính năng Pro; Tổng quan và cảnh báo cơ bản vẫn có trong gói Miễn phí.`;
    if (has(/ho so|profile/)) return `**Hồ sơ giúp tách dữ liệu tài chính cho từng người hoặc từng tình huống.**\n- Vào Cài đặt → Hồ sơ để đổi hoặc tạo hồ sơ mới.\n- Gói Miễn phí có 1 hồ sơ cá nhân; Pro không giới hạn.\n- Hồ sơ “Dữ liệu mẫu” chỉ dùng trải nghiệm và không phải dữ liệu thật của bạn.`;
    if (has(/du lieu mau|xoa du lieu mau|so lieu mau/)) return `**Dữ liệu mẫu là hồ sơ minh họa để bạn xem nhanh toàn bộ tính năng.**\n- Vào Cài đặt → Hồ sơ để chuyển sang hồ sơ cá nhân hoặc tạo hồ sơ mới.\n- App không trộn dữ liệu mẫu vào hồ sơ thật.\n- Khi demo, bạn có thể giữ hồ sơ mẫu để các biểu đồ và mô phỏng luôn có dữ liệu.`;
    if (has(/bao mat|rieng tu|an toan|ma pin|pin|mat khau|otp/)) return `**Financial Twin ưu tiên bảo vệ dữ liệu và không yêu cầu mật khẩu ngân hàng.**\n- Bạn có thể bật mã PIN; dữ liệu được mã hóa AES-GCM và khóa được tạo từ PIN.\n- Số tài khoản, số thẻ trong văn bản được tự động che trước khi gửi AI.\n- AI không có quyền ghi giao dịch hay chuyển tiền.\n- Không cung cấp mật khẩu hoặc OTP cho bất kỳ ai, kể cả bộ phận hỗ trợ.`;
    if (has(/lien he|ho tro|nhan vien|gap nguoi|khong giai quyet|email|zalo/)) return `**Bạn có thể liên hệ hỗ trợ trực tiếp khi Hỏi Twin chưa giải quyết được.**\n- Email: minhavenue@gmail.com\n- Zalo: 0945141935\n- Khi báo lỗi, hãy gửi tên chức năng, ảnh màn hình và thời điểm xảy ra lỗi; không gửi mật khẩu hoặc OTP.`;
    if (has(/internet|offline|mang/)) return `**Các phép tính và ghi chép cơ bản vẫn hoạt động trong trình duyệt, nhưng đăng nhập, đồng bộ và thanh toán cần Internet.**\n- Khi mất mạng, tránh xóa dữ liệu trình duyệt.\n- Kết nối lại và đăng nhập đúng Google để dữ liệu tiếp tục đồng bộ.`;
    if (has(/lam sao|cach dung|huong dan|thao tac|o dau|khong thay/)) return `**Tôi chưa xác định đúng chức năng bạn đang hỏi.**\n- Bạn hãy nói tên nút hoặc màn hình, ví dụ: “Cách tạo mục tiêu”, “Nhập sao kê ở đâu?” hoặc “Thanh toán chưa mở Pro”.\n- Nếu vẫn chưa xử lý được, liên hệ minhavenue@gmail.com hoặc Zalo 0945141935.`;
    return null;
  }
  function localAnswer(q, st) {
    const help = supportAnswer(q); if (help) return help;
    const n = norm(q); const f = forecast(st); const lines = [];
    const prevMk = shiftM(f.mk, -1);
    if (!/giam/.test(n) && /nhieu hon|so voi thang truoc|tang o dau|thang truoc/.test(n)) {
      const a = monthSummary(st, f.mk, f.d), b = monthSummary(st, prevMk, f.d);
      const diffs = CATS.map(c => ({ c, now: a.byCat[c.id] || 0, before: b.byCat[c.id] || 0 })).map(x => ({ ...x, diff: x.now - x.before })).filter(x => x.diff > 0).sort((x, y) => y.diff - x.diff);
      lines.push(`**Từ ngày 1 đến ${f.d}, bạn chi ${vnd(a.spend)}, ${a.spend >= b.spend ? 'nhiều hơn' : 'ít hơn'} ${vnd(Math.abs(a.spend - b.spend))} so với cùng kỳ ${mLabel(prevMk)} (${vnd(b.spend)}).**`);
      if (diffs.length) { lines.push('Tăng nhiều nhất ở:'); diffs.slice(0, 3).forEach(x => lines.push(`- ${x.c.name}: ${vnd(x.now)} so với ${vnd(x.before)} → **+${vnd(x.diff)}**`)); }
      const big = st.txns.filter(t => isVar(t) && mkey(t.date) === f.mk).sort((x, y) => y.amount - x.amount)[0];
      if (big) lines.push(`Khoản lớn nhất tháng này: ${big.merchant}${big.note ? ' (' + big.note + ')' : ''} ${vnd(big.amount)}.`);
      lines.push(`_Cách tính: so sánh cùng số ngày (1–${f.d}) của hai tháng, không tính tiền chuyển vào tiết kiệm._`);
      return lines.join('\n');
    }
    if (!/giam/.test(n) && /du tien|mua duoc|co nen mua|mua (dien thoai|xe|laptop|may)|co du/.test(n)) {
      const amt = amountIn(n) || 15000000; const surplus = avgSurplus(st);
      const after = f.end - amt;
      lines.push(after >= 0 ? `**Đủ, nhưng sát.** Sau khi mua ${vnd(amt)}, cuối tháng còn khoảng ${vnd(after)}.` : `**Chưa nên mua ngay.** Nếu mua ${vnd(amt)} bây giờ, cuối tháng bạn sẽ hụt khoảng ${vnd(-after)}.`);
      lines.push(`Phép tính: Dự kiến cuối tháng ${vnd(f.end)} − giá mua ${vnd(amt)} = ${vnd(after)}.`);
      if (after < 0 && surplus > 0) { const months = Math.ceil((amt - Math.max(0, f.end)) / surplus); lines.push(`Mỗi tháng bạn dư trung bình ${vnd(surplus)} (3 tháng gần nhất). Để dành riêng cho khoản này thì sau khoảng **${months} tháng** là đủ mà không đụng quỹ khẩn cấp.`); }
      lines.push(`_Giả định: giữ mức chi ${vnd(f.daily)}/ngày, các hóa đơn cố định không đổi._`);
      return lines.join('\n');
    }
    if (/giam (an ngoai|an uong|chi)/.test(n)) {
      const p = (n.match(/(\d{1,2})\s*%/) || [, 20])[1]; const pct = Number(p) / 100;
      const out = st.txns.filter(t => isVar(t) && t.cat === 'an-uong' && !/winmart|bach hoa|cho|sieu thi/.test(norm(t.merchant)));
      const avg = sum(prior3(st, f.mk).map(k => sum(out.filter(t => mkey(t.date) === k).map(t => t.amount)))) / 3;
      const cut = Math.round(avg * pct / 10000) * 10000;
      const g = st.goals.find(g => /du lich/.test(norm(g.name))) || st.goals[0];
      lines.push(`**Giảm ${Math.round(pct * 100)}% ăn ngoài giúp bạn để ra thêm khoảng ${vnd(cut)}/tháng.**`);
      lines.push(`Phép tính: ăn ngoài trung bình ${vnd(avg)}/tháng × ${Math.round(pct * 100)}% = ${vnd(cut)}.`);
      if (g) { const c = goalCalc(st, g); const m1 = c.monthly ? Math.ceil(c.remaining / c.monthly) : Infinity; const m2 = Math.ceil(c.remaining / ((c.monthly || 0) + cut));
        lines.push(`Mục tiêu "${g.name}" còn thiếu ${vnd(c.remaining)}. Đang góp ${vnd(c.monthly)}/tháng → cần ${m1} tháng. Góp thêm ${vnd(cut)} → còn **${m2} tháng**${m1 > m2 ? `, nhanh hơn ${m1 - m2} tháng` : ''}.`); }
      lines.push('_Ăn ngoài = nhóm Ăn uống trừ đi chợ, siêu thị. Trung bình 3 tháng gần nhất._');
      return lines.join('\n');
    }
    if (/vuot ngan sach|ngan sach/.test(n)) {
      const bs = budgetStatus(st).filter(b => b.cat !== 'tiet-kiem').sort((a, b) => b.pct - a.pct);
      const bad = bs.filter(b => b.pct >= .9 || b.fast || b.projected > b.limit);
      if (!bad.length) return `**Chưa có nhóm nào vượt ngân sách.** Nhóm dùng nhiều nhất là ${catOf(bs[0].cat).name}: ${Math.round(bs[0].pct * 100)}%.`;
      lines.push(`**${bad.length} nhóm đang làm bạn vượt hoặc sắp vượt ngân sách:**`);
      bad.forEach(b => { const tops = st.txns.filter(t => t.cat === b.cat && mkey(t.date) === f.mk && t.type === 'expense'); const by = {}; tops.forEach(t => by[t.merchant] = (by[t.merchant] || 0) + t.amount); const top = Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k, v]) => `${k} ${vnd(v)}`).join(', ');
        lines.push(`- ${catOf(b.cat).name}: ${vnd(b.spent)} / ${vnd(b.limit)} (${Math.round(b.pct * 100)}%). Theo tốc độ này cả tháng sẽ là ${vnd(b.projected)}. Chi nhiều nhất: ${top}.`); });
      lines.push(`_Tốc độ = đã chi ÷ ${f.d} ngày × ${f.L} ngày._`);
      return lines.join('\n');
    }
    if (/tiet kiem|ke hoach/.test(n) && /thang/.test(n)) {
      const amt = amountIn(n) || 30000000; const months = Number((n.match(/(\d+)\s*thang/) || [, 10])[1]);
      const per = Math.ceil(amt / months / 10000) * 10000; const surplus = avgSurplus(st); const gap = per - surplus;
      lines.push(`**Cần để dành ${vnd(per)} mỗi tháng trong ${months} tháng.**`);
      lines.push(`Phép tính: ${vnd(amt)} ÷ ${months} tháng = ${vnd(per)}/tháng.`);
      lines.push(`Hiện mỗi tháng bạn dư trung bình ${vnd(surplus)} (sau khi đã chuyển quỹ tiết kiệm cố định).`);
      if (gap > 0) { lines.push(`Còn thiếu ${vnd(gap)}/tháng. Gợi ý cắt:`); let left = gap;
        ['an-uong', 'mua-sam', 'giai-tri', 'di-lai'].map(c => ({ c, avg: avgMonthly(st, c) })).sort((a, b) => b.avg - a.avg).forEach(o => { if (left <= 0) return; const cut = Math.min(Math.round(o.avg * .25 / 10000) * 10000, left); if (cut <= 0) return; left -= cut; lines.push(`- ${catOf(o.c).name}: giảm ${vnd(cut)} (từ ${vnd(o.avg)} xuống ${vnd(o.avg - cut)})`); });
        if (left > 0) lines.push(`Vẫn thiếu ${vnd(left)}/tháng → nên kéo dài thời gian lên ${Math.ceil(amt / Math.max(surplus + gap - left, 1))} tháng.`); }
      else lines.push('Bạn làm được mà không cần cắt chi tiêu. Nên đặt lệnh chuyển tự động ngay sau ngày nhận lương.');
      return lines.join('\n');
    }
    lines.push(`**Tình hình hiện tại:** bạn có thể dùng ${vnd(f.available)} trong ${f.daysLeft} ngày còn lại (khoảng ${vnd(f.safeDaily)}/ngày).`);
    lines.push(f.end < 0 ? `Giữ mức chi hiện tại thì cuối tháng thiếu khoảng ${vnd(-f.end)}.` : `Giữ mức chi hiện tại thì cuối tháng còn dư khoảng ${vnd(f.end)}.`);
    lines.push('Bạn có thể hỏi: so với tháng trước, có đủ tiền mua món X không, giảm ăn ngoài bao nhiêu %, nhóm nào vượt ngân sách, lập kế hoạch tiết kiệm.');
    return lines.join('\n');
  }

  function aiContext(st) {
    const f = forecast(st); const cur = monthSummary(st, f.mk, f.d); const prev = monthSummary(st, shiftM(f.mk, -1), f.d); const prevFull = monthSummary(st, shiftM(f.mk, -1));
    const fmt = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [catOf(k).name, v]));
    return {
      hom_nay: f.T, so_ngay_con_lai: f.daysLeft, tong_tien_hien_co: f.pos.cash, no_the_tin_dung: f.pos.debt,
      thu_nhap_sap_ve_trong_thang: f.upIncome, hoa_don_sap_toi_trong_thang: f.upOut, tien_co_the_dung: f.available,
      chi_bien_doi_binh_quan_ngay: f.daily, du_kien_cuoi_thang: f.end, ngay_bat_dau_am: f.firstRisk ? f.firstRisk.day : null,
      thang_nay_den_hom_nay: { thu: cur.income, chi: cur.spend, tiet_kiem: cur.saved, theo_nhom: fmt(cur.byCat) },
      cung_ky_thang_truoc: { thu: prev.income, chi: prev.spend, theo_nhom: fmt(prev.byCat) },
      ca_thang_truoc: { thu: prevFull.income, chi: prevFull.spend, tiet_kiem: prevFull.saved, theo_nhom: fmt(prevFull.byCat) },
      du_trung_binh_3_thang: Math.round(avgSurplus(st)),
      ngan_sach: budgetStatus(st).map(b => ({ nhom: catOf(b.cat).name, han_muc: b.limit, da_chi: b.spent, du_kien_ca_thang: b.projected })),
      muc_tieu: st.goals.map(g => { const c = goalCalc(st, g); return { ten: g.name, can: g.target, da_co: g.saved, han: g.deadline, dang_gop_moi_thang: c.monthly, can_gop_moi_thang: c.need }; }),
      hoa_don_dinh_ky: st.bills.map(b => ({ ten: b.name, so_tien: b.amount, ngay: b.day, loai: b.kind })),
      giao_dich_gan_day: st.txns.filter(t => t.type !== 'transfer').slice(-40).map(t => [t.date, t.type === 'income' ? '+' : '-', t.amount, catOf(t.cat).name, t.merchant + (t.note ? ' (' + t.note + ')' : '')]),
    };
  }

  /* ---------- Báo cáo ---------- */
  function report(st, period) {
    const f = forecast(st); const T = f.T; let from, to, pFrom, pTo, label, prevLabel;
    if (period === 'week') { from = addDays(T, -6); to = T; pFrom = addDays(T, -13); pTo = addDays(T, -7); label = `${dLabel(from)} – ${dLabel(to)}`; prevLabel = '7 ngày trước đó'; }
    else { [from, to] = monthRange(f.mk, f.d); [pFrom, pTo] = monthRange(shiftM(f.mk, -1), f.d); label = `${mLabel(f.mk)} (đến ngày ${f.d})`; prevLabel = `cùng kỳ ${mLabel(shiftM(f.mk, -1))}`; }
    const a = periodStats(st, from, to), b = periodStats(st, pFrom, pTo);
    const cats = Object.entries(a.byCat).filter(([c]) => c !== 'tiet-kiem').sort((x, y) => y[1] - x[1]);
    const rate = a.income > 0 ? (a.income - a.spend) / a.income : null;
    const unusual = alerts(st).filter(x => x.tag === 'Bất thường');
    const actions = [];
    const bs = budgetStatus(st).filter(x => x.cat !== 'tiet-kiem').sort((x, y) => y.pct - x.pct);
    if (f.end < 0) actions.push({ t: `Giữ chi tiêu dưới ${vnd(f.safeDaily)}/ngày đến hết tháng`, d: `Đây là mức để không bị thiếu ${vnd(-f.end)} cuối tháng.` });
    if (bs[0] && (bs[0].pct >= .9 || bs[0].fast)) { const c = catOf(bs[0].cat); actions.push(bs[0].pct >= 1 ? { t: `Dừng chi ${c.name.toLowerCase()} đến hết tháng`, d: `Nhóm này đã vượt ${vnd(bs[0].spent - bs[0].limit)} so với ngân sách ${vnd(bs[0].limit)}.` } : { t: `Giữ ${c.name.toLowerCase()} trong ${vnd(bs[0].limit - bs[0].spent)} còn lại`, d: `Nhóm này đã dùng ${Math.round(bs[0].pct * 100)}% ngân sách.` }); }
    const subs = st.bills.filter(x => x.kind === 'sub'); if (subs.length) actions.push({ t: `Rà lại ${subs.length} dịch vụ đăng ký`, d: `${subs.map(x => x.name).join(', ')}: tổng ${vnd(sum(subs.map(x => x.amount)))}/tháng. Hủy 1 dịch vụ ít dùng = tiết kiệm ${vnd(sum(subs.map(x => x.amount)) * 12 / subs.length)}/năm.` });
    const cs = cutSuggestion(st); if (cs && actions.length < 3) actions.push({ t: `Giảm 20% ${catOf(cs.cat).name.toLowerCase()} tháng tới`, d: `Trung bình ${vnd(cs.avg)}/tháng → để ra ${vnd(cs.cut)}/tháng cho mục tiêu.` });
    const rec = detectRecurring(st); if (rec.length && actions.length < 3) actions.push({ t: `Thêm ${rec[0].name} vào hóa đơn định kỳ`, d: `Khoản ${vnd(rec[0].amount)} lặp lại hằng tháng, đưa vào để dự báo chính xác hơn.` });
    return { label, prevLabel, a, b, cats, rate, unusual, actions: actions.slice(0, 3), goals: st.goals.map(g => ({ g, c: goalCalc(st, g) })) };
  }

  return { unusualSet, pad, ymd, pd, dim, addDays, mkey, shiftM, dayDiff, realToday, norm, sum, uid, CATS, INCATS, catOf, sampleState, emptyState, todayOf, balances, position, periodStats, monthSummary, history, forecast, budgetStatus, alerts, detectRecurring, goalCalc, cutSuggestion, parseText, parseOne, parseAmount, vnd, short, accName, mLabel, dLabel, supportAnswer, localAnswer, aiContext, report, isSpend, isVar, billPaid };
})();
if (typeof module !== 'undefined') module.exports = FT;

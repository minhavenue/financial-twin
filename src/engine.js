/* ===== Financial Twin — bộ máy mô phỏng v2 =====
   Mọi con số do các hàm dưới đây tính. AI chỉ đọc kết quả và giải thích. */
(() => {
  const { pad, ymd, pd, dim, addDays, mkey, shiftM, dayDiff, norm, sum, uid, CATS, catOf, todayOf, position, monthSummary, forecast, unusualSet, billPaid, isSpend, isVar, vnd, short, parseAmount, parseOne } = FT;
  const median = a => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); const h = s.length >> 1; return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2; };
  const mean = a => a.length ? sum(a) / a.length : 0;
  const std = a => { if (a.length < 2) return 0; const m = mean(a); return Math.sqrt(sum(a.map(x => (x - m) ** 2)) / (a.length - 1)); };
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const r1k = x => Math.round(x / 1000) * 1000;
  const r10k = x => Math.round(x / 10000) * 10000;
  const c10k = x => Math.ceil(x / 10000) * 10000;
  const mDiff = (a, b) => { const [y1, m1] = a.split('-').map(Number), [y2, m2] = b.split('-').map(Number); return (y2 - y1) * 12 + (m2 - m1); };
  const mShort = mk => { const [y, m] = mk.split('-').map(Number); return `T${m}/${String(y).slice(2)}`; };
  const mFull = mk => { const [y, m] = mk.split('-').map(Number); return `tháng ${m}/${y}`; };
  const dFull = s => { const { d, m, y } = pd(s); return `${d}/${m}/${y}`; };
  const dShort = s => { const { d, m } = pd(s); return `${d}/${m}`; };
  function Phi(z) { const t = 1 / (1 + 0.2316419 * Math.abs(z)); const d = 0.3989423 * Math.exp(-z * z / 2); const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return z > 0 ? 1 - p : p; }
  const pct = x => Math.round(x * 100) + '%';
  const months1 = x => (Math.round(x * 10) / 10).toString().replace('.', ',');

  const activeBills = st => st.bills.filter(b => !b.paused && !(b.kind === 'loan' && b.monthsLeft === 0));
  const isEmergency = g => !!g && (g.emergency || /khan cap|du phong/.test(norm(g.name)));
  const DELIVERY = ['grabfood', 'shopeefood', 'baemin', 'befood', 'be food', 'giao do an', 'gofood'];
  const GROCERY = ['winmart', 'bach hoa', 'di cho', 'sieu thi', 'coopmart', 'big c', 'lotte mart', 'aeon', 'cho '];
  const isDelivery = t => DELIVERY.some(k => norm(t.merchant).includes(k));
  const isGrocery = t => GROCERY.some(k => (norm(t.merchant) + ' ').includes(k));
  const isEatOut = t => t.cat === 'an-uong' && !isDelivery(t) && !isGrocery(t);

  /* ================= Mô hình nền ================= */
  function model(st, opts = {}) {
    const T = todayOf(st); const f = forecast(st); const mk = mkey(T);
    const UN = unusualSet(st);
    const firstDate = st.txns.reduce((a, t) => (!a || t.date < a) ? t.date : a, null);
    const valid = [1, 2, 3].map(i => shiftM(mk, -i)).filter(k => firstDate && firstDate <= k + '-03');
    const nM = valid.length;
    const varTx = st.txns.filter(t => isVar(t) && !UN.has(t.id));
    const varByCat = {}; let varAvg;
    const inValid = t => valid.includes(mkey(t.date));
    if (nM) { varTx.filter(inValid).forEach(t => varByCat[t.cat] = (varByCat[t.cat] || 0) + t.amount / nM); varAvg = sum(Object.values(varByCat)); }
    else { const d = pd(T).d; varTx.filter(t => mkey(t.date) === mk).forEach(t => varByCat[t.cat] = (varByCat[t.cat] || 0) + t.amount / Math.max(d, 1) * 30.4); varAvg = f.daily * 30.4; }
    const avgOf = pred => nM ? sum(varTx.filter(t => inValid(t) && pred(t)).map(t => t.amount)) / nM : 0;
    const delivery = avgOf(isDelivery), eatOut = avgOf(isEatOut);
    const bills = activeBills(st);
    let incomeBills = bills.filter(b => b.kind === 'income');
    if (!incomeBills.length) {
      const avgInc = nM ? mean(valid.map(k => monthSummary(st, k).income)) : 0;
      if (avgInc > 0) incomeBills = [{ id: '_inc', name: 'Thu nhập trung bình', amount: r10k(avgInc), day: st.profile.payday || 5, kind: 'income', cat: 'luong', pseudo: true }];
    }
    const income = sum(incomeBills.map(b => b.amount));
    const plan = st.plan && st.plan.active ? st.plan : null;
    const followPlan = !!plan && opts.followPlan !== false;
    const planCut = followPlan ? sum(plan.items.filter(i => i.type === 'cut').map(i => i.monthly)) : 0;
    const planPause = followPlan ? plan.items.filter(i => i.type === 'pause').flatMap(i => i.billIds || []) : [];
    const fixedBills = bills.filter(b => (b.kind === 'bill' || b.kind === 'sub') && !planPause.includes(b.id));
    const fixed = sum(fixedBills.map(b => b.amount));
    const pauseSave = sum(bills.filter(b => planPause.includes(b.id)).map(b => b.amount));
    const loans = bills.filter(b => b.kind === 'loan');
    const loanPay = sum(loans.map(b => b.amount));
    const emergency = st.goals.find(isEmergency) || null;
    const reserve = emergency ? emergency.saved : 0;
    const openGoals = st.goals.filter(g => g.saved < g.target && g.monthly > 0);
    const contrib = sum(openGoals.map(g => g.monthly));
    const unlinkedSaving = sum(bills.filter(b => b.kind === 'saving' && !b.goalId).map(b => b.amount));
    const varMonthly = Math.max(0, varAvg - planCut);
    const burn = fixed + loanPay + varMonthly;
    const surplus = income - fixed - loanPay - varMonthly - contrib - unlinkedSaving;
    const buffer = st.settings.buffer ?? 500000;
    const payday = incomeBills.length ? Math.min(...incomeBills.map(b => b.day)) : (st.profile.payday || 5);
    return { T, f, mk, nM, valid, UN, varAvg, varByCat, delivery, eatOut, varMonthly, income, incomeBills, fixed, fixedBills, loanPay, loans, contrib, openGoals, unlinkedSaving, emergency, reserve, burn, surplus, buffer, payday, plan, followPlan, planCut, planPause, pauseSave, net: f.pos.net };
  }

  /* ================= Mô phỏng dòng tiền theo ngày ================= */
  // sc: { events:[{date, amount(+vào/−ra), label}], recurring:[{amount, from, months, day, label}],
  //       incomeLoss:{from, months}, incomeCut:{pct, from, months}, billUp:[{test, pct, from}], loanUpPct, from,
  //       cutMonthly, cutFrom, pauseSubs, pauseGoals, extraGoal:{id,name,target,monthly,saved} }
  function simulate(st, sc = {}, opts = {}) {
    const M = opts.model || model(st, opts);
    const T = M.T, T0 = pd(T);
    const horizon = opts.months || 12;
    const endDate = opts.until || (() => { const k = shiftM(M.mk, horizon); const [y, m] = k.split('-').map(Number); return ymd(y, m, dim(y, m)); })();
    let cash = M.net; let drawn = 0;
    const goals = st.goals.map(g => ({ ...g })); if (sc.extraGoal) goals.push({ ...sc.extraGoal });
    const saved = {}; goals.forEach(g => saved[g.id] = g.saved);
    const eid = M.emergency ? M.emergency.id : null;
    const reserve = () => eid ? saved[eid] : 0;
    const loanLeft = {}; M.loans.forEach(b => loanLeft[b.id] = b.monthsLeft == null ? Infinity : b.monthsLeft);
    const outBills = activeBills(st).filter(b => b.kind !== 'income' && !M.planPause.includes(b.id));
    const pending = new Set(M.f.pending.map(b => b.id));
    const goalLink = {}; st.bills.forEach(b => { if (b.goalId && !b.paused) goalLink[b.goalId] = b; });
    const goalDone = {}; goals.forEach(g => { if (saved[g.id] >= g.target) goalDone[g.id] = T; });
    const points = []; const mon = {}; const monthly = [];
    let firstNeg = null, firstDeficit = null, reserveOut = null, minCash = cash, maxDeficit = 0;
    const getMon = k => mon[k] || (mon[k] = { mk: k, minRaw: Infinity, endRaw: 0, endCash: 0, endReserve: 0, drawn: 0, income: 0, skipped: 0, deficit: 0, minTotal: Infinity, saved: {} });
    const dueHit = (b, d, L, mi, first, day) => {
      if (mi === 0) { if (b.pseudo) return b.day > T0.d && d === Math.min(b.day, L); if (!pending.has(b.id)) return false; if (b.day <= T0.d) return first; }
      return d === Math.min(b.day, L);
    };
    const record = (day, k) => {
      const raw = cash - drawn; const total = cash + sum(Object.values(saved));
      points.push({ date: day, cash, raw, reserve: reserve(), total });
      const mm = getMon(k); mm.minRaw = Math.min(mm.minRaw, raw); mm.endRaw = raw; mm.endCash = cash; mm.endReserve = reserve(); mm.minTotal = Math.min(mm.minTotal, total); mm.saved = { ...saved };
    };
    (sc.events || []).filter(e => e.date <= T).forEach(e => { cash += e.amount; });
    if (cash < 0) settle(T, M.mk);
    record(T, M.mk);
    function settle(day, k) {
      if (cash >= 0) return;
      if (!firstNeg) firstNeg = day;
      const r = reserve();
      if (r > 0) { const take = Math.min(r, -cash); saved[eid] -= take; cash += take; drawn += take; getMon(k).drawn += take; if (reserve() <= 0 && !reserveOut) reserveOut = day; }
      if (cash < 0) { if (!firstDeficit) firstDeficit = day; maxDeficit = Math.min(maxDeficit, cash); getMon(k).deficit = Math.min(getMon(k).deficit, cash); }
    }
    for (let day = addDays(T, 1); day <= endDate; day = addDays(day, 1)) {
      const { y, m, d } = pd(day); const L = dim(y, m); const k = mkey(day); const mi = mDiff(M.mk, k); const first = day === addDays(T, 1);
      let v = opts.zeroVar ? 0 : (mi === 0 ? M.f.daily : M.varMonthly / L);
      if (!opts.zeroVar && sc.cutMonthly && mi >= (sc.cutFrom ?? 1)) v -= sc.cutMonthly / L;
      cash -= Math.max(0, v);
      M.incomeBills.forEach(b => {
        if (!dueHit(b, d, L, mi, first, day)) return;
        let amt = b.amount;
        if (sc.incomeLoss && mi >= sc.incomeLoss.from && mi < sc.incomeLoss.from + sc.incomeLoss.months) amt = 0;
        if (sc.incomeCut && mi >= sc.incomeCut.from && (sc.incomeCut.months == null || mi < sc.incomeCut.from + sc.incomeCut.months)) amt = amt * (1 - sc.incomeCut.pct);
        cash += amt; getMon(k).income += amt;
      });
      outBills.forEach(b => {
        if (b.kind === 'saving' && b.goalId) return;
        if (!dueHit(b, d, L, mi, first, day)) return;
        if (sc.pauseSubs && b.kind === 'sub' && mi >= (sc.from ?? 1)) return;
        let amt = b.amount;
        if (b.kind === 'loan') { if (loanLeft[b.id] <= 0) return; loanLeft[b.id]--; if (sc.loanUpPct && mi >= (sc.from ?? 1)) amt *= 1 + sc.loanUpPct; }
        (sc.billUp || []).forEach(u => { if (u.test(b) && mi >= u.from) amt *= 1 + u.pct; });
        cash -= amt;
      });
      goals.forEach(g => {
        if (!(g.monthly > 0) || saved[g.id] >= g.target) return;
        const link = goalLink[g.id];
        const cday = Math.min(link ? link.day : Math.min(M.payday + 1, 28), L);
        let hit = d === cday;
        if (mi === 0) { if (g.startNow && !link) hit = d === Math.min(Math.max(cday, T0.d + 1), L) && (cday > T0.d || first); else if (!link || !pending.has(link.id)) hit = false; else if (link.day <= T0.d) hit = first; }
        if (!hit) return;
        if (sc.pauseGoals && !isEmergency(g) && mi >= (sc.from ?? 1)) return;
        const want = Math.min(g.monthly, g.target - saved[g.id]);
        const amt = Math.max(0, Math.min(want, cash - M.buffer - (opts.zeroVar ? 0 : M.burn * 0.85)));
        if (amt < want) getMon(k).skipped += want - amt;
        if (amt <= 0) return;
        cash -= amt; saved[g.id] += amt;
        if (saved[g.id] >= g.target && !goalDone[g.id]) goalDone[g.id] = day;
      });
      (sc.recurring || []).forEach(r => { if (mi >= r.from && mi < r.from + r.months && d === Math.min(r.day, L)) cash -= r.amount; });
      (sc.events || []).forEach(e => { if (e.date === day) cash += e.amount; });
      settle(day, k);
      minCash = Math.min(minCash, cash - drawn);
      record(day, k);
    }
    Object.keys(mon).sort().forEach(k => monthly.push(mon[k]));
    return { M, points, monthly, goalDone, saved, firstNeg, firstDeficit, reserveOut, drawn, maxDeficit, endDate, goals };
  }

  /* ================= Safe-to-Spend hôm nay ================= */
  function nextDue(b, M) {
    const T = M.T, { y, m, d } = pd(T), L = dim(y, m);
    if (b.pseudo) { if (b.day > d) return ymd(y, m, Math.min(b.day, L)); }
    else if (M.f.pending.some(p => p.id === b.id)) return b.day <= d ? T : ymd(y, m, Math.min(b.day, L));
    const nk = shiftM(mkey(T), 1); const [ny, nm] = nk.split('-').map(Number); return ymd(ny, nm, Math.min(b.day, dim(ny, nm)));
  }
  function safeToSpend(st, M = model(st)) {
    const T = M.T, f = M.f;
    const pays = M.incomeBills.map(b => nextDue(b, M)).filter(x => x > T).sort();
    const nextPay = pays[0] || addDays(ymd(pd(T).y, pd(T).m, f.L), 1);
    const D = Math.max(1, dayDiff(T, nextPay));
    const spentToday = sum(st.txns.filter(t => t.date === T && isVar(t)).map(t => t.amount));
    const obl = [];
    activeBills(st).filter(b => b.kind !== 'income').forEach(b => {
      if (b.kind === 'loan' && b.monthsLeft === 0) return;
      const due = nextDue(b, M); if (due < nextPay) obl.push({ name: b.name, amount: b.amount, date: due, kind: b.kind });
    });
    st.goals.forEach(g => { if (!(g.monthly > 0) || g.saved >= g.target || st.bills.some(b => b.goalId === g.id)) return; });
    const oblSum = sum(obl.map(o => o.amount));
    const pool = M.net + spentToday - oblSum - M.buffer;
    const byCash = pool / D;
    let byBudget = null;
    const vb = Object.entries(st.budgets || {}).filter(([c, v]) => c !== 'tiet-kiem' && v > 0);
    if (vb.length) { const lim = sum(vb.map(([, v]) => v)); const spentM = sum(st.txns.filter(t => isVar(t) && mkey(t.date) === M.mk && t.date < T && st.budgets[t.cat]).map(t => t.amount)); byBudget = Math.max(0, (lim - spentM) / (f.L - f.d + 1)); }
    const safe = Math.max(0, Math.floor(byCash / 1000) * 1000);
    const left = Math.max(0, safe - spentToday);
    const pace = f.daily;
    const atPace = pool - pace * D;
    return { T, nextPay, D, spentToday, obl: obl.sort((a, b) => a.date.localeCompare(b.date)), oblSum, net: M.net, buffer: M.buffer, pool, byCash, byBudget: byBudget == null ? null : Math.floor(byBudget / 1000) * 1000, safe, left, pace, atPace, over: spentToday > safe };
  }

  /* ================= Twin: Nếu… thì sao? ================= */
  const NUMW = { 'mot': 1, 'hai': 2, 'ba': 3, 'bon': 4, 'tu': 4, 'nam': 5, 'sau': 6, 'bay': 7, 'tam': 8, 'chin': 9, 'muoi': 10, 'muoi hai': 12, 'muoi tam': 18 };
  function numIn(n, unitRe) {
    const m = n.match(new RegExp('(\\d+|muoi hai|muoi tam|mot|hai|ba|bon|tu|nam|sau|bay|tam|chin|muoi)\\s*' + unitRe));
    if (!m) return null; return /\d/.test(m[1]) ? Number(m[1]) : NUMW[m[1]];
  }
  function amountOf(n) {
    const cleaned = n.replace(/(\d+|mot|hai|ba|bon|nam|sau|muoi hai|muoi)\s*(thang|nam\b|tuan|ngay|%)/g, ' ');
    const a = parseAmount(cleaned); return a && !a.guessed ? a.v : null;
  }
  function parseScenario(q) {
    const n = norm(q);
    const months = numIn(n, 'thang'); const years = numIn(n, 'nam\\b');
    const span = months || (years ? years * 12 : null);
    const amt = amountOf(n);
    const rate = (n.match(/lai(?: suat)?\s*(\d+(?:[.,]\d+)?)\s*%/) || [])[1];
    if (/stress|khung hoang|kich ban xau|vien phi/.test(n)) return { type: 'stress', jobLoss: /mat viec|nghi viec/.test(n) ? (months || 2) : 0, medical: /vien phi/.test(n) ? (amt || 15000000) : 0 };
    if (/nghi viec|mat viec|that nghiep|khong co luong|mat thu nhap/.test(n)) return { type: 'jobloss', months: months || 2 };
    if (/giam (thu nhap|luong)|bi cat luong|luong giam/.test(n)) return { type: 'incomecut', pct: Number((n.match(/(\d{1,2})\s*%/) || [, 30])[1]) / 100, months: months || 6 };
    if (/muon co|tich luy|de danh|tiet kiem duoc|co du \d|dat duoc/.test(n) && amt && span) return { type: 'goal', target: amt, months: span, name: /nha/.test(n) ? 'Mua nhà' : /xe/.test(n) ? 'Mua xe' : 'Mục tiêu ' + short(amt) };
    if (/tra gop|vay/.test(n)) return { type: 'installment', amount: amt || 20000000, months: months || 12, rate: rate != null ? Number(rate.replace(',', '.')) / 100 : (/vay/.test(n) ? 0.015 : 0), down: 0, label: labelOf(n) || 'Khoản trả góp' };
    if (amt && /mua|chi|tieu|thanh toan|sam|di du lich|sua/.test(n)) return { type: 'purchase', amount: amt, label: labelOf(n) || 'Khoản mua lớn' };
    if (amt && /tang (tien nha|chi)/.test(n)) return { type: 'recurringUp', amount: amt, label: 'Chi phí tăng thêm' };
    return null;
  }
  function labelOf(n) {
    const map = [['dien thoai', 'Điện thoại'], ['iphone', 'iPhone'], ['laptop', 'Laptop'], ['may tinh', 'Máy tính'], ['xe may', 'Xe máy'], ['o to', 'Ô tô'], ['xe', 'Xe'], ['du lich', 'Du lịch'], ['tivi', 'Tivi'], ['tu lanh', 'Tủ lạnh'], ['may giat', 'Máy giặt'], ['nha', 'Nhà']];
    const hit = map.find(([k]) => (' ' + n + ' ').includes(' ' + k)); return hit ? hit[1] : null;
  }
  function pmt(P, n, r) { if (!r) return P / n; return P * r / (1 - Math.pow(1 + r, -n)); }
  function toSim(sc0, M) {
    const T = M.T, out = { sc: {}, immediate: 0, monthlyExtra: 0, info: {} };
    if (sc0.type === 'purchase') { out.sc.events = [{ date: T, amount: -sc0.amount, label: sc0.label }]; out.immediate = sc0.amount; }
    else if (sc0.type === 'installment') {
      const down = Math.round((sc0.down || 0) * sc0.amount); const P = sc0.amount - down; const pay = r1k(pmt(P, sc0.months, sc0.rate || 0));
      out.sc.events = down ? [{ date: T, amount: -down, label: 'Trả trước' }] : [];
      out.sc.recurring = [{ amount: pay, from: 1, months: sc0.months, day: Math.min(pd(T).d, 28), label: sc0.label }];
      out.immediate = down; out.monthlyExtra = pay; out.info = { pay, down, total: pay * sc0.months + down, interest: pay * sc0.months + down - sc0.amount };
    }
    else if (sc0.type === 'jobloss') { out.sc.incomeLoss = { from: 1, months: sc0.months }; out.info = { lost: M.income * sc0.months }; }
    else if (sc0.type === 'incomecut') { out.sc.incomeCut = { pct: sc0.pct, from: 1, months: sc0.months }; out.info = { lost: M.income * sc0.pct * sc0.months }; }
    else if (sc0.type === 'recurringUp') { out.sc.recurring = [{ amount: sc0.amount, from: 1, months: 999, day: 1, label: sc0.label }]; out.monthlyExtra = sc0.amount; }
    else if (sc0.type === 'goal') { out.sc.extraGoal = { id: '_new', name: sc0.name, target: sc0.target, saved: 0, monthly: c10k(sc0.target / sc0.months), startNow: true }; out.monthlyExtra = out.sc.extraGoal.monthly; }
    return out;
  }
  function runway(cash, reserve, burn) { return burn > 0 ? Math.max(0, cash + reserve) / burn : 0; }
  function safeAvg(st, sc, M, days = 90) {
    const s = simulate(st, sc, { model: M, zeroVar: true, until: addDays(M.T, days) });
    const end = s.points[s.points.length - 1];
    return Math.max(0, Math.floor((end.raw - M.buffer) / days / 1000) * 1000);
  }
  function riskMonths(sim, n = 12) { return sim.monthly.slice(0, n + 1).filter(m => m.minRaw < 0).map(m => ({ mk: m.mk, min: m.minRaw, drawn: m.drawn, deficit: m.deficit })); }
  function etaOf(sim, g) { const d = sim.goalDone[g.id]; return d ? mkey(d) : null; }

  function whatIf(st, sc0, opts = {}) {
    const M = model(st, opts);
    const conv = toSim(sc0, M);
    const base = simulate(st, {}, { model: M, months: 36 });
    const after = simulate(st, conv.sc, { model: M, months: 36 });
    const goalsAll = after.goals.filter(g => !isEmergency(g));
    const goalRows = goalsAll.map(g => { const b = g.id === '_new' ? null : etaOf(base, g); const a = etaOf(after, g); const delay = b && a ? mDiff(b, a) : (b && !a ? 99 : 0); return { id: g.id, name: g.name, base: b, after: a, delay, deadline: g.deadline || null }; });
    const worst = goalRows.filter(r => r.id !== '_new').sort((x, y) => y.delay - x.delay)[0] || null;
    const minRes = sim => Math.min(...sim.points.slice(0, 366).map(p => p.reserve));
    const baseRun = runway(Math.max(0, M.net), M.reserve, M.burn);
    const afterRun = sc0.type === 'jobloss' || sc0.type === 'incomecut' ? baseRun : runway(Math.max(0, M.net - conv.immediate), M.reserve, M.burn + conv.monthlyExtra);
    const rb = riskMonths(base), ra = riskMonths(after);
    const safeB = safeAvg(st, {}, M), safeA = safeAvg(st, conv.sc, M);
    const endB = base.monthly[0].endRaw, endA = after.monthly[0].endRaw;
    const resB = minRes(base), resA = minRes(after);
    const d12 = addDays(M.T, 366);
    const defA = after.firstDeficit && after.firstDeficit <= d12 ? after.firstDeficit : null;
    const defB = base.firstDeficit && base.firstDeficit <= d12 ? base.firstDeficit : null;
    let verdict, vtext;
    const newDraw = Math.max(0, (M.reserve - resA) - (M.reserve - resB));
    if (defA && !defB) { verdict = 'bad'; vtext = `Không nên. Bạn sẽ dùng hết quỹ dự phòng và thiếu tiền từ ngày ${dFull(defA)}.`; }
    else if (newDraw > 0 || (worst && worst.delay >= 3)) { verdict = 'warn'; vtext = `Cân nhắc. ${newDraw > 0 ? `Bạn phải rút ${vnd(newDraw)} từ quỹ dự phòng` : ''}${newDraw > 0 && worst && worst.delay > 0 ? ' và ' : ''}${worst && worst.delay > 0 ? `${worst.name.toLowerCase()} chậm ${worst.delay >= 99 ? 'quá 3 năm' : worst.delay + ' tháng'}` : ''}.`; }
    else { verdict = 'good'; vtext = `An toàn. Không phải rút quỹ dự phòng${worst && worst.delay > 0 ? `, chỉ làm ${worst.name.toLowerCase()} chậm ${worst.delay} tháng` : ''}.`; }
    if (sc0.type === 'jobloss') {
      const lossStart = (() => { const k = shiftM(M.mk, 1); return k + '-' + pad(Math.min(M.payday, 28)); })();
      const surviveTo = after.firstDeficit; const monthsOK = surviveTo ? Math.max(0, dayDiff(lossStart, surviveTo) / 30.4) : null;
      conv.info.surviveTo = surviveTo; conv.info.monthsOK = monthsOK;
      conv.info.totalRunway = runway(Math.max(0, M.net), M.reserve, M.burn);
      if (!defA) { verdict = newDraw > 0 ? 'warn' : 'good'; vtext = `Bạn trụ được ${sc0.months} tháng không lương${newDraw > 0 ? `, nhưng phải rút ${vnd(newDraw)} quỹ dự phòng` : ''}. Nếu mất thu nhập hoàn toàn, tiền hiện có và quỹ dự phòng đủ sống khoảng ${months1(conv.info.totalRunway)} tháng.`; }
      else vtext = `Không đủ. Nghỉ ${sc0.months} tháng thì đến ngày ${dFull(defA)} bạn hết cả quỹ dự phòng. Tiền hiện có cộng quỹ dự phòng chỉ đủ sống khoảng ${months1(conv.info.totalRunway)} tháng.`;
    }
    if (sc0.type === 'installment') {
      const bad = ra.filter(r => !rb.some(x => x.mk === r.mk));
      conv.info.riskNew = bad;
      if (!defA) vtext = (bad.length ? `Cân nhắc. Mỗi tháng trả ${vnd(conv.info.pay)}; dễ thiếu tiền vào ${bad.map(r => mShort(r.mk)).join(', ')}, thường là vài ngày trước ngày lương.` : `Trả được. Mỗi tháng ${vnd(conv.info.pay)}, không làm phát sinh tháng thiếu tiền mới.`) + (conv.info.interest > 0 ? ` Tổng tiền lãi ${vnd(conv.info.interest)}.` : '');
      if (bad.length && verdict === 'good') verdict = 'warn';
    }
    const rows = [
      { key: 'end', label: 'Số dư cuối tháng', sub: 'tháng này', base: endB, after: endA, fmt: 'money', worse: endA < endB },
      { key: 'reserve', label: 'Quỹ dự phòng', sub: 'mức thấp nhất 12 tháng', base: resB, after: resA, fmt: 'money', worse: resA < resB, extra: [`đủ sống ${months1(baseRun)} tháng`, `đủ sống ${months1(afterRun)} tháng`] },
      { key: 'goal', label: 'Ngày đạt mục tiêu', sub: worst ? worst.name : 'chưa có mục tiêu', base: worst ? worst.base : null, after: worst ? worst.after : null, fmt: 'month', worse: worst && worst.delay > 0, extra: worst ? ['', worst.delay > 0 ? (worst.delay >= 99 ? 'quá 3 năm' : `chậm ${worst.delay} tháng`) : 'không đổi'] : null },
      { key: 'risk', label: 'Rủi ro thiếu tiền', sub: 'tháng phải rút quỹ', base: rb.map(r => r.mk), after: ra.map(r => r.mk), fmt: 'months', worse: ra.length > rb.length },
      { key: 'safe', label: 'Mức chi an toàn', sub: 'trung bình 90 ngày tới', base: safeB, after: safeA, fmt: 'perday', worse: safeA < safeB },
    ];
    const chart = series2(base, after, 12);
    const assumptions = assumptionsOf(M, sc0);
    let alternatives = [];
    if (sc0.type === 'purchase' && verdict !== 'good') {
      const inst = whatIfLite(st, { type: 'installment', amount: sc0.amount, months: 12, rate: 0, label: sc0.label }, M);
      const wait = M.surplus > 0 ? Math.ceil(Math.max(0, sc0.amount - Math.max(0, safeB * 30 - M.buffer)) / M.surplus) : null;
      alternatives.push({ title: 'Trả góp 0% trong 12 tháng', text: `${vnd(r1k(sc0.amount / 12))}/tháng. ${inst.defA ? 'Vẫn có lúc thiếu tiền.' : inst.newDraw > 0 ? `Phải rút ${vnd(inst.newDraw)} quỹ dự phòng.` : 'Không phải rút quỹ dự phòng.'}` });
      if (wait && wait < 60) alternatives.push({ title: `Đợi khoảng ${wait} tháng`, text: `Dành riêng phần dư ${vnd(M.surplus)}/tháng cho khoản này, mua bằng tiền đã có sẵn, không đụng quỹ dự phòng.` });
    }
    return { sc: sc0, M, base, after, rows, goalRows, verdict, vtext, info: conv.info, chart, assumptions, alternatives, riskBase: rb, riskAfter: ra, newDraw, defA };
  }
  function whatIfLite(st, sc0, M) { const conv = toSim(sc0, M); const b = simulate(st, {}, { model: M, months: 12 }), a = simulate(st, conv.sc, { model: M, months: 12 }); const minR = s => Math.min(...s.points.map(p => p.reserve)); return { defA: a.firstDeficit, newDraw: Math.max(0, minR(b) - minR(a)) }; }
  function series2(base, after, nMonths) {
    const end = addDays(base.M.T, Math.round(nMonths * 30.4)); const pick = (s) => s.points.filter((p, i) => p.date <= end && (i % 3 === 0));
    return { base: pick(base), after: after ? pick(after) : null };
  }
  function assumptionsOf(M, sc0) {
    const a = [
      `Thu nhập ${vnd(M.income)}/tháng, nhận ngày ${M.payday}.`,
      `Chi cố định ${vnd(M.fixed)}/tháng${M.loanPay ? `, trả góp ${vnd(M.loanPay)}/tháng` : ''}.`,
      `Chi linh hoạt ${vnd(M.varMonthly)}/tháng (trung bình ${M.nM || 1} tháng gần nhất, đã bỏ khoản bất thường một lần${M.followPlan ? `, đã trừ ${vnd(M.planCut)} theo kế hoạch tiết kiệm` : ''}).`,
      `Góp mục tiêu ${vnd(M.contrib)}/tháng. Khi tiền trong tài khoản không đủ, app tạm dừng góp và rút quỹ dự phòng.`,
      `Luôn giữ tối thiểu ${vnd(M.buffer)} trong tài khoản.`,
    ];
    if (sc0 && sc0.type === 'jobloss') a.unshift(`Giả định mất thu nhập từ kỳ lương tháng sau, kéo dài ${sc0.months} tháng, chi tiêu giữ nguyên.`);
    if (sc0 && sc0.type === 'installment') a.unshift(`Trả góp ${sc0.months} tháng, lãi ${Math.round((sc0.rate || 0) * 1000) / 10}%/tháng, kỳ đầu từ tháng sau.`);
    if (sc0 && sc0.type === 'purchase') a.unshift('Giả định thanh toán một lần ngay hôm nay.');
    return a;
  }

  /* ================= Stress test ================= */
  function survivalCuts(st, M) {
    const v = M.varByCat; const out = [];
    const subs = activeBills(st).filter(b => b.kind === 'sub' && !M.planPause.includes(b.id));
    if (subs.length) out.push({ key: 'subs', label: `Tạm dừng ${subs.length} dịch vụ đăng ký`, monthly: sum(subs.map(b => b.amount)) });
    const goalsP = st.goals.filter(g => !isEmergency(g) && g.monthly > 0 && g.saved < g.target);
    if (goalsP.length) out.push({ key: 'goals', label: `Tạm dừng góp ${goalsP.map(g => g.name.toLowerCase()).join(', ')}`, monthly: sum(goalsP.map(g => g.monthly)) });
    const add = (key, label, base, p) => { const x = r10k((base || 0) * p); if (x > 0) out.push({ key, label, monthly: x, cat: true }); };
    add('mua-sam', 'Mua sắm giảm 70%', v['mua-sam'], .7);
    add('giai-tri', 'Giải trí giảm 70%', v['giai-tri'], .7);
    add('an-ngoai', 'Ăn ngoài, giao đồ ăn giảm 50%', M.eatOut + M.delivery, .5);
    add('di-lai', 'Đi lại giảm 20%', v['di-lai'], .2);
    add('khac', 'Chi khác giảm 50%', v['khac'], .5);
    return out.sort((a, b) => b.monthly - a.monthly);
  }
  function stressTest(st, cfg) {
    const M = model(st);
    const sc = { from: 1, events: [], recurring: [], billUp: [] };
    const next1 = shiftM(M.mk, 1) + '-01';
    if (cfg.jobLoss) sc.incomeLoss = { from: 1, months: cfg.jobLoss };
    if (cfg.incomeCut) sc.incomeCut = { pct: cfg.incomeCut, from: 1, months: cfg.incomeCutMonths || 6 };
    if (cfg.medical) sc.events.push({ date: addDays(next1, 9), amount: -cfg.medical, label: 'Viện phí' });
    if (cfg.emergencyBuy) sc.events.push({ date: addDays(next1, 14), amount: -cfg.emergencyBuy, label: 'Mua khẩn cấp' });
    if (cfg.rentUp) sc.billUp.push({ test: b => b.cat === 'nha-o' && /nha|thue|phong/.test(norm(b.name)) && !/internet|dien|nuoc/.test(norm(b.name)), pct: cfg.rentUp, from: 1 });
    if (cfg.loanUp) sc.loanUpPct = cfg.loanUp;
    const base = simulate(st, {}, { model: M, months: 12 });
    const stress = simulate(st, sc, { model: M, months: 12 });
    const cuts = survivalCuts(st, M);
    const catCut = sum(cuts.filter(c => c.cat).map(c => c.monthly));
    const surv = simulate(st, { ...sc, cutMonthly: catCut, cutFrom: 1, pauseSubs: true, pauseGoals: true }, { model: M, months: 12 });
    const start = next1;
    const lowLine = M.burn;
    const lowDay = stress.points.find(p => p.date >= start && p.reserve + Math.max(0, p.cash) < lowLine);
    const runOut = stress.firstDeficit;
    const lasts = runOut ? dayDiff(start, runOut) / 30.4 : null;
    const lastsSurv = surv.firstDeficit ? dayDiff(start, surv.firstDeficit) / 30.4 : null;
    const needMore = runOut ? c10k(-stress.maxDeficit + M.buffer) : 0;
    const needMoreSurv = surv.firstDeficit ? c10k(-surv.maxDeficit + M.buffer) : 0;
    const shockTotal = (cfg.jobLoss ? M.income * cfg.jobLoss : 0) + (cfg.incomeCut ? M.income * cfg.incomeCut * (cfg.incomeCutMonths || 6) : 0) + (cfg.medical || 0) + (cfg.emergencyBuy || 0);
    const reserveUsed = M.reserve - Math.min(...stress.points.map(p => p.reserve));
    const target6 = M.burn * 6;
    return { M, cfg, base, stress, surv, cuts, catCut, lasts, lastsSurv, runOut, lowDay: lowDay ? lowDay.date : null, needMore, needMoreSurv, shockTotal, reserveUsed, reserveOut: stress.reserveOut, target6, gap6: Math.max(0, target6 - M.reserve), chart: { base: series2(base, null, 12).base, after: series2(stress, null, 12).base, surv: series2(surv, null, 12).base } };
  }

  /* ================= Điểm sức khỏe tài chính ================= */
  function health(st) {
    const M = model(st), S = safeToSpend(st, M);
    const F = [];
    const push = (key, name, weight, s, value, explain, tip) => F.push({ key, name, weight, score: clamp(s, 0, 1), points: Math.round(clamp(s, 0, 1) * weight), value, explain, tip, lost: weight - Math.round(clamp(s, 0, 1) * weight) });
    const ratio = M.burn > 0 ? S.atPace / M.burn : 0;
    push('liquid', 'Khả năng thanh toán', 25, (ratio + 0.1) / 0.2,
      S.atPace >= 0 ? `Dư ${vnd(S.atPace)} trước kỳ lương` : `Thiếu ${vnd(-S.atPace)} trước kỳ lương`,
      `Giữ mức chi ${vnd(S.pace)}/ngày thì đến ${dShort(S.nextPay)} bạn ${S.atPace >= 0 ? 'còn dư' : 'thiếu'} ${vnd(Math.abs(S.atPace))} sau khi trả hóa đơn và giữ ${vnd(M.buffer)} dự phòng. Điểm tối đa khi dư từ 10% chi tiêu tháng.`,
      S.atPace < 0 ? `Giữ chi dưới ${vnd(S.safe)}/ngày đến ngày lương.` : 'Duy trì mức chi hiện tại.');
    const inc = M.valid.map(k => monthSummary(st, k).income), sp = M.valid.map(k => monthSummary(st, k).spend);
    const est = !M.nM; const rate = est ? (M.income > 0 ? (M.income - M.fixed - M.loanPay - M.varMonthly) / M.income : 0) : (sum(inc) > 0 ? (sum(inc) - sum(sp)) / sum(inc) : 0);
    push('saving', 'Tỷ lệ tiết kiệm', 20, rate / 0.2, `${est ? 'Dự kiến ' : ''}${pct(rate)} thu nhập`, est ? 'Chưa đủ một tháng dữ liệu nên app dự kiến từ thu nhập, chi cố định và ngân sách bạn đã nhập. Điểm tối đa từ 20%.' : `Trung bình ${M.nM} tháng gần nhất, phần thu nhập không tiêu đi (kể cả tiền chuyển vào quỹ). Điểm tối đa từ 20%.`,
      rate < 0.2 ? `Tăng thêm ${vnd(c10k((0.2 - rate) * mean(inc)))}/tháng để đạt 20%.` : 'Đang tốt.');
    const em = M.burn > 0 ? M.reserve / M.burn : 0;
    push('reserve', 'Quỹ khẩn cấp', 20, em / 6, `Đủ ${months1(em)} tháng chi tiêu`, `Quỹ dự phòng ${vnd(M.reserve)} so với chi tiêu ${vnd(M.burn)}/tháng. Chuẩn an toàn là 6 tháng.`,
      em < 6 ? `Cần thêm ${vnd(c10k(M.burn * 6 - M.reserve))} để đủ 6 tháng.` : 'Đã đủ 6 tháng.');
    const cv = inc.length > 1 && mean(inc) > 0 ? std(inc) / mean(inc) : 0.15;
    const regular = M.incomeBills.some(b => !b.pseudo);
    push('stable', 'Ổn định thu nhập', 10, (1 - cv / 0.4) * (regular ? 1 : 0.8), regular ? `Lương cố định, dao động ${pct(cv)}` : `Dao động ${pct(cv)}`, `Đo độ chênh thu nhập giữa các tháng. Có lương cố định được tính điểm cao hơn.`, cv > 0.15 ? 'Tạo thêm một nguồn thu đều đặn.' : 'Đang tốt.');
    const dti = M.income > 0 ? M.loanPay / M.income : 0;
    const cardHeavy = M.income > 0 && M.f.pos.debt > M.income * 0.5;
    push('debt', 'Gánh nặng nợ', 15, (1 - dti / 0.4) * (cardHeavy ? 0.8 : 1), `Trả nợ ${pct(dti)} thu nhập`, `Tiền trả góp, khoản vay mỗi tháng ${vnd(M.loanPay)} so với thu nhập. Trên 40% là nguy hiểm.${cardHeavy ? ' Dư nợ thẻ đang lớn hơn nửa tháng lương.' : ''}`,
      dti > 0 ? `Khoản trả góp kết thúc sẽ cộng ${Math.round(M.loanPay / M.income * 15 / 0.4)} điểm.` : 'Không có nợ trả góp.');
    const f = M.f; const vb = Object.entries(st.budgets || {}).filter(([c, v]) => c !== 'tiet-kiem' && v > 0);
    const ms = monthSummary(st, M.mk, f.d);
    const per = vb.map(([c, lim]) => { const proj = (ms.byCat[c] || 0) / f.d * f.L; return { c, lim, proj, s: proj <= lim ? 1 : Math.max(0, 1 - (proj - lim) / lim) }; });
    const bs = per.length ? mean(per.map(p => p.s)) : 0.5;
    const overList = per.filter(p => p.proj > p.lim).map(p => catOf(p.c).name.toLowerCase());
    push('budget', 'Tuân thủ ngân sách', 10, bs, per.length ? `${per.length - overList.length}/${per.length} nhóm trong hạn mức` : 'Chưa đặt ngân sách', per.length ? `Dự kiến cả tháng theo tốc độ hiện tại so với hạn mức từng nhóm.${overList.length ? ' Vượt: ' + overList.join(', ') + '.' : ''}` : 'Đặt ngân sách để có điểm phần này.', overList.length ? `Kéo ${overList[0]} về hạn mức.` : 'Đang tốt.');
    const total = sum(F.map(x => x.points));
    const band = total >= 80 ? ['good', 'Tốt'] : total >= 60 ? ['good', 'Khá'] : total >= 40 ? ['warn', 'Cần cải thiện'] : ['bad', 'Rủi ro'];
    const ups = F.filter(x => x.score >= 0.75).sort((a, b) => b.points - a.points);
    const downs = F.filter(x => x.lost > 0).sort((a, b) => b.lost - a.lost);
    return { total, band, factors: F, ups, downs };
  }

  /* ================= Cảnh báo chủ động có giải thích ================= */
  function alerts2(st) {
    const M = model(st), S = safeToSpend(st, M), f = M.f, T = M.T, out = [];
    const UN = M.UN;
    const varDaily = (from, to) => { const o = {}; st.txns.filter(t => isVar(t) && !UN.has(t.id) && t.date >= from && t.date <= to).forEach(t => o[t.date] = (o[t.date] || 0) + t.amount); const a = []; for (let d = from; d <= to; d = addDays(d, 1)) a.push(o[d] || 0); return a; };
    // 1. Thiếu tiền trước ngày lương
    if (S.atPace < 0) {
      const dd = varDaily(addDays(T, -27), T); const sd = std(dd) || f.daily * 0.6;
      const sigma = sd * Math.sqrt(S.D); const conf = clamp(Phi(-S.atPace / sigma), 0.5, 0.97);
      const negDay = (() => { let v = S.pool; for (let i = 0; i < S.D; i++) { v -= S.pace; if (v < 0) return addDays(T, i); } return null; })();
      out.push({ id: 'shortfall', sev: 'bad', tag: 'Dự báo', title: `Có thể thiếu ${vnd(-S.atPace)} trước ngày lương`,
        what: `Giữ mức chi hiện tại, khoảng ngày ${negDay ? dShort(negDay) : dShort(S.nextPay)} tài khoản xuống dưới mức an toàn, trước ngày nhận lương ${dShort(S.nextPay)}.`,
        why: `Bạn đang chi trung bình ${vnd(S.pace)}/ngày. Còn ${S.D} ngày đến lương và ${S.obl.length} khoản phải trả (${vnd(S.oblSum)}). Tiền dùng được sau khi giữ ${vnd(S.buffer)} dự phòng là ${vnd(S.pool)}.`,
        impact: `Thiếu khoảng ${vnd(-S.atPace)}.`, impactAmt: -S.atPace,
        action: `Giữ chi dưới ${vnd(S.safe)}/ngày, tức giảm ${vnd(Math.max(0, S.pace - S.safe))}/ngày.`,
        confidence: conf, confNote: `Tính từ độ dao động chi tiêu hằng ngày 4 tuần qua (±${vnd(sd)}/ngày).`, btn: { act: 'twin', label: 'Xem bản sao dòng tiền' } });
    }
    // 2. Nhóm chi tăng trong tuần
    const enoughWeeks = st.txns.some(t => t.date <= addDays(T, -34));
    if (enoughWeeks) {
      const w0from = addDays(T, -6);
      CATS.filter(c => c.id !== 'tiet-kiem').forEach(c => {
        const weekSum = (a, b) => sum(st.txns.filter(t => isVar(t) && !UN.has(t.id) && t.cat === c.id && t.date >= a && t.date <= b).map(t => t.amount));
        const cur = weekSum(w0from, T); const prev = [1, 2, 3, 4].map(i => weekSum(addDays(T, -6 - 7 * i), addDays(T, -7 * i)));
        const avg = mean(prev); if (avg <= 0 || cur < avg * 1.3 || cur - avg < 150000) return;
        const sd = std(prev) || avg * 0.25; const conf = clamp(Phi((cur - avg) / sd), 0.55, 0.96);
        const txW = st.txns.filter(t => isVar(t) && !UN.has(t.id) && t.cat === c.id && t.date >= w0from && t.date <= T);
        const deliv = txW.filter(isDelivery);
        const ms = monthSummary(st, M.mk, f.d); const spentM = ms.byCat[c.id] || 0; const lim = st.budgets[c.id];
        const projM = spentM + cur / 7 * f.daysLeft;
        const overBy = lim ? projM - lim : 0;
        const byM = {}; txW.forEach(t => byM[t.merchant] = (byM[t.merchant] || 0) + t.amount); const topM = Object.entries(byM).sort((a, b) => b[1] - a[1]).slice(0, 2);
        const mainly = deliv.length >= 2 && sum(deliv.map(t => t.amount)) > (cur - avg) * 0.5 ? `chủ yếu từ ${deliv.length} đơn giao đồ ăn (${vnd(sum(deliv.map(t => t.amount)))})` : `nhiều nhất ở ${topM.map(([k, v]) => `${k} ${vnd(v)}`).join(', ')}`;
        out.push({ id: 'spike-' + c.id, sev: overBy > 0 ? 'warn' : 'info', tag: 'Xu hướng', title: `${c.name} tuần này cao hơn ${pct(cur / avg - 1)}`,
          what: `7 ngày qua bạn chi ${vnd(cur)} cho ${c.name.toLowerCase()}, ${mainly}.`,
          why: `Trung bình 4 tuần trước là ${vnd(avg)}/tuần. Tuần này cao hơn ${pct(cur / avg - 1)}.`,
          impact: lim ? (overBy > 0 ? `Nếu giữ tốc độ này, bạn vượt ngân sách ${c.name.toLowerCase()} ${vnd(overBy)}.` : `Vẫn trong ngân sách nhưng chỉ còn ${vnd(lim - projM)}.`) : `Thêm khoảng ${vnd((cur - avg) * 4.3)}/tháng nếu kéo dài.`, impactAmt: lim ? Math.max(0, overBy) : (cur - avg) * 4.3,
          action: deliv.length >= 2 ? `Giới hạn giao đồ ăn ${Math.max(1, deliv.length - 2)} đơn/tuần, nấu hoặc mang cơm các ngày còn lại.` : `Đặt giới hạn ${vnd(r10k(avg))}/tuần cho ${c.name.toLowerCase()}.`,
          confidence: conf, confNote: `So với độ dao động của 4 tuần trước (±${vnd(sd)}/tuần).` });
      });
    }
    // 3. Hóa đơn tăng mạnh
    activeBills(st).filter(b => b.kind === 'bill').forEach(b => {
      const cur = st.txns.find(t => t.billId === b.id && mkey(t.date) === M.mk); if (!cur) return;
      const prev = st.txns.filter(t => t.billId === b.id && mkey(t.date) < M.mk).slice(-3).map(t => t.amount); if (prev.length < 2) return;
      const avg = mean(prev); if (cur.amount < avg * 1.25 || cur.amount - avg < 100000) return;
      out.push({ id: 'billup-' + b.id, sev: 'warn', tag: 'Hóa đơn', title: `${b.name} tăng ${pct(cur.amount / avg - 1)}`,
        what: `${b.name} tháng này ${vnd(cur.amount)}, đã trừ ngày ${dShort(cur.date)}.`,
        why: `Trung bình ${prev.length} tháng trước là ${vnd(avg)}.`,
        impact: `Tốn thêm ${vnd(cur.amount - avg)} tháng này. Nếu giữ mức mới: ${vnd((cur.amount - avg) * 12)}/năm.`, impactAmt: cur.amount - avg,
        action: /dien|nuoc/.test(norm(b.name)) ? 'Kiểm tra chỉ số công tơ, điều hòa và bình nóng lạnh. Đối chiếu bậc giá điện.' : 'Đối chiếu hóa đơn chi tiết với nhà cung cấp.',
        confidence: 0.95, confNote: 'Khoản tiền đã bị trừ thật, không phải ước tính.' });
    });
    // 4. Dịch vụ định kỳ ít dùng
    activeBills(st).filter(b => b.kind === 'sub').forEach(b => {
      if (b.usage === 'rarely') out.push({ id: 'sub-' + b.id, sev: 'info', tag: 'Định kỳ', title: `${b.name}: trả đều nhưng ít dùng`,
        what: `${b.name} trừ ${vnd(b.amount)} vào ngày ${b.day} hằng tháng.`, why: 'Bạn đã đánh dấu dịch vụ này là ít dùng.',
        impact: `${vnd(b.amount * 12)}/năm.`, impactAmt: b.amount * 12, action: `Tạm dừng ${b.name}, khi cần thì đăng ký lại.`,
        confidence: 0.7, confNote: 'Dựa trên đánh giá của bạn, app không xem được mức sử dụng thật.', btn: { act: 'pausebill', id: b.id, label: 'Tạm dừng' } });
    });
    const unk = activeBills(st).find(b => b.kind === 'sub' && !b.usage);
    if (unk) out.push({ id: 'ask-' + unk.id, sev: 'info', tag: 'Định kỳ', title: `Bạn còn dùng ${unk.name} thường xuyên không?`, what: `${unk.name} trừ ${vnd(unk.amount)}/tháng.`, why: 'App không biết bạn dùng dịch vụ này nhiều hay ít.', impact: `${vnd(unk.amount * 12)}/năm nếu không dùng.`, impactAmt: unk.amount * 12, action: 'Trả lời để app gợi ý chính xác hơn.', confidence: null, ask: { id: unk.id } });
    // 5. Giao dịch có thể nhập hai lần
    const dups = findDuplicates(st, addDays(T, -30));
    dups.forEach(([a, b, conf]) => out.push({ id: 'dup-' + b.id, sev: 'warn', tag: 'Trùng', title: `Có thể nhập hai lần: ${a.merchant} ${vnd(a.amount)}`,
      what: `Hai giao dịch ${a.merchant} cùng ${vnd(a.amount)} ngày ${dShort(a.date)}${a.date !== b.date ? ' và ' + dShort(b.date) : ''}.`,
      why: `Cùng số tiền, cùng nơi bán, ${a.date === b.date ? 'cùng ngày' : 'cách nhau 1 ngày'}${b.src || a.src ? ', một khoản nhập từ ' + (b.src || a.src) : ''}.`,
      impact: `Chi tiêu đang bị tính dư ${vnd(a.amount)} nếu đúng là trùng.`, impactAmt: a.amount,
      action: 'Xóa bản trùng nếu bạn chỉ trả một lần.', confidence: conf, confNote: 'Hai đơn giống hệt nhau vẫn có thể là thật.', btn: { act: 'deldup', id: b.id, label: 'Xóa bản trùng' } }));
    // 6. Mua sắm tăng liên tục / chi tiêu cảm xúc
    if (M.nM >= 2) {
      const shop = k => sum(st.txns.filter(t => isVar(t) && !UN.has(t.id) && t.cat === 'mua-sam' && mkey(t.date) === k).map(t => t.amount));
      const seq = M.valid.slice().reverse().map(k => ({ k, v: shop(k) }));
      const curShop = shop(M.mk); const curProj = curShop / f.d * f.L; seq.push({ k: M.mk, v: curProj, proj: true });
      const rising = seq.every((x, i) => i === 0 || x.v > seq[i - 1].v * 1.05);
      const recent = st.txns.filter(t => t.cat === 'mua-sam' && t.type === 'expense' && t.date >= addDays(T, -13)).sort((a, b) => a.date.localeCompare(b.date));
      let spree = null; for (let i = 0; i + 2 < recent.length; i++) if (dayDiff(recent[i].date, recent[i + 2].date) <= 3) { spree = recent.slice(i, i + 3); break; }
      if (rising || spree) {
        const allIn = st.txns.filter(t => t.cat === 'mua-sam' && t.type === 'expense' && mkey(t.date) === M.mk);
        out.push({ id: 'emotion', sev: 'warn', tag: 'Thói quen', title: rising ? `Mua sắm tăng liên tục ${seq.length - 1} tháng` : 'Dấu hiệu mua sắm theo cảm xúc',
          what: rising ? `Mua sắm: ${seq.map(x => `${mShort(x.k)} ${short(x.v)}${x.proj ? ' (dự kiến)' : ''}`).join(' → ')}.` : `${spree.length} đơn mua sắm trong ${dayDiff(spree[0].date, spree[spree.length - 1].date) + 1} ngày.`,
          why: (rising ? 'Mỗi tháng cao hơn tháng trước, không tính khoản lớn một lần.' : '') + (spree ? ` ${spree.length} đơn liên tiếp từ ${dShort(spree[0].date)} đến ${dShort(spree[spree.length - 1].date)} (${spree.map(t => short(t.amount)).join(', ')}), dấu hiệu mua theo cảm hứng.` : ''),
          impact: `Tháng này đã mua sắm ${vnd(sum(allIn.map(t => t.amount)))}${st.budgets['mua-sam'] ? `, ngân sách ${vnd(st.budgets['mua-sam'])}` : ''}.`, impactAmt: Math.max(0, curProj - seq[0].v),
          action: 'Áp dụng quy tắc chờ 24 giờ với món trên 300.000đ. Xóa thẻ đã lưu trong ứng dụng mua sắm.',
          confidence: rising && spree ? 0.8 : 0.65, confNote: 'Dựa trên mẫu hành vi, không phải chắc chắn.' });
      }
    }
    // 7. Ngân sách
    const bsAll = FT.budgetStatus(st).filter(b => b.cat !== 'tiet-kiem');
    bsAll.forEach(b => { const n = catOf(b.cat).name; if (out.some(a => a.id === 'spike-' + b.cat)) return;
      if (b.level === 'over') out.push({ id: 'bud-' + b.cat, sev: 'bad', tag: 'Ngân sách', title: `${n} đã vượt ngân sách`, what: `Đã chi ${vnd(b.spent)} trên hạn mức ${vnd(b.limit)}.`, why: `Vượt ${vnd(b.spent - b.limit)} (${pct(b.pct)}) khi mới qua ${pct(b.timeRatio)} tháng.`, impact: `Theo tốc độ này, cả tháng là ${vnd(b.projected)}, vượt ${vnd(b.projected - b.limit)}.`, impactAmt: b.projected - b.limit, action: `Dừng chi ${n.toLowerCase()} không thiết yếu đến hết tháng.`, confidence: 0.99, confNote: 'Tính trên giao dịch đã ghi nhận.' });
      else if (b.level === 'p90' || b.fast) out.push({ id: 'bud-' + b.cat, sev: 'warn', tag: 'Ngân sách', title: `${n} đã dùng ${pct(b.pct)} ngân sách`, what: `Còn ${vnd(b.limit - b.spent)} cho ${f.daysLeft} ngày.`, why: `Mới qua ${pct(b.timeRatio)} tháng nhưng đã dùng ${pct(b.pct)} hạn mức.`, impact: b.projected > b.limit ? `Dự kiến vượt ${vnd(b.projected - b.limit)}.` : 'Sát hạn mức.', impactAmt: Math.max(0, b.projected - b.limit), action: `Giữ ${n.toLowerCase()} dưới ${vnd(r1k((b.limit - b.spent) / Math.max(1, f.daysLeft)))}/ngày.`, confidence: 0.85, confNote: 'Dự báo theo tốc độ chi đều các ngày còn lại.' }); });
    // 8. Khoản lớn bất thường (tháng này)
    st.txns.filter(t => UN.has(t.id) && mkey(t.date) === M.mk).forEach(t => {
      const hist = st.txns.filter(x => isVar(x) && x.cat === t.cat && [1, 2, 3].map(i => shiftM(M.mk, -i)).includes(mkey(x.date))).map(x => x.amount); const med = median(hist);
      out.push({ id: 'big-' + t.id, sev: 'info', tag: 'Bất thường', title: `Khoản lớn: ${t.merchant} ${vnd(t.amount)}`, what: `${t.merchant}${t.note ? ' · ' + t.note : ''} ngày ${dShort(t.date)}.`, why: `Gấp ${Math.round(t.amount / med)} lần một khoản ${catOf(t.cat).name.toLowerCase()} thông thường (${vnd(med)}).`, impact: 'App coi đây là khoản một lần, không tính vào mức chi hằng ngày khi dự báo.', impactAmt: t.amount, action: 'Nếu đây là khoản định kỳ, hãy thêm vào Hóa đơn.', confidence: 0.9, confNote: 'So với trung vị 3 tháng trước.' });
    });
    // 9. Nguy cơ không đạt mục tiêu
    const sim = simulate(st, {}, { model: M, months: 36 });
    st.goals.filter(g => !isEmergency(g) && g.deadline && g.saved < g.target).forEach(g => {
      const done = sim.goalDone[g.id]; const dk = mkey(g.deadline);
      if (done && mkey(done) <= dk) return;
      const atDl = sim.monthly.find(m => m.mk === dk); const have = atDl ? (atDl.saved[g.id] ?? g.saved) : g.saved;
      const short_ = Math.max(0, g.target - have); const mLeft = Math.max(1, mDiff(M.mk, dk));
      out.push({ id: 'goal-' + g.id, sev: 'warn', tag: 'Mục tiêu', title: `${g.name} có thể trễ hạn`, what: `Hạn ${mFull(dk)} nhưng dự kiến ${done ? 'xong ' + mFull(mkey(done)) : 'chưa xong trong 3 năm'}.`,
        why: `Đang góp ${vnd(g.monthly || 0)}/tháng${sim.monthly.some(m => m.skipped > 0) ? ', và có tháng phải hoãn góp vì tài khoản không đủ tiền' : ''}.`,
        impact: `Đến hạn còn thiếu khoảng ${vnd(short_)}.`, impactAmt: short_, action: `Góp thêm ${vnd(c10k(short_ / mLeft))}/tháng, hoặc dời hạn sang ${done ? mFull(mkey(done)) : 'sau'}.`,
        confidence: 0.7, confNote: 'Theo mô phỏng dòng tiền với thói quen chi hiện tại.', btn: { act: 'goplan', id: 'goals', label: 'Xem mục tiêu' } });
    });
    // 10. Gia hạn sắp tới
    f.pending.filter(b => b.kind === 'sub' && !b.overdue && b.day - f.d <= 3).forEach(b => { if (out.some(a => a.id === 'sub-' + b.id)) return; out.push({ id: 'renew-' + b.id, sev: 'info', tag: 'Định kỳ', title: `${b.name} gia hạn ${b.day - f.d === 0 ? 'hôm nay' : 'sau ' + (b.day - f.d) + ' ngày'}`, what: `${vnd(b.amount)} sẽ trừ vào ${FT.accName(st, b.account)} ngày ${b.day}.`, why: 'Theo lịch khoản định kỳ.', impact: `${vnd(b.amount)}.`, impactAmt: b.amount, action: 'Hủy trước ngày gia hạn nếu không dùng.', confidence: 0.98, confNote: 'Theo lịch đã lưu.' }); });
    if (out.some(a => a.id === 'emotion')) { const i = out.findIndex(a => a.id === 'spike-mua-sam'); if (i >= 0) out.splice(i, 1); }
    const rank = { bad: 0, warn: 1, info: 2 };
    return out.sort((a, b) => rank[a.sev] - rank[b.sev] || (b.impactAmt || 0) - (a.impactAmt || 0));
  }

  function findDuplicates(st, since, pool) {
    const list = (pool || st.txns).filter(t => t.type !== 'transfer' && !t.billId && (!since || t.date >= since));
    const out = []; const seen = new Set(); const freq = {}; list.forEach(t => { const k = norm(t.merchant); freq[k] = (freq[k] || 0) + 1; });
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      const a = list[i], b = list[j]; if (seen.has(b.id) || a.amount !== b.amount || a.type !== b.type) continue;
      const dd = Math.abs(dayDiff(a.date, b.date)); if (dd > 1) continue;
      if (norm(a.merchant) !== norm(b.merchant)) continue;
      if (dd > 0 && freq[norm(a.merchant)] >= 6) continue;
      if (dd === 0 && freq[norm(a.merchant)] >= 6 && !(a.src || b.src)) continue;
      seen.add(b.id); out.push([a, b, dd === 0 ? 0.9 : 0.72]);
    }
    return out;
  }

  /* ================= AI Coach ================= */
  function planCandidates(st, M, excludeGoalId) {
    const c = [];
    if (M.delivery > 0) c.push({ key: 'delivery', type: 'cut', label: 'Giảm giao đồ ăn', base: M.delivery, monthly: r10k(M.delivery * 0.5), match: 'delivery', how: 'Tối đa 1 đơn/tuần' });
    const subs = activeBills(st).filter(b => b.kind === 'sub').sort((a, b) => (a.usage === 'rarely' ? -1 : 0) - (b.usage === 'rarely' ? -1 : 0) || a.amount - b.amount);
    if (subs.length) { const pick = subs.slice(0, 2); c.push({ key: 'subs', type: 'pause', label: `Tạm dừng ${pick.length} đăng ký`, base: sum(pick.map(b => b.amount)), monthly: sum(pick.map(b => b.amount)), billIds: pick.map(b => b.id), how: pick.map(b => b.name).join(', ') }); }
    const shop = M.varByCat['mua-sam'] || 0; if (shop > 0) c.push({ key: 'shop', type: 'cut', label: 'Giới hạn mua sắm', base: shop, monthly: r10k(shop * 0.4), match: 'cat:mua-sam', how: `Tối đa ${vnd(r10k(shop * 0.6))}/tháng` });
    if (M.eatOut > 0) c.push({ key: 'eatout', type: 'cut', label: 'Bớt ăn ngoài', base: M.eatOut, monthly: r10k(M.eatOut * 0.2), match: 'eatout', how: 'Bớt 1 bữa nhà hàng mỗi tuần' });
    const ent = M.varByCat['giai-tri'] || 0; if (ent > 0) c.push({ key: 'fun', type: 'cut', label: 'Giảm giải trí', base: ent, monthly: r10k(ent * 0.3), match: 'cat:giai-tri', how: 'Chọn suất chiếu sớm, ưu đãi' });
    const mv = M.varByCat['di-lai'] || 0; if (mv > 0) c.push({ key: 'move', type: 'cut', label: 'Giảm đi xe công nghệ', base: mv, monthly: r10k(mv * 0.2), match: 'cat:di-lai', how: 'Gộp chuyến, đi xe buýt khi được' });
    return c.filter(x => x.monthly > 0);
  }
  function makePlan(st, { name, target, months, goalId }) {
    const M = model(st, { followPlan: false });
    const need = c10k(target / months);
    const otherContrib = sum(M.openGoals.filter(g => g.id !== goalId).map(g => g.monthly));
    const free = M.income - M.fixed - M.loanPay - M.varAvg - otherContrib - M.unlinkedSaving;
    const margin = r10k(M.income * 0.04);
    const transfer = Math.max(0, Math.min(need, r10k(free - margin)));
    let gap = need - transfer; const items = [];
    for (const cnd of planCandidates(st, M, goalId)) { if (gap <= 0) break; const take = cnd.type === 'pause' ? cnd.monthly : Math.min(cnd.monthly, c10k(gap)); items.push({ ...cnd, monthly: take, limit: cnd.type === 'cut' ? Math.max(0, cnd.base - take) : 0 }); gap -= take; }
    const tiny = items.filter(i => i.type === 'cut' && i.monthly < 50000);
    tiny.forEach(i => { items.splice(items.indexOf(i), 1); gap += i.monthly; });
    let transfer2 = transfer; if (gap > 0 && gap <= margin) { transfer2 += c10k(gap); gap = 0; }
    const cutsTotal = sum(items.map(i => i.monthly));
    const short_ = Math.max(0, need - transfer2 - cutsTotal);
    const feasibleMonths = transfer2 + cutsTotal > 0 ? Math.ceil(target / (transfer2 + cutsTotal)) : null;
    return { id: 'p' + uid(), active: false, name: name || 'Kế hoạch tiết kiệm', goalId: goalId || null, target, months, need, transfer: transfer2, margin, otherContrib, cutsTotal, short: short_, feasibleMonths, items, start: M.T, payday: M.payday, freeSurplus: free };
  }
  function itemSpent(st, it, from, to) {
    return sum(st.txns.filter(t => isVar(t) && t.date >= from && t.date <= to && (it.match === 'delivery' ? isDelivery(t) : it.match === 'eatout' ? isEatOut(t) : it.match && it.match.startsWith('cat:') ? t.cat === it.match.slice(4) && !(it.match === 'cat:an-uong' && isDelivery(t)) : false)).map(t => t.amount));
  }
  function weeklyReview(st, plan) {
    const T = todayOf(st); const from = addDays(T, -6), pFrom = addDays(T, -13), pTo = addDays(T, -7);
    const { d } = pd(T), L = dim(pd(T).y, pd(T).m), mk = mkey(T);
    const rows = plan.items.map(it => {
      if (it.type === 'pause') { const bills = st.bills.filter(b => (it.billIds || []).includes(b.id)); const done = bills.every(b => b.paused); return { it, kind: 'pause', ok: done, status: done ? 'Đã tạm dừng' : `Chưa tạm dừng ${bills.filter(b => !b.paused).map(b => b.name).join(', ')}`, bills }; }
      const weekLimit = r1k(it.limit * 7 / 30.4);
      const w = itemSpent(st, it, from, T), pw = itemSpent(st, it, pFrom, pTo);
      const monthSpent = itemSpent(st, it, mk + '-01', T);
      const weeksLeft = Math.max(1, (L - d) / 7);
      const newLimit = Math.max(0, r1k((it.limit - monthSpent) / weeksLeft)); const pauseRest = newLimit === 0;
      const ok = w <= weekLimit;
      return { it, kind: 'cut', ok, pauseRest, week: w, prevWeek: pw, weekLimit, monthSpent, monthLimit: it.limit, newLimit, over: Math.max(0, w - weekLimit), status: ok ? `Trong giới hạn (${vnd(w)} / ${vnd(weekLimit)})` : `Vượt ${vnd(w - weekLimit)}` };
    });
    const startMk = mkey(plan.start);
    const transferred = sum(st.txns.filter(t => t.type === 'expense' && t.cat === 'tiet-kiem' && mkey(t.date) === mk && (plan.goalId ? (t.goalId === plan.goalId || norm(t.merchant).includes(norm(plan.goalName || ''))) : true) && t.date >= plan.start).map(t => t.amount));
    const transferOk = transferred >= plan.transfer;
    const overTotal = sum(rows.filter(r => r.kind === 'cut').map(r => r.over));
    const onTrack = overTotal === 0 && transferOk && rows.every(r => r.ok);
    const adjust = rows.filter(r => r.kind === 'cut' && !r.ok).map(r => r.pauseRest ? `${r.it.label}: đã dùng hết hạn mức tháng (${vnd(r.monthSpent)} / ${vnd(r.monthLimit)}). Tạm ngưng đến hết tháng.` : `${r.it.label}: tuần tới giữ dưới ${vnd(r.newLimit)} để bù phần vượt.`);
    rows.filter(r => r.kind === 'pause' && !r.ok).forEach(r => adjust.push(`Tạm dừng ${r.bills.filter(b => !b.paused).map(b => b.name).join(', ')} trước ngày gia hạn.`));
    const elapsedM = mDiff(startMk, mk) + 1;
    return { from, to: T, rows, transferred, transferOk, overTotal, onTrack, adjust, elapsedM, score: rows.length ? rows.filter(r => r.ok).length / rows.length : 1 };
  }

  /* ================= Nhập liệu: thông báo, sao kê, CSV ================= */
  function maskSensitive(text) {
    let n = 0;
    const out = String(text).replace(/\b(?:\d{4}[ -]){3}\d{4}\b/g, m => { n++; return '•••• ' + m.slice(-4); })
      .replace(/(?<![\d.,])\d{8,19}(?![\d.,])/g, m => { n++; return '••••' + m.slice(-4); });
    return { text: out, count: n };
  }
  const MONEY_RE = /([-+−]?\s?\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{1,2})?|[-+−]\s?\d{4,})(?:\s?(?:vnd|vnđ|đ|d)\b)?/gi;
  const toNum = s => { s = String(s).replace(/\s/g, '').replace('−', '-'); const sign = /^-/.test(s) ? -1 : 1; s = s.replace(/^[+-]/, ''); const parts = s.split(/[.,]/); if (parts.length > 1 && parts[parts.length - 1].length <= 2) parts.pop(); return sign * Number(parts.join('')); };
  const DATE_RE = /\b(\d{1,2})[\/.-](\d{1,2})(?:[\/.-](\d{2,4}))?\b/;
  function dateFrom(s, T) { const m = String(s).match(DATE_RE); if (!m) return null; const d = +m[1], mo = +m[2]; if (mo < 1 || mo > 12 || d < 1 || d > 31) return null; let y = m[3] ? +m[3] : pd(T).y; if (y < 100) y += 2000; let dt = ymd(y, mo, d); if (!m[3] && dt > T) dt = ymd(y - 1, mo, d); return dt; }
  const TRANSFER_KW = [['vi momo|nap tien momo|nap momo|momo topup', 'ewallet'], ['rut tien|atm|rut tm', 'cash'], ['thanh toan the|tt the tin dung|tra no the', 'credit']];
  function classify(desc, amountSigned, st) {
    const n = norm(desc); let merchant = null;
    const MER = [['GrabFood', 'grabfood|grab food'], ['ShopeeFood', 'shopeefood|shopee food'], ['Grab', 'grab'], ['Be', 'be group|bebike|be bike'], ['Xanh SM', 'xanh sm|gsm'], ['Shopee', 'shopee'], ['Lazada', 'lazada'], ['Tiki', 'tiki'], ['Highlands Coffee', 'highlands'], ['Phúc Long', 'phuc long'], ['Starbucks', 'starbucks'], ['The Coffee House', 'coffee house'], ['WinMart', 'winmart|vinmart|wincommerce'], ['Bách Hóa Xanh', 'bach hoa xanh|bhx'], ['Circle K', 'circle k|circlek'], ['CGV', 'cgv'], ['Netflix', 'netflix'], ['Spotify', 'spotify'], ['YouTube Premium', 'youtube'], ['Apple', 'apple.com|itunes'], ['Google', 'google'], ['EVN điện', 'evn|dien luc|tien dien'], ['Nước sạch', 'nuoc sach|cap nuoc|tien nuoc'], ['Internet FPT', 'fpt telecom|fpt'], ['Viettel', 'viettel'], ['Petrolimex', 'petrolimex|xang dau'], ['Pharmacity', 'pharmacity'], ['Long Châu', 'long chau'], ['KFC', 'kfc'], ['Lotteria', 'lotteria'], ['Điện Máy Xanh', 'dien may xanh|dmx'], ['Thế Giới Di Động', 'the gioi di dong|tgdd'], ['Uniqlo', 'uniqlo']];
    for (const [nm, k] of MER) if (new RegExp('(^|[^a-z])(' + k + ')').test(n)) { merchant = nm; break; }
    let type = amountSigned < 0 ? 'expense' : 'income', cat = null, to = null, reasons = [], conf = 0.95;
    const MERCAT = { 'GrabFood': 'an-uong', 'ShopeeFood': 'an-uong', 'Grab': 'di-lai', 'Be': 'di-lai', 'Xanh SM': 'di-lai', 'Shopee': 'mua-sam', 'Lazada': 'mua-sam', 'Tiki': 'mua-sam', 'Highlands Coffee': 'an-uong', 'Phúc Long': 'an-uong', 'Starbucks': 'an-uong', 'The Coffee House': 'an-uong', 'WinMart': 'an-uong', 'Bách Hóa Xanh': 'an-uong', 'Circle K': 'an-uong', 'CGV': 'giai-tri', 'Netflix': 'giai-tri', 'Spotify': 'giai-tri', 'YouTube Premium': 'giai-tri', 'Apple': 'giai-tri', 'Google': 'giai-tri', 'EVN điện': 'nha-o', 'Nước sạch': 'nha-o', 'Internet FPT': 'nha-o', 'Viettel': 'nha-o', 'Petrolimex': 'di-lai', 'Pharmacity': 'suc-khoe', 'Long Châu': 'suc-khoe', 'KFC': 'an-uong', 'Lotteria': 'an-uong', 'Điện Máy Xanh': 'mua-sam', 'Thế Giới Di Động': 'mua-sam', 'Uniqlo': 'mua-sam' };
    if (amountSigned < 0 && /tien nha|thue nha|tien phong|chu nha/.test(n)) merchant = 'Tiền nhà';
    if (amountSigned < 0 && /tra gop|home credit|fe credit|hd saison|mcredit/.test(n)) { const L = (n.match(/home credit|fe credit|hd saison|mcredit/) || [''])[0]; merchant = 'Trả góp' + (L ? ' ' + L.replace(/(^|\s)\S/g, x => x.toUpperCase()).replace('Hd', 'HD').replace('Fe', 'FE') : ''); }
    for (const [k, accType] of TRANSFER_KW) if (new RegExp(k).test(n)) { const acc = st.accounts.find(a => a.type === accType); if (acc && amountSigned < 0) { type = 'transfer'; to = acc.id; } else if (accType === 'cash' && amountSigned < 0) { cat = 'khac'; merchant = 'Rút tiền mặt'; reasons.push('Rút tiền mặt, chưa rõ chi vào việc gì'); conf = 0.55; } }
    if (type === 'income') { cat = /luong|salary|payroll/.test(n) ? 'luong' : /thuong|bonus/.test(n) ? 'thuong' : 'thu-khac'; if (!merchant) merchant = cat === 'luong' ? 'Lương' : cleanDesc(desc); if (cat === 'thu-khac') { reasons.push('Khoản nhận chưa rõ nguồn'); conf = 0.7; } }
    else if (type === 'expense' && !cat) {
      const key = merchant ? norm(merchant) : null;
      if (key && st.rules[key]) cat = st.rules[key];
      else if (merchant && MERCAT[merchant]) cat = MERCAT[merchant];
      else if (merchant === 'Tiền nhà') cat = 'nha-o';
      else if (merchant && merchant.startsWith('Trả góp')) cat = 'no';
      else if (merchant === 'Grab' && !/food|giao/.test(n)) { cat = 'di-lai'; }
      else {
        const p = parseOne(desc, { ...st, accounts: st.accounts.length ? st.accounts : [{ id: 'x', type: 'bank' }] });
        cat = p.cat && p.type === 'expense' ? p.cat : 'khac';
        if (merchant === 'EVN điện' || merchant === 'Nước sạch' || merchant === 'Internet FPT' || merchant === 'Viettel') cat = 'nha-o';
        if (/tien nha|thue nha|tien phong|chu nha/.test(n)) cat = 'nha-o';
        if (/hoc phi|truong/.test(n)) cat = 'hoc-tap';
        if (/tra gop|home credit|fe credit|hd saison/.test(n)) cat = 'no';
      }
      if (!merchant) { merchant = cleanDesc(desc); if (cat === 'khac') { reasons.push('Chưa nhận ra nội dung chi'); conf = 0.5; } else { conf = 0.8; } }
      if (/chuyen tien|ck den|chuyen khoan|ft\d/.test(n) && cat === 'khac') { reasons.push('Chuyển khoản cho người khác, chưa rõ mục đích'); conf = 0.55; }
    }
    if (type === 'transfer') { merchant = merchant || cleanDesc(desc); }
    return { type, cat: type === 'transfer' ? null : cat, merchant, to, reasons, conf };
  }
  function cleanDesc(desc) {
    let s = String(desc).replace(/\b(?:\d{4}[ -]){3}\d{4}\b/g, '').replace(/\d{6,}/g, '').replace(/•+\d*/g, '').replace(/\b(ft|ref|ma gd|mgd|trace|ib|mb|qr|so tk|tk)\b[:\s]*\S*/gi, '').replace(/[*#_|]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (!s) return 'Giao dịch'; s = s.length > 42 ? s.slice(0, 42).trim() + '…' : s;
    return s === s.toUpperCase() ? s.toLowerCase().replace(/(^|\s)\S/g, x => x.toUpperCase()) : s;
  }
  function parseNotification(text, st) {
    const T = todayOf(st); const out = [];
    const chunks = String(text).split(/\n\s*\n|(?=\b(?:VCB|TCB|MB|ACB|BIDV|VPB|TPB|Agribank|Vietinbank|MoMo|Techcombank|Vietcombank)\b[:\s])/i).map(s => s.trim()).filter(Boolean);
    for (const ch of chunks) {
      const n = norm(ch); if (!/(vnd|vnđ|đ|so du|sd|gd|giao dich|\+|-)/i.test(ch)) continue;
      const monies = [...ch.matchAll(MONEY_RE)].map(m => ({ raw: m[0], v: toNum(m[1]), idx: m.index }));
      if (!monies.length) continue;
      const sdIdx = (() => { const m = n.match(/(so du|sd|balance)[:\s]/); return m ? m.index : -1; })();
      let main = monies.find(m => /^[-+−]/.test(m.raw.trim())) || monies.find(m => sdIdx < 0 || m.idx < sdIdx) || monies[0];
      let signed = main.v;
      if (!/^[-+−]/.test(main.raw.trim())) signed = /(giam|tru|chi|chuyen di|thanh toan|debit|-)/.test(n.slice(Math.max(0, main.idx - 25), main.idx + 5)) ? -Math.abs(main.v) : /(tang|nhan|credit|\+)/.test(n) ? Math.abs(main.v) : -Math.abs(main.v);
      const date = dateFrom(ch, T) || T;
      const ndm = ch.match(/\b(?:ND GD|ND|N\.D|Nội dung|Noi dung|Mô tả|Description)\b[:\s]+(.+)/i);
      const desc = ndm ? ndm[1] : ch.replace(MONEY_RE, '').replace(DATE_RE, '');
      const c = classify(desc, signed, st);
      out.push({ date, amount: Math.abs(signed), signed, desc: maskSensitive(desc).text, src: 'thông báo', ...c });
    }
    return out;
  }
  function looksLikeNotification(text) { return /(so du|sd[:\s]|sodu|\bgd\b|giao dich|tk\s*\d|vnd)/i.test(norm(text)) && MONEY_RE.test(text) && (MONEY_RE.lastIndex = 0, true); }

  // dòng văn bản từ PDF/TXT: [{text, items:[{x, str}]}]
  function parseStatementLines(lines, st) {
    const T = todayOf(st); const rows = []; let opening = null, header = null, prevBal = null;
    for (const ln of lines) {
      const n = norm(ln.text);
      if (opening == null) { const m = n.match(/(so du dau ky|so du dau|opening balance)[^\d-]*([-\d.,]+)/); if (m) { opening = toNum(m[2]); continue; } }
      if (!header && /ngay/.test(n) && /(no|co|debit|credit|so tien)/.test(n) && ln.items) {
        header = {}; ln.items.forEach(it => { const t = norm(it.str); if (/ghi no|no\b|debit|rut|chi\b/.test(t)) header.debit = it.x; else if (/ghi co|co\b|credit|nap|thu\b/.test(t)) header.credit = it.x; else if (/so du|balance/.test(t)) header.bal = it.x; else if (/so tien|amount/.test(t)) header.amt = it.x; });
        if (!('debit' in header) && !('amt' in header)) header = null; continue;
      }
      const date = dateFrom(ln.text, T); if (!date || !/^\s*\d{1,2}[\/.-]\d{1,2}/.test(ln.text)) continue;
      let debit = 0, credit = 0, bal = null, descParts = [];
      if (header && ln.items) {
        ln.items.forEach(it => {
          const s = it.str.trim(); if (!s) return;
          if (DATE_RE.test(s) && /^\d{1,2}[\/.-]\d{1,2}([\/.-]\d{2,4})?$/.test(s)) return;
          const isMoney = /^[-+−]?\s?\d{1,3}([.,]\d{3})+([.,]\d{1,2})?$/.test(s) || /^[-+−]?\d{4,}$/.test(s);
          if (isMoney) { const cols = Object.entries(header).sort((a, b) => Math.abs(a[1] - it.x) - Math.abs(b[1] - it.x)); const col = cols[0][0]; const v = toNum(s); if (col === 'debit') debit = Math.abs(v); else if (col === 'credit') credit = Math.abs(v); else if (col === 'bal') bal = v; else if (col === 'amt') { if (v < 0) debit = -v; else credit = v; } }
          else descParts.push(s);
        });
      } else {
        const monies = [...ln.text.matchAll(MONEY_RE)].map(m => toNum(m[1]));
        descParts = [ln.text.replace(MONEY_RE, ' ').replace(DATE_RE, ' ')];
        if (monies.length >= 2) { bal = monies[monies.length - 1]; const a = monies[0]; if (a < 0) debit = -a; else if (prevBal != null) { if (bal < prevBal) debit = Math.abs(a); else credit = Math.abs(a); } else debit = Math.abs(a); }
        else if (monies.length === 1) { const a = monies[0]; if (a < 0) debit = -a; else if (/\+/.test(ln.text)) credit = a; else debit = a; }
      }
      if (!debit && !credit) continue;
      const signed = credit ? credit : -debit;
      if (opening == null && bal != null && rows.length === 0) opening = bal - signed;
      if (bal != null) prevBal = bal;
      const desc = maskSensitive(descParts.join(' ').replace(/\s+/g, ' ').trim()).text;
      rows.push({ date, amount: Math.abs(signed), signed, desc, bal, src: 'sao kê', ...classify(desc, signed, st) });
    }
    return { rows, opening };
  }
  function parseCSV(text) {
    const delim = (text.split('\n')[0].match(/;/g) || []).length > (text.split('\n')[0].match(/,/g) || []).length ? ';' : (text.indexOf('\t') > -1 && text.split('\n')[0].includes('\t') ? '\t' : ',');
    const rows = []; let row = [], cell = '', q = false;
    for (let i = 0; i < text.length; i++) { const ch = text[i];
      if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; }
      else if (ch === '"') q = true; else if (ch === delim) { row.push(cell); cell = ''; } else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; } else cell += ch; }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    return rows.filter(r => r.some(c => String(c).trim()));
  }
  function tableToRows(table, st) {
    const T = todayOf(st); let opening = null;
    const hi = table.findIndex(r => r.some(c => /ngay|date/.test(norm(c))) && r.some(c => /(so tien|amount|no|co|debit|credit|rut|nap)/.test(norm(c))));
    const H = hi >= 0 ? table[hi].map(c => norm(c)) : [];
    const find = re => H.findIndex(h => re.test(h));
    let cDate = find(/ngay|date/), cDesc = find(/noi dung|mo ta|dien giai|chi tiet|description|ghi chu|narrative/), cDeb = find(/ghi no|^no$|debit|rut|so tien chi|tien ra|ps no/), cCre = find(/ghi co|^co$|credit|nap|so tien thu|tien vao|ps co/), cAmt = find(/so tien|amount/), cBal = find(/so du|balance/);
    if (cDeb === cAmt) cAmt = -1;
    const body = table.slice(hi + 1);
    table.slice(0, Math.max(0, hi)).concat(body).forEach(r => { const t = norm(r.join(' ')); const m = t.match(/so du dau ky[^\d-]*([-\d.,]+)/); if (m && opening == null) opening = toNum(m[1]); });
    if (cDate < 0) cDate = 0;
    const rows = [];
    body.forEach(r => {
      const date = dateFrom(String(r[cDate] || ''), T) || (typeof r[cDate] === 'number' ? excelDate(r[cDate]) : null); if (!date) return;
      const num = c => c < 0 || r[c] == null || r[c] === '' ? 0 : (typeof r[c] === 'number' ? r[c] : toNum(String(r[c]).replace(/[^\d.,+−-]/g, '')) || 0);
      let signed = 0;
      if (cDeb >= 0 || cCre >= 0) { const d = Math.abs(num(cDeb)), c = Math.abs(num(cCre)); signed = c ? c : -d; }
      else if (cAmt >= 0) signed = num(cAmt);
      if (!signed) return;
      const desc = maskSensitive(cDesc >= 0 ? String(r[cDesc] || '') : r.filter((x, i) => ![cDate, cDeb, cCre, cAmt, cBal].includes(i)).join(' ')).text;
      const bal = cBal >= 0 ? num(cBal) : null;
      if (opening == null && bal != null && !rows.length) opening = bal - signed;
      rows.push({ date, amount: Math.abs(signed), signed, desc, bal, src: 'file', ...classify(desc, signed, st) });
    });
    return { rows, opening, mapping: { date: H[cDate], desc: H[cDesc], debit: H[cDeb], credit: H[cCre], amount: H[cAmt] } };
  }
  function excelDate(n) { const t = new Date(Date.UTC(1899, 11, 30) + n * 864e5); return ymd(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()); }

  // gắn cờ trùng & chưa chắc chắn
  function reviewImport(st, rows, accountId) {
    const existing = st.txns;
    const drafts = rows.map((r, i) => ({ id: 'i' + uid(), sel: true, date: r.date, type: r.type, amount: r.amount, cat: r.cat, merchant: r.merchant, account: accountId, to: r.to || null, desc: r.desc, src: r.src, conf: r.conf ?? 0.9, reasons: r.reasons ? [...r.reasons] : [], bal: r.bal }));
    drafts.forEach((d, i) => {
      const dupE = existing.find(t => t.type === d.type && t.amount === d.amount && Math.abs(dayDiff(t.date, d.date)) <= 1 && (norm(t.merchant) === norm(d.merchant) || !t.merchant || d.conf < 0.8 || t.billId));
      const dupB = drafts.slice(0, i).find(x => x.date === d.date && x.amount === d.amount && x.desc === d.desc && x.type === d.type);
      if (dupE) { d.dup = { with: dupE.id, label: `${dupE.merchant} ${dShort(dupE.date)}`, conf: dupE.date === d.date ? 0.9 : 0.72 }; d.sel = false; }
      else if (dupB) { d.dup = { with: dupB.id, label: 'dòng giống hệt trong file', conf: 0.85 }; d.sel = false; }
    });
    return drafts;
  }

  /* ================= Sao kê mẫu (ngân hàng giả lập) ================= */
  function sampleStatement(endDate) {
    let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const R = (a, b, s = 1000) => Math.round((a + rnd() * (b - a)) / s) * s;
    const end = endDate; const start = shiftM(mkey(end), -3) + '-01';
    const rows = []; let bal = 2140000; const opening = bal;
    const add = (date, desc, signed) => { bal += signed; rows.push({ date, desc, signed, bal }); };
    for (let day = start; day <= end; day = addDays(day, 1)) {
      const { d, m } = pd(day); const w = new Date(day + 'T00:00:00Z').getUTCDay();
      if (d === 5) add(day, `CT LUONG THANG ${m === 1 ? 12 : m - 1} CONG TY TNHH MINH AN`, 18500000);
      if (d === 6) add(day, 'CHUYEN TIEN NHA THANG ' + m + ' CHO CHU NHA', -5500000);
      if (d === 8) add(day, 'FPT TELECOM THANH TOAN INTERNET', -220000);
      if (d === 12) add(day, 'NETFLIX.COM 4111 2222 3333 4444', -260000);
      if (d === 14) add(day, 'EVN HANOI TIEN DIEN KY ' + m, -R(720000, 860000, 1000));
      if (d === 7 || d === 21) add(day, 'RUT TIEN ATM 0011004567890', -2000000);
      if (d === 16) add(day, 'TRA GOP HOME CREDIT HD 3392011', -1100000);
      if (rnd() < 0.42) add(day, 'GRAB* RIDE ' + (100000 + Math.floor(rnd() * 899999)), -R(28000, 85000));
      if (rnd() < 0.16) add(day, 'GRABFOOD ORDER ' + (100000 + Math.floor(rnd() * 899999)), -R(95000, 190000));
      if (rnd() < 0.2) add(day, 'HIGHLANDS COFFEE QR', -R(45000, 65000));
      if (w === 6 || w === 0) { if (rnd() < 0.5) add(day, 'WINMART ' + ['TRAN DUY HUNG', 'KIM MA', 'LANG HA'][Math.floor(rnd() * 3)], -R(180000, 420000)); }
      if (rnd() < 0.09) add(day, 'SHOPEE PAY ' + (1000000 + Math.floor(rnd() * 8999999)), -R(150000, 650000));
      if (rnd() < 0.05) add(day, 'CGV CINEMAS', -R(160000, 240000));
      if (rnd() < 0.04) add(day, 'PHARMACITY', -R(60000, 210000));
      if (rnd() < 0.03) add(day, 'CK DEN NGUYEN THI MAI FT26' + Math.floor(rnd() * 1e8), -R(200000, 800000, 50000));
      if (d === 19 && rnd() < 0.7) add(day, 'NHAN TIEN TU TRAN VAN BINH HOAN TIEN AN', R(150000, 400000, 10000));
    }
    return { rows, opening, closing: bal, start, end };
  }
  function bootstrapFromRows(rows, opening, base) {
    const st = FT.emptyState(); st.v = 2; st.profile = { ...(base && base.profile), name: base && base.profile && !base.sample && !base.fromStatement ? base.profile.name : '' };
    st.settings = { ...(base && base.settings || {}), hide: false };
    st.accounts = [{ id: 'bank', name: 'Tài khoản ngân hàng', type: 'bank', opening: opening || 0 }];
    const last = rows.reduce((a, r) => r.date > a ? r.date : a, '0000');
    st.today = last; st.fromStatement = true;
    rows.forEach(r => { if (!r.sel && r.sel !== undefined) return; st.txns.push({ id: 's' + uid(), date: r.date, type: r.type === 'transfer' ? 'expense' : r.type, amount: r.amount, cat: r.type === 'transfer' ? 'khac' : r.cat, merchant: r.merchant, account: 'bank', src: 'sao kê' }); });
    // phát hiện khoản định kỳ (cả thu và chi)
    const groups = {}; st.txns.forEach(t => { const k = t.type + '|' + norm(t.merchant); (groups[k] = groups[k] || []).push(t); });
    Object.values(groups).forEach(g => {
      const ms = new Set(g.map(t => mkey(t.date))); if (ms.size < 3 || g.length > ms.size + 1) return;
      const amts = g.map(t => t.amount); const med = median(amts); if (!amts.every(a => Math.abs(a - med) <= med * 0.2)) return;
      const t0 = g[0]; const days = g.map(t => pd(t.date).d); const day = Math.round(median(days)); if (days.some(x => Math.abs(x - day) > 4)) return;
      const kind = t0.type === 'income' ? 'income' : t0.cat === 'no' ? 'loan' : (t0.cat === 'giai-tri' ? 'sub' : 'bill');
      const id = 'b' + uid();
      st.bills.push({ id, name: t0.type === 'income' ? 'Lương' : t0.merchant, amount: r10k(t0.type === 'income' ? med : Math.max(...amts)), day, kind, cat: t0.type === 'income' ? 'luong' : t0.cat, account: 'bank', ...(kind === 'loan' ? { monthsLeft: 6 } : {}) });
      g.forEach(t => t.billId = id);
    });
    const inc = st.bills.find(b => b.kind === 'income'); if (inc) st.profile.payday = inc.day;
    // ngân sách gợi ý
    const tmp = { ...st }; const M = model(tmp);
    Object.entries(M.varByCat).forEach(([c, v]) => { if (v > 150000 && c !== 'khac') st.budgets[c] = r10k(Math.ceil(v * 0.95 / 100000) * 100000); });
    st.goals = [{ id: 'g' + uid(), name: 'Quỹ khẩn cấp', target: r10k(M.burn * 3 || 20000000), saved: 0, deadline: shiftM(mkey(last), 12) + '-28', monthly: 0, emergency: true }];
    return st;
  }

  /* ================= Dữ liệu mẫu v2 ================= */
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function sampleState2(today, P = {}) {
    const SAL = P.salary || 22500000, OPEN = P.open ?? 4200000;
    const rnd = mulberry32(20261004);
    const R = (a, b, step = 1000) => Math.round((a + rnd() * (b - a)) / step) * step;
    const pick = a => a[Math.floor(rnd() * a.length)];
    const accounts = [
      { id: 'cash', name: 'Tiền mặt', type: 'cash', opening: 1200000 },
      { id: 'vcb', name: 'Vietcombank', type: 'bank', opening: OPEN },
      { id: 'momo', name: 'Ví MoMo', type: 'ewallet', opening: 300000 },
      { id: 'card', name: 'Thẻ tín dụng TPBank', type: 'credit', opening: 0 },
    ];
    const bills = [
      { id: 'b-hoc', name: 'Học phí tiếng Anh', amount: 1500000, day: 3, kind: 'bill', cat: 'hoc-tap', account: 'vcb' },
      { id: 'b-luong', name: 'Lương công ty', amount: SAL, day: 5, kind: 'income', cat: 'luong', account: 'vcb' },
      { id: 'b-tk', name: 'Chuyển quỹ khẩn cấp', amount: 2000000, day: 6, kind: 'saving', cat: 'tiet-kiem', account: 'vcb', goalId: 'g1' },
      { id: 'b-nha', name: 'Tiền nhà', amount: 6000000, day: 7, kind: 'bill', cat: 'nha-o', account: 'vcb' },
      { id: 'b-net', name: 'Internet FPT', amount: 250000, day: 10, kind: 'bill', cat: 'nha-o', account: 'vcb' },
      { id: 'b-netflix', name: 'Netflix', amount: 260000, day: 12, kind: 'sub', cat: 'giai-tri', account: 'card', usage: 'often' },
      { id: 'b-dien', name: 'Điện nước', amount: 900000, day: 15, kind: 'bill', cat: 'nha-o', account: 'vcb' },
      { id: 'b-spotify', name: 'Spotify', amount: 59000, day: 20, kind: 'sub', cat: 'giai-tri', account: 'card', usage: 'rarely' },
      { id: 'b-icloud', name: 'iCloud 200GB', amount: 69000, day: 22, kind: 'sub', cat: 'giai-tri', account: 'card' },
      { id: 'b-tragop', name: 'Trả góp điện thoại', amount: 1250000, day: 25, kind: 'loan', cat: 'no', account: 'vcb', monthsLeft: 4 },
    ];
    const txns = []; const bal = {}; accounts.forEach(a => bal[a.id] = a.opening);
    const add = t => { t.id = 't' + (txns.length + 1); txns.push(t); if (t.type === 'expense') bal[t.account] -= t.amount; else if (t.type === 'income') bal[t.account] += t.amount; else { bal[t.account] -= t.amount; bal[t.to] += t.amount; } };
    const curM = mkey(today); const start = shiftM(curM, -3) + '-01';
    const SHOP = { [shiftM(curM, -3)]: [[9, 320000, 'Shopee'], [24, 280000, 'Lazada']], [shiftM(curM, -2)]: [[4, 450000, 'Shopee'], [17, 390000, 'Uniqlo'], [27, 260000, 'Shopee']], [shiftM(curM, -1)]: [[3, 520000, 'Shopee'], [12, 610000, 'Lazada'], [20, 340000, 'Shopee'], [28, 330000, 'Shopee']], [curM]: [[14, 2450000, 'Shopee', 'Tai nghe Sony'], [15, 380000, 'Shopee'], [16, 245000, 'Lazada'], [17, 410000, 'Shopee']] };
    let lastCard = 0;
    for (let day = start; day <= today; day = addDays(day, 1)) {
      const { d } = pd(day); const w = new Date(day + 'T00:00:00Z').getUTCDay(); const k = mkey(day); const cur = k === curM; const weekday = w >= 1 && w <= 5;
      if (d === 1) lastCard = bal.card;
      bills.forEach(b => { if (b.day !== d) return;
        if (b.id === 'b-icloud' && k < shiftM(curM, -2)) return;
        let amt = b.amount; if (b.id === 'b-dien') amt = cur ? 1380000 : R(840000, 960000, 1000);
        if (b.kind === 'loan' && day > today) return;
        add({ date: day, type: b.kind === 'income' ? 'income' : 'expense', amount: amt, cat: b.cat, merchant: b.name, account: b.account, billId: b.id, ...(b.goalId ? { goalId: b.goalId } : {}) }); });
      if (d === 2) add({ date: day, type: 'expense', amount: 450000, cat: 'suc-khoe', merchant: 'California Fitness', account: 'vcb' });
      if (d === 15 && lastCard < 0) add({ date: day, type: 'transfer', amount: -lastCard, account: 'vcb', to: 'card', merchant: 'Thanh toán thẻ tín dụng' });
      if (d === 6 || d === 20) add({ date: day, type: 'transfer', amount: 1500000, account: 'vcb', to: 'cash', merchant: 'Rút tiền ATM' });
      if (d === 8 || d === 22) add({ date: day, type: 'transfer', amount: 500000, account: 'vcb', to: 'momo', merchant: 'Nạp ví MoMo' });
      if (weekday) add({ date: day, type: 'expense', amount: R(30000, 50000, 5000), cat: 'an-uong', merchant: pick(['Cơm văn phòng', 'Phở Thìn', 'Bún chả Hương Liên', 'Bánh mì Phố Huế', 'Cơm văn phòng']), account: rnd() < .6 ? 'cash' : 'momo' });
      if (rnd() < .2) { const c = pick([['Highlands Coffee', 45000, 59000], ['Phúc Long', 55000, 65000], ['The Coffee House', 45000, 55000]]); add({ date: day, type: 'expense', amount: R(c[1], c[2]), cat: 'an-uong', merchant: c[0], account: rnd() < .5 ? 'momo' : 'card' }); }
      if (rnd() < .3) add({ date: day, type: 'expense', amount: R(32000, 90000), cat: 'di-lai', merchant: 'Grab', account: 'card' });
      const lastWeek = cur && day >= addDays(today, -6);
      if (!lastWeek && rnd() < .07) add({ date: day, type: 'expense', amount: R(100000, 175000), cat: 'an-uong', merchant: pick(['GrabFood', 'ShopeeFood']), account: 'card' });
      if (!weekday && rnd() < .28) add({ date: day, type: 'expense', amount: R(180000, 360000, 10000), cat: 'an-uong', merchant: pick(['Lẩu Phan', 'Nhà hàng Ngon', 'Nướng Gogi', "Pizza 4P's"]), account: 'card' });
      if (!weekday && rnd() < .2) add({ date: day, type: 'expense', amount: R(180000, 250000, 10000), cat: 'giai-tri', merchant: 'CGV', account: 'card' });
      if (d % 7 === 3) add({ date: day, type: 'expense', amount: R(150000, 300000), cat: 'an-uong', merchant: pick(['WinMart', 'Bách Hóa Xanh']), account: rnd() < .5 ? 'cash' : 'card' });
      if (d % 6 === 1) add({ date: day, type: 'expense', amount: R(80000, 100000), cat: 'di-lai', merchant: 'Petrolimex', account: 'cash' });
      (SHOP[k] || []).forEach(([sd, amt, mer, note]) => { if (sd === d) add({ date: day, type: 'expense', amount: amt, cat: 'mua-sam', merchant: mer, account: 'card', ...(note ? { note } : {}) }); });
      if (rnd() < .03) add({ date: day, type: 'expense', amount: R(60000, 220000), cat: 'suc-khoe', merchant: pick(['Pharmacity', 'Long Châu']), account: 'cash' });
      if (rnd() < .025) add({ date: day, type: 'expense', amount: R(60000, 150000, 10000), cat: 'khac', merchant: pick(['Cắt tóc', 'Quà sinh nhật', 'Gửi xe tháng']), account: 'cash' });
      if (cur && d === 11) add({ date: day, type: 'expense', amount: 1150000, cat: 'an-uong', merchant: 'Nhà hàng Ngon', note: 'Sinh nhật bạn', account: 'card' });
      if (cur && d === 6) add({ date: day, type: 'expense', amount: 2500000, cat: 'tiet-kiem', merchant: 'Góp: Mua laptop', account: 'vcb', goalId: 'g3' });
      if (lastWeek) { const off = dayDiff(addDays(today, -6), day); const DEL = { 0: [165000, 'GrabFood'], 2: [142000, 'ShopeeFood'], 4: [156000, 'GrabFood'], 5: [189000, 'ShopeeFood'] }; if (DEL[off]) { add({ date: day, type: 'expense', amount: DEL[off][0], cat: 'an-uong', merchant: DEL[off][1], account: 'card' }); if (off === 4) add({ date: day, type: 'expense', amount: 156000, cat: 'an-uong', merchant: 'GrabFood', account: 'card', src: 'ảnh chụp màn hình' }); } }
      if (k === shiftM(curM, -2) && d === 8) add({ date: day, type: 'expense', amount: 6000000, cat: 'tiet-kiem', merchant: 'Gửi tiết kiệm kỳ hạn 6 tháng', account: 'vcb', goalId: 'g1' });
      if (k === shiftM(curM, -1) && d === 13) add({ date: day, type: 'expense', amount: 3000000, cat: 'khac', merchant: 'Mừng cưới em họ', account: 'vcb' });
      if (k === shiftM(curM, -3) && d === 22) add({ date: day, type: 'expense', amount: 2200000, cat: 'di-lai', merchant: 'Sửa xe máy', account: 'vcb' });
      if (k === shiftM(curM, -2) && d === 18) add({ date: day, type: 'income', amount: 1800000, cat: 'thu-khac', merchant: 'Dịch thuật tự do', account: 'vcb' });
    }
    const st = {
      v: 2, sample: true, today, profile: { name: 'Hà', payday: 5 }, accounts, bills, txns,
      budgets: { 'an-uong': 3500000, 'di-lai': 1000000, 'mua-sam': 1500000, 'giai-tri': 700000, 'suc-khoe': 800000, 'tiet-kiem': 4500000 },
      goals: [
        { id: 'g1', name: 'Quỹ khẩn cấp', target: 30000000, saved: 10000000, deadline: shiftM(curM, 12) + '-28', monthly: 2000000, emergency: true },
        { id: 'g2', name: 'Du lịch Đà Nẵng', target: 8000000, saved: 2500000, deadline: shiftM(curM, 6) + '-28', monthly: 1000000 },
        { id: 'g3', name: 'Mua laptop', target: 20000000, saved: 5000000, deadline: shiftM(curM, 6) + '-28', monthly: 2500000 },
      ],
      rules: { 'highlands coffee': 'an-uong' }, settings: { hide: false, pin: null, buffer: 500000 }, plan: null, aiLog: [],
    };
    const plan = makePlan(st, { name: 'Mua laptop', target: 15000000, months: 6, goalId: 'g3' });
    plan.active = true; plan.start = curM + '-06'; plan.goalName = 'Mua laptop';
    st.plan = plan;
    return st;
  }

  /* ================= Chatbot: định tuyến cục bộ ================= */
  function spendingBreakdown(st, period, query) {
    const T = todayOf(st); let from, to = T, label;
    if (period === 'last_month') { const k = shiftM(mkey(T), -1); from = k + '-01'; to = k + '-' + pad(dim(...k.split('-').map(Number))); label = mFull(k); }
    else if (period === 'last_7_days') { from = addDays(T, -6); label = '7 ngày qua'; }
    else if (period === 'last_30_days') { from = addDays(T, -29); label = '30 ngày qua'; }
    else { from = mkey(T) + '-01'; label = mFull(mkey(T)) + ' (đến hôm nay)'; }
    let tx = st.txns.filter(t => t.date >= from && t.date <= to && isSpend(t));
    if (query) { const q = norm(query); tx = tx.filter(t => norm(t.merchant + ' ' + (t.note || '') + ' ' + catOf(t.cat).name).includes(q) || (q.includes('giao do an') && isDelivery(t))); }
    const byCat = {}; tx.forEach(t => byCat[catOf(t.cat).name] = (byCat[catOf(t.cat).name] || 0) + t.amount);
    const byMer = {}; tx.forEach(t => byMer[t.merchant] = (byMer[t.merchant] || 0) + t.amount);
    return { label, from, to, total: sum(tx.map(t => t.amount)), count: tx.length, byCat: Object.entries(byCat).sort((a, b) => b[1] - a[1]), top: Object.entries(byMer).sort((a, b) => b[1] - a[1]).slice(0, 5) };
  }
  function overview(st) {
    const M = model(st), S = safeToSpend(st, M), H = health(st), A = alerts2(st);
    return { hom_nay: M.T, duoc_tieu_hom_nay: S.safe, da_tieu_hom_nay: S.spentToday, ngay_luong_tiep: S.nextPay, so_ngay_den_luong: S.D, dang_chi_tb_ngay: S.pace, du_kien_truoc_luong: r1k(S.atPace), tien_hien_co: M.f.pos.cash, no_the: M.f.pos.debt, quy_du_phong: M.reserve, thu_nhap_thang: M.income, chi_co_dinh_thang: M.fixed, tra_gop_thang: M.loanPay, chi_linh_hoat_thang: r1k(M.varMonthly), diem_suc_khoe: H.total, xep_loai: H.band[1], canh_bao: A.slice(0, 4).map(a => a.title) };
  }
  function localChat(q, st) {
    const n = norm(q);
    const help = FT.supportAnswer(q); if (help) return { kind: 'help', md: help };
    const sc = parseScenario(q);
    if (sc && sc.type === 'stress') { const r = stressTest(st, { jobLoss: sc.jobLoss || 0, medical: sc.medical || 0 }); return { kind: 'stress', data: r, md: stressMd(r) }; }
    if (sc && sc.type === 'goal') { const p = makePlan(st, { name: sc.name, target: sc.target, months: sc.months }); const w = whatIf(st, sc); return { kind: 'goal', data: { plan: p, w }, md: goalMd(p, w) }; }
    if (sc) { const w = whatIf(st, sc); return { kind: 'whatif', data: w, md: whatIfMd(w) }; }
    if (/(hom nay|bay gio).*(tieu|chi|xai)|duoc tieu|safe/.test(n)) { const S = safeToSpend(st); return { kind: 'safe', data: S, md: safeMd(S) }; }
    if (/suc khoe|diem|cham diem/.test(n)) { const H = health(st); return { kind: 'health', data: H, md: healthMd(H) }; }
    if (/canh bao|bat thuong|co gi can chu y|rui ro/.test(n)) { const A = alerts2(st); return { kind: 'alerts', data: A, md: A.length ? `**Có ${A.length} điều cần chú ý.** Quan trọng nhất:\n` + A.slice(0, 3).map(a => `- **${a.title}.** ${a.what} ${a.action}`).join('\n') : '**Chưa có cảnh báo nào.**' }; }
    const mq = n.match(/(?:chi|tieu|het|ton)\s+(?:bao nhieu\s+)?(?:cho|vao|o)\s+([a-z0-9 ]{3,30}?)(?:\s+(?:thang|tuan|7 ngay|30 ngay|bao nhieu)|\?|$)/);
    if (mq || /bao nhieu.*(grab|shopee|highlands|giao do an|an uong|cafe)/.test(n)) {
      const qq = mq ? mq[1].trim() : (n.match(/(grab|shopee|highlands|giao do an|an uong|cafe)/) || [])[1];
      const period = /thang truoc/.test(n) ? 'last_month' : /tuan|7 ngay/.test(n) ? 'last_7_days' : /30 ngay/.test(n) ? 'last_30_days' : 'this_month';
      const b = spendingBreakdown(st, period, qq === 'an uong' ? 'an uong' : qq);
      return { kind: 'spend', data: b, md: b.count ? `**${b.label}, bạn chi ${vnd(b.total)} cho "${qq}" (${b.count} giao dịch).**\n` + b.top.slice(0, 3).map(([k, v]) => `- ${k}: ${vnd(v)}`).join('\n') : `Không tìm thấy khoản chi nào khớp "${qq}" trong ${b.label}.` };
    }
    return { kind: 'text', md: FT.localAnswer(q, st) };
  }
  const monthsTxt = arr => arr.length ? arr.map(mShort).join(', ') : 'không có';
  function whatIfMd(w) {
    const r = Object.fromEntries(w.rows.map(x => [x.key, x]));
    const lines = [`**${w.vtext}**`];
    lines.push(`- Số dư cuối tháng: ${vnd(r.end.base)} → **${vnd(r.end.after)}**`);
    lines.push(`- Quỹ dự phòng thấp nhất: ${vnd(r.reserve.base)} → **${vnd(r.reserve.after)}** (${r.reserve.extra[1]})`);
    if (r.goal.base || r.goal.after) lines.push(`- ${r.goal.sub}: ${r.goal.base ? mFull(r.goal.base) : '—'} → **${r.goal.after ? mFull(r.goal.after) : 'quá 3 năm'}** (${r.goal.extra[1]})`);
    lines.push(`- Tháng phải rút quỹ: ${monthsTxt(r.risk.base)} → **${monthsTxt(r.risk.after)}**`);
    lines.push(`- Mức chi an toàn: ${vnd(r.safe.base)}/ngày → **${vnd(r.safe.after)}/ngày**`);
    if (w.info && w.info.pay) lines.push(`_Trả góp ${vnd(w.info.pay)}/tháng, tổng lãi ${vnd(w.info.interest)}._`);
    return lines.join('\n');
  }
  function goalMd(p, w) {
    const lines = [`**Cần để dành ${vnd(p.need)} mỗi tháng trong ${p.months} tháng.**`, `Phép tính: ${vnd(p.target)} ÷ ${p.months} tháng = ${vnd(p.need)}/tháng.`, `Hiện mỗi tháng bạn dư khoảng ${vnd(Math.max(0, p.freeSurplus))} sau các khoản cố định và mục tiêu đang góp.`];
    if (p.items.length) { lines.push('Cần thay đổi:'); p.items.forEach(i => lines.push(`- ${i.label}: ${vnd(i.monthly)}/tháng (${i.how})`)); }
    lines.push(`- Chuyển ${vnd(p.transfer)} vào quỹ ngay ngày nhận lương`);
    if (p.short > 0) lines.push(`Vẫn thiếu ${vnd(p.short)}/tháng. Với mức hiện có, cần khoảng **${p.feasibleMonths} tháng** thay vì ${p.months}.`);
    return lines.join('\n');
  }
  function safeMd(S) { return `**Hôm nay bạn có thể tiêu tối đa ${vnd(S.safe)}**${S.spentToday ? `, đã tiêu ${vnd(S.spentToday)}, còn ${vnd(S.left)}` : ''}.\nPhép tính: (tiền hiện có ${vnd(S.net)} − ${S.obl.length} khoản phải trả ${vnd(S.oblSum)} − dự phòng ${vnd(S.buffer)}) ÷ ${S.D} ngày đến lương ${dShort(S.nextPay)}.\nBạn đang chi trung bình ${vnd(S.pace)}/ngày${S.atPace < 0 ? `, giữ mức này sẽ thiếu ${vnd(-S.atPace)} trước ngày lương` : ''}.`; }
  function healthMd(H) { return `**Điểm sức khỏe tài chính: ${H.total}/100 (${H.band[1]}).**\n` + H.factors.map(f => `- ${f.name}: ${f.points}/${f.weight} · ${f.value}`).join('\n') + (H.downs[0] ? `\nCải thiện nhanh nhất: ${H.downs[0].tip}` : ''); }
  function stressMd(r) { return `**${r.runOut ? `Quỹ dự phòng trụ được khoảng ${months1(r.lasts)} tháng.` : 'Bạn vượt qua kịch bản này mà không thiếu tiền.'}**\n- Tổng cú sốc: ${vnd(r.shockTotal)}\n- Quỹ dự phòng phải dùng: ${vnd(r.reserveUsed)}${r.runOut ? `\n- Hết tiền từ ngày ${dFull(r.runOut)}; cần chuẩn bị thêm ${vnd(r.needMore)}` : ''}\n- Nên cắt trước: ${r.cuts.slice(0, 3).map(c => `${c.label} (${vnd(c.monthly)}/tháng)`).join(', ')}`; }

  // số liệu được phép nhắc tới (để kiểm tra câu trả lời AI)
  function collectNumbers(obj, set = new Set()) {
    if (obj == null) return set;
    if (typeof obj === 'number' && isFinite(obj)) { const a = Math.abs(Math.round(obj)); if (a >= 1000) set.add(a); return set; }
    if (typeof obj === 'string') { (obj.match(/\d{1,3}(?:\.\d{3})+|\d{4,}/g) || []).forEach(s => { const v = Number(s.replace(/\./g, '')); if (v >= 1000) set.add(v); }); return set; }
    if (Array.isArray(obj)) { obj.forEach(x => collectNumbers(x, set)); return set; }
    if (typeof obj === 'object') { Object.values(obj).forEach(x => collectNumbers(x, set)); }
    return set;
  }
  function numbersInText(text) {
    const out = []; const t = String(text);
    const re = /(\d{1,3}(?:[.]\d{3})+|\d+(?:[.,]\d+)?)\s*(triệu|tr\b|trieu|nghìn|ngàn|k\b|tỷ|đ|vnđ|vnd)?/gi; let m;
    while ((m = re.exec(t))) {
      const raw = m[1], unit = (m[2] || '').toLowerCase();
      let v;
      if (/\./.test(raw) && /^\d{1,3}(\.\d{3})+$/.test(raw)) v = Number(raw.replace(/\./g, ''));
      else v = Number(raw.replace(',', '.'));
      if (/triệu|tr|trieu/.test(unit)) v *= 1e6; else if (/nghìn|ngàn|^k$/.test(unit)) v *= 1e3; else if (/tỷ/.test(unit)) v *= 1e9;
      else if (!unit && v < 10000) continue;
      if (v >= 1000) out.push({ raw: m[0].trim(), v: Math.round(v) });
    }
    return out;
  }
  function verifyNumbers(text, allowed) {
    const found = numbersInText(text); const arr = [...allowed];
    const bad = found.filter(f => !arr.some(a => Math.abs(a - f.v) <= Math.max(1000, a * 0.006) || (f.v % 100000 === 0 && Math.abs(a - f.v) <= Math.max(50000, a * 0.05))));
    return { total: found.length, ok: found.length - bad.length, bad };
  }

  Object.assign(FT, { model, simulate, safeToSpend, whatIf, parseScenario, stressTest, survivalCuts, health, alerts2, findDuplicates, makePlan, weeklyReview, planCandidates, maskSensitive, parseNotification, looksLikeNotification, parseStatementLines, parseCSV, tableToRows, reviewImport, sampleStatement, bootstrapFromRows, sampleState: sampleState2, localChat, overview, spendingBreakdown, collectNumbers, numbersInText, verifyNumbers, activeBills, isEmergency, isDelivery, mShort, mFull, dFull, dShort, months1, mDiff, assumptionsOf, whatIfMd, classify, pmt, toNum });
})();

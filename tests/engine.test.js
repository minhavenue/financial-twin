// Kiểm tra nhanh bộ máy tính toán bằng Node.js (không cần cài thư viện):
//   node tests/engine.test.js
const assert = require('assert');
global.FT = require('../src/core.js');
require('../src/engine.js');

const st = FT.sampleState('2026-10-19');
let pass = 0;
const test = (name, fn) => { try { fn(); pass++; console.log('✓', name); } catch (e) { console.error('✗', name, '\n ', e.message); process.exitCode = 1; } };

test('Safe-to-Spend = (tiền dùng được) ÷ số ngày đến lương', () => {
  const S = FT.safeToSpend(st);
  assert.ok(S.D > 0);
  assert.strictEqual(S.safe, Math.max(0, Math.floor(S.pool / S.D / 1000) * 1000));
  assert.strictEqual(S.pool, S.net + S.spentToday - S.oblSum - S.buffer);
});

test('Chuyển tiền giữa các ví không làm đổi tổng tài sản ròng', () => {
  const before = FT.position(st).net;
  const st2 = JSON.parse(JSON.stringify(st));
  st2.txns.push({ id: 'x', date: st2.today, type: 'transfer', amount: 1000000, account: 'vcb', to: 'cash', merchant: 'Rút ATM' });
  assert.strictEqual(FT.position(st2).net, before);
});

test('Twin: mua 20 triệu hôm nay làm số dư cuối tháng giảm đúng 20 triệu', () => {
  const w = FT.whatIf(st, FT.parseScenario('Nếu mua điện thoại 20 triệu hôm nay thì sao?'));
  const end = w.rows.find(r => r.key === 'end');
  assert.strictEqual(end.base - end.after, 20000000);
});

test('Twin hiểu 4 câu hỏi mẫu', () => {
  assert.strictEqual(FT.parseScenario('Nếu nghỉ việc hai tháng, tôi duy trì được bao lâu?').type, 'jobloss');
  assert.strictEqual(FT.parseScenario('Nếu vay trả góp 12 tháng thì tháng nào dễ thiếu tiền?').months, 12);
  const g = FT.parseScenario('Muốn có 100 triệu sau hai năm thì cần thay đổi gì?');
  assert.deepStrictEqual([g.type, g.target, g.months], ['goal', 100000000, 24]);
});

test('Trả góp: công thức PMT', () => {
  assert.strictEqual(Math.round(FT.pmt(20000000, 12, 0)), 1666667);
  assert.ok(Math.abs(FT.pmt(20000000, 12, 0.015) - 1833600) < 1000);
});

test('Điểm sức khỏe = tổng 6 yếu tố, tối đa 100', () => {
  const H = FT.health(st);
  assert.strictEqual(H.factors.length, 6);
  assert.strictEqual(FT.sum(H.factors.map(f => f.weight)), 100);
  assert.strictEqual(H.total, FT.sum(H.factors.map(f => f.points)));
});

test('Mỗi cảnh báo có đủ: chuyện gì, vì sao, ảnh hưởng, nên làm gì', () => {
  FT.alerts2(st).forEach(a => ['what', 'why', 'impact', 'action'].forEach(k => assert.ok(a[k], a.id + ' thiếu ' + k)));
});

test('Phát hiện giao dịch nhập hai lần', () => {
  assert.ok(FT.findDuplicates(st, FT.addDays(st.today, -30)).some(([a]) => a.merchant === 'GrabFood' && a.amount === 156000));
});

test('Nhận diện câu gõ tiếng Việt', () => {
  const [a, b] = FT.parseText('Chiều nay đổ xăng 100 nghìn, grab 62k bằng thẻ', st);
  assert.deepStrictEqual([a.amount, a.cat], [100000, 'di-lai']);
  assert.deepStrictEqual([b.amount, b.account], [62000, 'card']);
});

test('Đọc thông báo biến động số dư và che số tài khoản', () => {
  const rows = FT.parseNotification('VCB: TK 0011004567890 -156,000VND 19/10/2026 SD 3,512,300VND. ND: GRABFOOD ORDER 88123', st);
  assert.deepStrictEqual([rows[0].signed, rows[0].merchant, rows[0].cat], [-156000, 'GrabFood', 'an-uong']);
  assert.ok(!/0011004567890/.test(FT.maskSensitive('TK 0011004567890').text));
});

test('Đọc sao kê CSV và dựng bảng điều khiển', () => {
  const fs = require('fs');
  const csv = fs.readFileSync(__dirname + '/../samples/sao-ke-mau.csv', 'utf8').replace(/^﻿/, '');
  const base = { ...FT.emptyState(), today: '2026-10-01' };
  const out = FT.tableToRows(FT.parseCSV(csv), base);
  assert.ok(out.rows.length > 100);
  const boot = FT.bootstrapFromRows(FT.reviewImport(base, out.rows, 'bank'), out.opening, null);
  assert.ok(boot.bills.some(b => b.kind === 'income'));
  assert.ok(boot.bills.some(b => b.name === 'Tiền nhà'));
});

test('Kiểm tra số liệu: gắn cờ con số AI tự đặt ra', () => {
  const allowed = FT.collectNumbers({ a: 567000, b: 477000 });
  const v = FT.verifyNumbers('Bạn chi 567.000đ, nhiều nhất 477.000đ, tiết kiệm 1,9 triệu.', allowed);
  assert.strictEqual(v.ok, 2); assert.strictEqual(v.bad.length, 1);
});

test('Trợ lý Twin hướng dẫn sử dụng và chuyển tiếp hỗ trợ', () => {
  assert.match(FT.supportAnswer('App có những tính năng gì?'), /Safe-to-Spend/);
  assert.match(FT.supportAnswer('Free và Pro khác nhau thế nào?'), /1 hồ sơ/);
  assert.match(FT.supportAnswer('Tôi thanh toán rồi nhưng chưa mở gói'), /minhavenue@gmail.com/);
  assert.match(FT.supportAnswer('Làm sao đồng bộ điện thoại và web?'), /tự đồng bộ/);
  assert.match(FT.localChat('Cách nhập sao kê PDF?', st).md, /PDF\/Excel dành cho Pro/);
});

console.log(`\n${pass} bài kiểm tra đạt.`);

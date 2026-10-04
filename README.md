# Financial Twin — Trợ lý tài chính AI

Financial Twin tạo một **bản sao tài chính** của từng người: cho biết hôm nay được tiêu bao nhiêu, mô phỏng hậu quả của mỗi quyết định tiền bạc trước khi làm, và đưa ra việc cần làm tiếp theo.

> **AI không được phép tự bịa số.** Mọi con số do bộ máy tính toán xác định; AI chỉ giải thích kết quả, và app kiểm tra từng con số trong câu trả lời của AI.

Web app chạy trên trình duyệt điện thoại, giao diện như ứng dụng, không cần cài đặt, không cần máy chủ. Có sẵn dữ liệu mẫu để dùng thử.

## Tính năng

**Trọng tâm**

| Tính năng | Trả lời câu hỏi |
| --- | --- |
| Twin "Nếu… thì sao?" | Mua món này, trả góp, nghỉ việc, giảm thu nhập… thì dòng tiền thay đổi thế nào? Bảng 2 cột *Kịch bản hiện tại / Sau quyết định* và biểu đồ 2 dòng thời gian |
| Safe-to-Spend | Hôm nay được tiêu tối đa bao nhiêu mà vẫn trả đủ hóa đơn và giữ quỹ đến ngày lương? |
| Stress Test | Mất việc, giảm thu nhập, viện phí, tăng tiền nhà, mua khẩn cấp, lãi vay tăng: quỹ dự phòng trụ được bao lâu, cắt khoản nào trước, cần chuẩn bị thêm bao nhiêu? |
| AI Coach | Kế hoạch tiết kiệm bằng số tiền cụ thể, đánh giá từng tuần và điều chỉnh |
| Cảnh báo chủ động | Mỗi cảnh báo nói rõ: chuyện gì, vì sao, ảnh hưởng bao nhiêu tiền, nên làm gì, độ tin cậy |
| Sức khỏe tài chính | Điểm 0–100 từ 6 yếu tố, có giải thích và cách cải thiện |
| Chatbot "Hỏi Twin" | Hỏi bằng lời thường; AI gọi công cụ của bộ máy tính toán để lấy số |
| Nhập liệu đa phương thức | Gõ, giọng nói (micro bàn phím), ảnh hóa đơn, dán thông báo ngân hàng, sao kê PDF, CSV, Excel; tự phát hiện trùng, đánh dấu dòng chưa chắc chắn, chờ xác nhận trước khi lưu |
| Quyền riêng tư | Che số tài khoản trước khi gửi AI, tô đen vùng nhạy cảm trên ảnh, nhật ký dữ liệu đã gửi AI, mã PIN kèm mã hóa AES-GCM |

**Nền tảng:** tổng quan tài chính, ví và số dư (tiền mặt, ngân hàng, ví điện tử, thẻ tín dụng), quản lý thu–chi, phân loại tự động 10 nhóm có học thói quen, ngân sách cảnh báo 70% / 90% / vượt, mục tiêu tài chính, hóa đơn và khoản định kỳ (tự phát hiện từ lịch sử), báo cáo tuần và tháng, xuất CSV / JSON, xóa dữ liệu.

**Nhiều hồ sơ, tạo dữ liệu từ đầu cho từng người:** mỗi hồ sơ là một bộ dữ liệu riêng trên thiết bị (mã PIN riêng). Dữ liệu mẫu luôn được giữ để trình diễn. Tạo hồ sơ mới bằng 3 cách:

1. **Nhập thông tin trong 3 phút** (5 bước): thu nhập và ngày lương → số dư từng ví → khoản cố định và trả góp còn bao nhiêu kỳ → ngân sách gợi ý → quỹ dự phòng đang có và một mục tiêu.
2. **Tải sao kê ngân hàng** (PDF, CSV, Excel 1–3 tháng): app tự nhận lương, hóa đơn, trả góp, gợi ý ngân sách.
3. **Bắt đầu trống:** tự thêm ví và giao dịch.

Chuyển hồ sơ bằng cách bấm vào tên ở góc trên bên trái, hoặc trong *Cài đặt → Hồ sơ*.

## Chạy thử trên máy

Không cần cài thư viện. Mở trực tiếp file `index.html` bằng trình duyệt, hoặc chạy một máy chủ tĩnh:

```bash
cd financial-twin
python3 -m http.server 8000
# mở http://localhost:8000
```

Muốn xem như trên điện thoại: mở DevTools của trình duyệt và bật chế độ thiết bị di động.

## Đưa lên mạng

Đây là web tĩnh (HTML, CSS, JavaScript thuần), không có bước build.

- **GitHub Pages:** đẩy repo lên GitHub → *Settings* → *Pages* → *Deploy from a branch* → chọn nhánh `main`, thư mục `/ (root)`.
- **Vercel:** *Add New Project* → chọn repo → *Framework Preset: Other* → *Deploy*. Không cần lệnh build.

## Kiểm tra bộ máy tính toán

```bash
node tests/engine.test.js
```

Kiểm tra công thức Safe-to-Spend, chuyển tiền giữa các ví, mô phỏng Twin, công thức trả góp, điểm sức khỏe, cảnh báo, phát hiện trùng, đọc tiếng Việt, đọc thông báo ngân hàng, đọc sao kê và cơ chế kiểm tra số liệu của AI.

## Cấu trúc thư mục

```
financial-twin/
├── index.html            Trang chính
├── src/
│   ├── core.js           Số dư, dự báo tháng, ngân sách, mục tiêu, nhận diện câu gõ tiếng Việt
│   ├── engine.js         Mô phỏng dòng tiền theo ngày (36 tháng), Twin, Safe-to-Spend, Stress Test,
│   │                     điểm sức khỏe, cảnh báo, AI Coach, đọc sao kê/thông báo, kiểm tra số liệu
│   ├── app.js            Giao diện, chatbot, nhập liệu, mã hóa PIN
│   └── styles.css        Giao diện sáng/tối
├── samples/              Sao kê mẫu (ngân hàng giả lập) dạng PDF và CSV để demo
├── docs/                 Bản giới thiệu dự thi (Word)
└── tests/                Kiểm tra bộ máy tính toán
```

## Kiến trúc: AI không được bịa số

1. **Bộ máy tính toán** (`core.js`, `engine.js`) mô phỏng dòng tiền theo từng ngày: thu nhập, hóa đơn, trả góp còn bao nhiêu kỳ, góp mục tiêu, rút quỹ dự phòng khi thiếu, chuyển tiền giữa các ví, khoản chi bất thường một lần.
2. **Lớp AI** chỉ nhận kết quả đã tính, hoặc gọi các công cụ của bộ máy (mô phỏng quyết định, stress test, tra cứu chi tiêu, điểm sức khỏe…) rồi diễn giải.
3. **Kiểm tra số liệu** trích mọi con số trong câu trả lời của AI và đối chiếu với kết quả bộ máy. Số không khớp được gắn cờ, người dùng xem được bản tính chuẩn.
4. **Không có AI vẫn chạy:** mọi tính năng chính dùng bộ máy tính toán; chatbot trả lời bằng chế độ tính tự động.

## Lưu ý khi chạy ngoài Claude

- Phần AI (chatbot gọi AI, đọc ảnh hóa đơn, nút "AI giải thích") dùng khả năng `sample` của trang Claude Artifact. Khi chạy trên GitHub Pages hoặc Vercel, app tự chuyển sang **chế độ tính tự động**. Muốn có AI trên tên miền riêng cần thêm một máy chủ nhỏ gọi API mô hình AI bằng khóa riêng (nằm trong lộ trình).
- Nút tải file (xuất CSV/JSON, sao kê mẫu) dùng khả năng `downloads` của Claude; ở nơi khác app hiện nội dung để sao chép.
- Đọc PDF dùng pdf.js và đọc Excel dùng SheetJS, tải từ cdnjs khi cần. Nếu không tải được, PDF vẫn đọc được bằng bộ đọc dự phòng viết sẵn trong app.
- Dữ liệu lưu trong trình duyệt của từng thiết bị (`localStorage`), mỗi hồ sơ một khóa riêng. Khi bật mã PIN, dữ liệu được mã hóa AES-GCM 256-bit bằng khóa sinh từ PIN (PBKDF2, 150.000 vòng).
- Bản dự thi chưa kết nối ngân hàng. Kết nối chính thức dự kiến qua Open API theo Thông tư 64/2024/TT-NHNN.

## Dữ liệu mẫu

Dữ liệu mẫu và sao kê mẫu hoàn toàn giả lập, chỉ dùng để trình diễn.

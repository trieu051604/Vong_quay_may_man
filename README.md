
# Hướng dẫn Thiết lập Lucky Draw Vũ Trụ

Dự án này sử dụng Google Sheets làm cơ sở dữ liệu. Làm theo các bước sau để thiết lập:

## 1. Chuẩn bị Google Sheet
Tạo một Google Sheet mới với 3 tab (trang tính) có tiêu đề chính xác như sau:

### Tab 1: `Participants`
Hàng đầu tiên (Headers):
| A: id | B: name | C: team | D: eligible |
|-------|---------|---------|-------------|
| 001   | Nguyễn Văn A | Phòng IT | TRUE |

### Tab 2: `Prizes`
Hàng đầu tiên (Headers):
| A: prizeId | B: prizeName | C: quantity | D: imageUrl | E: order |
|------------|--------------|-------------|-------------|----------|
| G1         | iPhone 15    | 1           | https://... | 1        |

### Tab 3: `Results`
Hàng đầu tiên (Headers):
| A: time | B: prizeId | C: prizeName | D: participantId | E: name | F: team |
|---------|------------|--------------|------------------|---------|---------|

## 2. Thiết lập Apps Script
1. Trong Google Sheet, chọn **Extensions (Tiện ích mở rộng)** > **Apps Script**.
2. Xóa hết code cũ và dán nội dung từ file `Code.gs` vào.
3. Nhấn nút **Save (Lưu)**.
4. Nhấn nút **Deploy (Triển khai)** > **New Deployment (Triển khai mới)**.
5. Chọn loại là **Web App**.
6. Mục **Execute as (Thực thi dưới danh nghĩa)**: Chọn **Me (Tôi)**.
7. Mục **Who has access (Ai có quyền truy cập)**: Chọn **Anyone (Mọi người)**.
8. Nhấn **Deploy**. Copy đường dẫn **Web App URL** được cung cấp.

## 3. Cấu hình Web App
1. Chạy ứng dụng web này (`npm run dev`).
2. Nhấn vào biểu tượng **Cài đặt** (góc trên bên phải).
3. Dán đường dẫn **Web App URL** vào ô API Base URL.
4. Nhấn **Lưu cấu hình**.
5. Nhấn nút **Làm mới dữ liệu** để tải danh sách.

## 4. Bắt đầu quay!
Chọn giải thưởng ở bên trái và nhấn **BẮT ĐẦU QUAY**.
# Vong_quay_may_man

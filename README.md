# KLTN-Road-Quality-Warning-System
<p align="center">
   <a href="https://www.uit.edu.vn/">
      <img src="https://i.imgur.com/WmMnSRt.png" border="none">
   </a>
</p>
<h1 align="center">
    KHÓA LUẬN TỐT NGHIỆP
</h1>

<h2>
   Giới thiệu môn học   
</h2>

- **Tên môn học:** Khóa luận tốt nghiệp
- **Mã môn học:** NT505
- **Mã lớp:** NT505.P21
- **Giảng viên hướng dẫn:** Ths. Thái Huy Tân 

<h2>
   Giới thiệu nhóm
</h2>

<table align="center">
      <tr>
       <th>Họ và Tên</th>
       <th>MSSV</th>
       <th>Email</th>
      </tr>
      <tr>
      <td>Thái Nhật Thư</td>
       <td>21522648</td>
       <td>21522648@gm.uit.edu.vn</td>  
      </tr>
      <tr>
      <td>Lê Huỳnh Anh Thư</td>
       <td>21521490</td>
       <td>21521490@gm.uit.edu.vn</td>  
      </tr>
</table>

<h2>Giới thiệu</h2>

**Hệ thống cảnh báo chất lượng đường bộ sử dụng học sâu** là một nền tảng ứng dụng AI và thị giác máy tính vào việc giám sát hạ tầng giao thông. Mục tiêu của hệ thống là:

- Cho phép người dân ghi nhận hình ảnh mặt đường và vị trí GPS qua web hoặc app.
- Tự động phân tích ảnh để đánh giá chất lượng đường (Good, Satisfactory, Poor, Very Poor).
- Hiển thị bản đồ các tuyến đường hư hỏng và đề xuất lộ trình an toàn.
- Hỗ trợ cơ quan chức năng quản lý, theo dõi và phân công công việc bảo trì.

### Các thành phần chính của hệ thống:
- Website và ứng dụng di động cho người dùng.
- Backend với mô hình học sâu để phân loại ảnh mặt đường và ddịch vụ định tuyến sử dụng OSRM (Open Source Routing Machine).
- Hệ thống triển khai theo kiến trúc microservices bằng Docker.
- Giám sát hoạt động hệ thống qua Prometheus và Grafana.

---



<h2>Công nghệ sử dụng</h2>

### Backend
- **Python** – Ngôn ngữ chính của hệ thống backend.
- **FastAPI** – Framework xây dựng RESTful API hiệu suất cao.
- **PostgreSQL** – Cơ sở dữ liệu quan hệ.
- **MongoDB** – Cơ sở dữ liệu NoSQL cho dữ liệu phi cấu trúc.
- **Kafka** – Giao tiếp bất đồng bộ giữa các service.
- **Jenkins** – Tự động hóa CI/CD pipeline.
- **OSRM** – Dịch vụ định tuyến mã nguồn mở.

### Frontend
- **ReactJS** – Phát triển giao diện người dùng website.
- **React Native + Expo** – Ứng dụng di động cho Android và iOS.
- **TypeScript** – Ngôn ngữ tăng tính ổn định khi phát triển frontend.
- **Ant Design + Tailwind CSS** – Giao diện đẹp, dễ tùy chỉnh và mở rộng.
- **Leaflet** – Thư viện bản đồ hiển thị dữ liệu trực quan.

### DevOps & Hạ tầng
- **Docker & Docker Compose** – Đóng gói và triển khai các dịch vụ.
- **Prometheus** – Giám sát hiệu năng container và hệ thống.
- **Grafana** – Hiển thị dashboard giám sát và cảnh báo.

### Thuật toán
- **`HS256` (HMAC-SHA256)** – Ký và xác thực JWT token giữa các service và người dùng đăng nhập.
- **`2D orthogonal projection`** – Xác định điểm hư hỏng nằm trên tuyến đường từ A đến B, hỗ trợ cho tính năng đề xuất lộ trình an toàn.
- **`DBSCAN`** – Gom cụm các đoạn đường bị hư hỏng.

<h2>Hướng dẫn cài đặt</h2>

1. **Clone mã nguồn từ github (hoặc lấy file zip):**  
   ```bash
   https://github.com/thainhatthu/KLTN-Road-Quality-Warning-System.git

2. **Copy file .env.example ra file .env (chỉnh sửa nếu cần thiết):**
    ```bash
    cp .env.example .env

3. **Chạy docker compose (tải docker nếu chưa cài đặt):**
    ```bash
    docker compose up -d

4. **Kiểm tra các container bằng lệnh:**
    ```bash
    docker ps

5. **Chạy docker compose (tải docker nếu chưa cài đặt):**
    ```bash
    docker compose up -d

- Nếu các container đã hoạt động bình thường, có thể truy cập vào trang web: http://localhost để sử dụng sản phẩm
- Sản phẩm đã có một số dữ liệu có sẵn, có thể sử dụng tài khoản admin là username: adminn và password: adminn để đăng nhập. 
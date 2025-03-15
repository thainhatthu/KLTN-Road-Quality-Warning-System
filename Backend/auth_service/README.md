
# DOCUMENT AUTHENTICATION SERVICE

## 1. API đăng nhập

### 1.1 Mục đích

API này được sử dụng để xác thực người dùng bằng cách kiểm tra thông tin đăng nhập (tên người dùng và mật khẩu). Nếu thông tin đăng nhập hợp lệ, API sẽ trả về thông tin người dùng và mã thông báo JWT (token) để sử dụng cho các yêu cầu bảo mật sau này.

### 1.2 Endpoint

```
POST api/signin
```

#### 1.2.1 Định dạng dữ liệu yêu cầu (Request)

Để thực hiện yêu cầu đăng nhập, gửi một JSON object với định dạng sau:

```json
{
    "username": "string",
    "password": "string",
    "email": "string",
    "OTP": "string"
}
```

**Các trường:**
- `username`: Tên người dùng của tài khoản (bắt buộc).
- `password`: Mật khẩu của tài khoản (bắt buộc).
- `email`: Địa chỉ email của tài khoản (không bắt buộc).
- `OTP`: Mã OTP nếu có (không bắt buộc).

#### 1.2.2. Định dạng dữ liệu phản hồi (Response)

API sẽ trả về một JSON object với định dạng như sau:

##### 1.2.2.1 Thành công

```json
{
    "status": "success",
    "data": {
        "info": {
            "id": "int",          
            "email": "string",     
            "username": "string"  
        },
        "token": "string"        
    },
    "message": "Login successful"
}
```

***Trong đó:***
- `status`: Trạng thái của yêu cầu.
- `data`: Dữ liệu trả về từ yêu cầu. Bao gồm:
    - `info`: Thông tin chi tiết về tài khoản người dùng (ID, email, username).
    - `token`: Mã thông báo JWT dùng để xác thực các yêu cầu tiếp theo.
- `message`: Thông điệp mô tả kết quả của yêu cầu.

##### 1.2.2.2 Thất bại

```json
{
    "status": "error",
    "data": null,
    "message": "Login failed",
}
```

### 1.3 Mô tả chi tiết

- **`signin_service(account: Account)`**:
  - Hàm này nhận một đối tượng `Account`, kết nối đến cơ sở dữ liệu và kiểm tra thông tin đăng nhập của người dùng.
  - Nếu thông tin hợp lệ, hàm sẽ tạo một mã thông báo JWT (token) và lấy thông tin của người dùng, sau đó trả về phản hồi thành công.
  - Nếu thông tin không hợp lệ, hàm sẽ trả về phản hồi thất bại.

- **`checkAccount(self, cursor)`**:
  - Kiểm tra xem tài khoản có tồn tại và mật khẩu có đúng hay không bằng cách truy vấn cơ sở dữ liệu.

- **`getInfoAccount(self, cursor)`**:
  - Lấy thông tin chi tiết của người dùng từ cơ sở dữ liệu nếu tài khoản hợp lệ.

### 1.4 Ví dụ

#### Yêu cầu

```json
{
  "username": "test11",
  "password": "123456",
  "email": "string",
  "OTP": "string"
}
```

#### Phản hồi (nếu tồn tại user)

```json
{
    "status": "success",
    "data": {
        "info": {
            "id": 1,
            "email": "testuser@example.com",
            "username": "test11"
        },
        "token": "yegwudbwi13244ej..."
    },
    "message": "Login successful"
}
```

#### Phản hồi (nếu không tồn tại user)

```json
{
  "status": "error",
  "data": null,
  "message": "Login failed"
}
```

## 2. API Đăng ký
### 2.1 Mục đích
Dùng để tạo một tài khoản người dùng mới, nếu đăng ký thành công cần xác thực email để kích hoạt tài khoản
### 2.2 Endpoint
```
POST /api/signup
```

#### 2.2.1 Định dạng dữ liệu yêu cầu (Request)

Để thực hiện yêu cầu đăng ký, gửi một JSON object với định dạng sau:

```json
{
    "username": "string",
    "password": "string",
    "email": "string",
}
```

**Các trường:**
- `username`: Tên người dùng của tài khoản (bắt buộc).
- `password`: Mật khẩu của tài khoản (bắt buộc).
- `email`: Địa chỉ email của tài khoản (bắt buộc).
#### 2.2.2. Định dạng dữ liệu phản hồi (Response)

API sẽ trả về một JSON object với định dạng như sau:

##### 2.2.2.1 Đăng ký thành công

```json
{
  "status": "Success",
  "data": null,
  "message": "Enter OTP sent to your email to verify your account"
}

```
##### 2.2.2.2 Username đã tồn tại
```json
{
  "status": "Error",
  "data": null,
  "message": "Username already exists"
}
```
##### 2.2.2.2 Email đã tồn tại
```json
{
  "status": "Error",
  "data": null,
  "message": "Email already exists"
}
```


***Trong đó:***
- `status`: Trạng thái của yêu cầu.
- `message`: Thông điệp mô tả kết quả của yêu cầu.

## 3. API xác thực email
### 3.1 Mục đích
Xác thực email đã đăng ký tài khoản trước đó bằng cách gửi OTP đã được gửi qua Email.
### 3.2 Endpoint
#### 3.2.1 Định dạng dữ liệu yêu cầu (Request)

Để thực hiện xác thực email, gửi một JSON object với định dạng sau:

```json
{
    "username": "string",
    "password": "string",
    "email": "string",
    "OTP":"string"
}
```
**Các trường:**
- `username`: Tên người dùng của tài khoản (bắt buộc).
- `password`: Mật khẩu của tài khoản (bắt buộc).
- `email`: Địa chỉ email của tài khoản (bắt buộc).
- `OTP`: Mã OTP (bắt buộc).


#### 3.2.2. Định dạng dữ liệu phản hồi (Response)
##### 3.2.2.1 xác thực thành công
```json
{
  "status": "Success",
  "data": null,
  "message": "Email verified successfully"
}
```
##### 3.2.2.2 xác thực không thành công (sai OTP)
```json
{
  "status": "Error",
  "data": null,
  "message": "Email verification failed"
}
```
***Trong đó:***
- `status`: Trạng thái của yêu cầu.
- `message`: Thông điệp mô tả kết quả của yêu cầu.

## 4. API quên mật khẩu
### 4.1 Mục đích
Cho phép người dùng lấy lại mật khẩu bằng cách xác thực email đã đăng ký tài khoản và gửi mật khẩu mới qua email đó.

### 4.2 Endpoint
```
POST api/forgotPassword
```

#### 4.2.1 Định dạng dữ liệu yêu cầu (Request)

Khi gửi yêu cầu API quên mật khẩu, gửi một JSON object với định dạng sau:

```json
{
    "email": "string"
}
```
**Các trường:**
- `email`: Địa chỉ email đã đăng ký tài khoản (bắt buộc).


#### 4.2.2. Định dạng dữ liệu phản hồi (Response)
##### 4.2.2.1 Yêu cầu thành công
```json
{
  "status": "Success",
  "data": null,
  "message": "New password sent to your email"
}
```
##### 4.2.2.2 Yêu cầu không thành công (Email không tồn tại)
```json
{
  "status": "Error",
  "data": null,
  "message": "Email does not exist"
}
```
***Trong đó:***
- `status`: Trạng thái của yêu cầu.
- `message`: Thông điệp mô tả kết quả của yêu cầu.

### 4.3 Lưu ý
- API chỉ hoạt động khi email được cung cấp là email đã đăng ký trong hệ thống.
- Mật khẩu mới sẽ được tạo ngẫu nhiên và gửi tới email đã cung cấp.

## 5. API quên mật khẩu
### 5.1 Mục đích
Cho phép người dùng thay đổi mật khẩu cũ sang mật khẩu mới sau khi xác thực danh tính bằng token.

### 5.2 Endpoint
```
POST api/changePassword
```

#### 5.2.1 Định dạng dữ liệu yêu cầu (Request)

Gửi một JSON object với định dạng sau trong body:

```json
{
    "current_password": "string",
    "new_password": "string",
    "confirm_password": "string"
}
```
**Các trường:**
- `current_password`: Mật khẩu hiện tại (bắt buộc).
- `new_password`: Mật khẩu mới mong muốn (bắt buộc).
- `confirm_password`: Xác nhận mật khẩu mới (đảm bảo khớp với new_password, bắt buộc).


#### 5.2.2. Định dạng dữ liệu phản hồi (Response)
##### 5.2.2.1 Yêu cầu thành công
```json
{
  "status": "Success",
  "data": null,
  "message": "Password updated successfully"
}
```
##### 5.2.2.2 Yêu cầu không thành công
```json
{
  "status": "Error",
  "data": null,
  "message": "New passwords do not match"
}
```
***Trong đó:***
- `status`: Trạng thái của yêu cầu.
- `message`: Thông điệp mô tả kết quả của yêu cầu.

### 5.3 Lưu ý
- API chỉ hoạt động khi token được cung cấp và xác thực tài khoản hợp lệ.
- `new_password` phải đáp ứng yêu cầu bảo mật do hệ thống quy định (nếu có).
- Xác minh rằng `confirm_password` khớp hoàn toàn với `new_password`.

## 6. API thêm user (chỉ dành cho admin)
### 6.1 Mục đích
Cho phép admin thêm mới người dùng và gán quyền truy cập.

### 6.2 Endpoint
```
POST api/addUser
```

#### 6.2.1 Định dạng dữ liệu yêu cầu (Request)

Gửi một JSON object với định dạng sau trong body:

```json
{
  "username": "string",
  "password": "string",
  "permission_id": "integer",
  "email": "string"
}
```
**Các trường:**
- `username`: Tên người dùng mới (bắt buộc).
- `password`: Mật khẩu cho người dùng mới (bắt buộc).
- `permission_id`: ID quyền cho người dùng mới (bắt buộc, vd: 1 cho admin, 2 cho technical, 3 cho user).
- `email`: Địa chỉ email (không bắt buộc).

#### 6.2.2. Định dạng dữ liệu phản hồi (Response)
##### 6.2.2.1 Yêu cầu thành công
```json
{
  "status": "Success",
  "data": {
      "username": "string",
      "user_id": "integer"
  },
  "message": "User created successfully"
}
```
##### 6.2.2.2 Yêu cầu không thành công
###### 6.2.2.2.1 Lỗi không phải admin
```json
{
  "status": "Failed",
  "data": null,
  "message": "Only admins can create new users"
}
```
###### 6.2.2.2.2 Lỗi do trùng username
```json
{
  "status": "Failed",
  "data": null,
  "message": "Username '...' already exists"
}
```
###### 6.2.2.2.3 Lỗi server
```json
{
  "status": "Error",
  "data": null,
  "message": "Error occurred during user creation"
}
```
***Trong đó:***
- `status`: Trạng thái của yêu cầu.
- `message`: Thông điệp mô tả kết quả của yêu cầu.

### 6.3 Lưu ý
- API chỉ dành cho `admin`, các user khác gửi request sẽ nhận lỗi 403 Forbidden.
- Đảm bảo `username` mới là duy nhất trong cơ sở dữ liệu.
- Tài khoản người dùng được tạo sẽ được kéo theo role quyền tương ứng.
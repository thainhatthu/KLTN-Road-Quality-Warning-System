# DOCUMENT DATA SERVICE
## 1. Chức năng
Dùng để thực hiện các chức liên quan dữ liệu của ứng dụng
## 2. Các API cung cấp
<details>
  <summary><strong><span style="color: blue;">ENDPOINT POST /datasvc/api/uploadRoad</strong></summary>

###  Công dụng
Upload hình ảnh đường lên để phân loại chất lượng mặt đường.

### Headers

| Key            | Value                    | Description                                         |
|----------------|--------------------------|-----------------------------------------------------|
| `accept`       | `application/json`       | Indicates the client accepts JSON responses.        |
| `Authorization`| `Bearer <token>`         | Bearer token for API authentication.                |
| `Content-Type` | `multipart/form-data`    | Specifies the type of data being sent.              |

### Request Parameters

Body in `multipart/form-data` format:

| Parameter | Type   | Required | Description                              |
|-----------|--------|----------|------------------------------------------|
| `file`    | File   | Yes      | The image file to upload.                |
| `latitude`| Float  | Yes       | Latitude coordinate for the image.       |
| `longitude`| Float | Yes       | Longitude coordinate for the image.      |

## Responses

| Status Code | Message                   | Description                             |
|-------------|---------------------------|-----------------------------------------|
| `200`       | Image uploaded successfully|      upload successfully                                 |
| `400`       | Bad Request                | Missing or invalid parameters.          |
| `401`       | Unauthorized               | Invalid or missing Bearer token.       |
| `500`       | Internal Server Error      | Server encountered an error processing the request. |
</details>

<details>
  <summary><strong><span style="color: green;">ENDPOINT GET /datasvc/api/getInfoRoads</strong></summary>
 
## công dụng
Lấy thông tin đường đã upload của tất cả user


##  Cách sử dụng
### Request Parameters
`Query`
| Parameter | Type   | Required | Description                              |
|-----------|--------|----------|------------------------------------------|
| `user_id` |  INT   |  No      | Lấy thông tin đường đã upload của user có id là `user_id`|
| `id_road` | INT    |  No      | Lây thông tin đường có id là `id_road`   |
| `ward_id` | INT    |  No      | Lây thông tin đường của phường có id là `ward_id`   |

Nếu không có parameter thì sẽ lấy toàn bộ thông tin của tất cả các đường của tất cả user

### Responses

| Status Code | Message                   | Description                             |
|-------------|---------------------------|-----------------------------------------|
| `200`       | Get info road successfully| Lấy thông ảnh thành công    |            
| `500`       | Internal Server Error     |Lỗi từ server                |

Kết trả vể thành công sẽ có foramt:
```
{
  "status": "success",
  "data": [
    {
     "id":<id của đường>,
     "user_id":<id user đã upload đường>,
     "filepath":<URL của hình ảnh đường>,
     "latitude":<vĩ độ>,
     "longitude":<kinh độ>,
     "level":<chấtlượng đường>,
     "created_at":<Thời gian đường được upload>
    }
  ]
  "message": "Get info road successfully"
}
```

</details>

<details>
  <summary><strong><span style="color: red;">ENDPOINT DELETE /datasvc/api/deletedRoad</strong></summary>

## Công dụng
Dùng để xóa đường đã upload

## Cách sử dụng
### Headers

| Key            | Value                    | Description                                         |
|----------------|--------------------------|-----------------------------------------------------|
| `accept`       | `application/json`       | Chấp nhận kiểu dữ liệu trả về        |
| `Authorization`| `Bearer <token>`         | Token của user                |

### Request Parameters

| Parameter | Type   | Required | Description              |
|-----------|--------|----------|--------------------------|
| `id_road` | INT    |  YES      | Id của đường muốn xóa   |



### Responses

| Status Code | Message                   | Description                             |
|-------------|---------------------------|-----------------------------------------|
| `200`       | Road was deleted successfully| xóa đường thành công               |
| `400`       | Bad Request             | Thiếu parameter hoặc sài format request          |
| `401`       | Unauthorized            | Token bị sai                            |
| `403`       | Not authenticated       | Thiếu token                            |
| `403`       | You don't have permission to delete this road | User không phải là user uplaod đường  |
| `404`       | Road not found          | Id đường khồng tồn tại                           |
| `500`       | Internal Server Error      | Lỗi từ server                        | 
</details>

<details>
<summary><strong>ENPOINT GET /api/getRouteMap<strong></summary>

## Công dụng </br>
Dùng để lấy Route của các tuyến đường bị hư.

## Cách sử dụng
### Headers

| Key            | Value                    | Description                                         |
|----------------|--------------------------|-----------------------------------------------------|
| `accept`       | `application/json`       | Chấp nhận kiểu dữ liệu trả về        |

### Responses

| Status Code | Message                   | Description                          |
|-------------|---------------------------|--------------------------------------|
| `200`       | Get route succesful       | Lấy route map thành công             |
| `500`       | Internal Server Error     | Lỗi từ server                        | 




Kết trả vể thành công sẽ có foramt:
```
{
  "satus": "Success",
  "message": "Get route succesful",
  "data": [
    [
      "(10.8492, 106.78746)",
      "(10.849439, 106.787501)"
    ],
    [
      "(10.849927, 106.787617)",
      "(10.850033, 106.787649)",
      "(10.850077, 106.787623)"
    ]
  ]
}
```

data sẽ là một các route map, trong route sẽ có dánh sách các tọa độ
</details>

<details>

<summary><strong>ENPOINT PATCH /api/updateLocationRoad<strong></summary>

## Công dụng </br>
Dùng để cập nhật lại tọa độ đường đã update

## Cách sử dụng
### Headers

| Key            | Value                    | Description                                         |
|----------------|--------------------------|-----------------------------------------------------|
| `accept`       | `application/json`       | Chấp nhận kiểu dữ liệu trả về        |
| `Authorization`| `Bearer <token>`         | Token của user                       |

### Request Parameters

Body in `multipart/form-data` format:

| Parameter  | Type   | Required | Description                              |
|------------|--------|----------|------------------------------------------|
| `id`       | INT    | Yes      | id của đường muốn cập nhật                |
| `latitude` | Float  | Yes      | Vĩ độ mới              |
| `longitude`| Float  | Yes      | Kinh đọ mới     |

### Responses

| Status Code | Message                   | Description                          |
|-------------|---------------------------|--------------------------------------|
| `200`       | Location was updated successfully      | Cập nhật tọa độ thành công             |
| `400`       | Update not successful                    |  Cập nhật không thành công              | 
| `403`       | You don't have permission to update this road                   | User không có quyền cập nhật               | 
| `404`       | Road not found                     |  id đường không tồn tại                | 
| `500`       | Internal Server Error               | Lỗi từ server                        | 

</details>


<details>

<summary><strong>ENPOINT GET /api/statisticsRoad<strong></summary>

## Công dụng </br>
Thông kê đường hư đã được upload và số đường đã được sửa chữa (trong một khoảng thời gian được chỉ định).

## Cách sử dụng
### Headers

| Key            | Value                    | Description                                         |
|----------------|--------------------------|-----------------------------------------------------|
| `accept`       | `application/json`       | Chấp nhận kiểu dữ liệu trả về        |
| `Authorization`| `Bearer <token>`         | Token của user                       |

### Request Parameters

`Query`

| Parameter  | Type   | Required | Description                              |
|------------|--------|----------|------------------------------------------|
| `during`   | STRING (monthly/yearly)    | No    | Đơn vị thời gian              |
| `number` | INT  | No      | Số lượng cho đợn vị thời gian đã chọn            |

Mặc định sẽ lấy trong một tháng gần đây

### Responses

| Status Code | Message                   | Description                          |
|-------------|---------------------------|--------------------------------------|
| `200`       | Get statistics road successfully     | Lấy thống kê thành công |
| `403`       | You don't have permission to access this feature                   | User không có quyền               | 
| `500`       | Internal Server Error               | Lỗi từ server                        | 

Ví dụ response trả về nếu lấy thống kê thành công.
```
{
  "status": "success",
  "data": {
    "Total": [
      "'Poor': 1",
      "'Satisfactory': 30",
      "'Very poor': 11"
    ],
    "Done": []
  },
  "message": "Get statistics road successfully"
}
```
</details>

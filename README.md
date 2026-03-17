# Todo API

RESTful API với data validation, pagination, filtering và logging.

## Cài đặt

```bash
npm install
npm run migrate
npm run dev
```

## API Endpoints

### GET /api/todos
Lấy danh sách todos với pagination và filtering

Query parameters:
- `page`: Số trang (default: 1)
- `limit`: Số items per page (default: 10)  
- `status`: Filter theo status (PENDING|DONE)
- `title`: Filter theo title (tìm kiếm partial)

### POST /api/todos
Tạo todo mới

Body:
```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "status": "PENDING|DONE (optional)",
  "due_date": "YYYY-MM-DD (optional)"
}
```

### PUT /api/todos/:id
Cập nhật todo

### DELETE /api/todos/:id
Xóa todo

## Features

- ✅ Input Validation với Joi
- ✅ Pagination và Filtering
- ✅ Logging với Winston
- ✅ Error handling
- ✅ Security với Helmet
- ✅ CORS support

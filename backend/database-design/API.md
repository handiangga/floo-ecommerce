# Floo Ecommerce REST API v1.0

## Base URL

```text
/api/v1
```

---

# Authentication

Menggunakan

```text
JWT Bearer Token
```

Header

```http
Authorization: Bearer <token>
```

---

# Response Standard

## Success

```json
{
  "success": true,
  "message": "Success",
  "data": {},
  "meta": {}
}
```

---

## Error

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": []
}
```

---

# Pagination

Request

```http
?page=1&limit=10
```

Response

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPage": 10
  }
}
```

---

# AUTH MODULE

## Login

```http
POST /auth/login
```

Body

```json
{
  "email": "",
  "password": ""
}
```

---

## Logout

```http
POST /auth/logout
```

---

## Profile

```http
GET /auth/profile
```

---

# USER MODULE

```http
GET /users
POST /users
GET /users/:id
PUT /users/:id
DELETE /users/:id
```

---

# ROLE MODULE

```http
GET /roles
POST /roles
PUT /roles/:id
DELETE /roles/:id
```

---

# CATEGORY MODULE

```http
GET /categories
```

Support

```text
Pagination

Search

Sorting

Status Filter
```

---

```http
GET /categories/:id
```

---

```http
POST /categories
```

---

```http
PUT /categories/:id
```

---

```http
DELETE /categories/:id
```

---

# PRODUCT MODULE

## List Product

```http
GET /products
```

Query

```text
page

limit

search

category

featured

status

sort
```

---

## Detail Product

```http
GET /products/:slug
```

---

## Create Product

```http
POST /products
```

---

## Update Product

```http
PUT /products/:id
```

---

## Delete Product

```http
DELETE /products/:id
```

---

## Upload Product Image

```http
POST /products/:id/images
```

---

## Delete Product Image

```http
DELETE /products/images/:id
```

---

## Variant

```http
POST /products/:id/variants

PUT /variants/:id

DELETE /variants/:id
```

---

# COLOR MODULE

```http
GET /colors

POST /colors

PUT /colors/:id

DELETE /colors/:id
```

---

# SIZE MODULE

```http
GET /sizes

POST /sizes

PUT /sizes/:id

DELETE /sizes/:id
```

---

# CUSTOMER MODULE

```http
POST /customers/register

POST /customers/login

GET /customers/profile

PUT /customers/profile
```

---

# ADDRESS MODULE

```http
GET /addresses

POST /addresses

PUT /addresses/:id

DELETE /addresses/:id
```

---

# CART MODULE

## Get Cart

```http
GET /cart
```

---

## Add To Cart

```http
POST /cart
```

Body

```json
{
  "variant_id": 1,
  "qty": 1
}
```

---

## Update Qty

```http
PUT /cart/:id
```

---

## Delete Cart Item

```http
DELETE /cart/:id
```

---

# WISHLIST MODULE

```http
GET /wishlist

POST /wishlist

DELETE /wishlist/:id
```

---

# ORDER MODULE

## Checkout

```http
POST /checkout
```

---

## Orders

```http
GET /orders

GET /orders/:id

POST /orders

PUT /orders/:id

DELETE /orders/:id
```

---

## Order Items

```http
GET /orders/:id/items
```

---

# PAYMENT MODULE

## Create Payment

```http
POST /payments
```

---

## Payment Callback

```http
POST /payments/callback
```

---

## Payment Detail

```http
GET /payments/:id
```

---

# SHIPMENT MODULE

## Shipment

```http
GET /shipments

PUT /shipments/:id
```

---

## Tracking

```http
GET /shipments/:id/tracking
```

---

# REVIEW MODULE

```http
GET /reviews

POST /reviews

PUT /reviews/:id

DELETE /reviews/:id
```

---

## Upload Review Image

```http
POST /reviews/:id/images
```

---

# BANNER MODULE

```http
GET /banners

POST /banners

PUT /banners/:id

DELETE /banners/:id
```

---

# VOUCHER MODULE

```http
GET /vouchers

POST /vouchers

PUT /vouchers/:id

DELETE /vouchers/:id
```

---

# NOTIFICATION MODULE

```http
GET /notifications

PUT /notifications/:id/read
```

---

# DASHBOARD MODULE

## Dashboard Summary

```http
GET /dashboard
```

Response

```text
Today's Sales

Monthly Sales

Total Orders

Total Products

Total Customers

Best Selling Products

Recent Orders
```

---

# Upload API

Semua upload menggunakan

```text
Supabase Storage
```

Endpoint

```http
POST /upload
```

Response

```json
{
  "url": "https://..."
}
```

---

# Middleware

Semua endpoint menggunakan middleware berikut sesuai kebutuhan:

- Authentication
- Authorization
- Joi Validation
- Upload
- Cache
- Error Handler

---

# HTTP Status

| Code | Description           |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 204  | No Content            |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 422  | Validation Error      |
| 500  | Internal Server Error |

---

# Development Flow

```text
Request

↓

Route

↓

Validation

↓

Authentication

↓

Authorization

↓

Controller

↓

Service

↓

Repository

↓

Model

↓

Database

↓

Response
```

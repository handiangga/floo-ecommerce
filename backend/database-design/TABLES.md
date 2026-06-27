# Floo Ecommerce Database Tables v1.0

## Convention

### Primary Key

- BIGINT
- Auto Increment

### Foreign Key

- BIGINT

### Timestamp

- createdAt
- updatedAt

### Status

Menggunakan ENUM

```
ACTIVE
INACTIVE
```

---

# AUTH MODULE

## Roles

| Field       | Type       | Nullable | Default |
| ----------- | ---------- | -------- | ------- |
| id          | BIGINT PK  | NO       |         |
| name        | STRING(50) | NO       |         |
| description | TEXT       | YES      |         |
| status      | ENUM       | NO       | ACTIVE  |
| createdAt   | DATE       | NO       | NOW     |
| updatedAt   | DATE       | NO       | NOW     |

---

## Users

| Field      | Type      |
| ---------- | --------- |
| id         | BIGINT PK |
| role_id FK |           |
| name       |           |
| email      |           |
| phone      |           |
| password   |           |
| photo      |           |
| last_login |           |
| status     |           |
| createdAt  |           |
| updatedAt  |           |

---

# CATALOG MODULE

## Categories

| Field       | Type        |
| ----------- | ----------- |
| id          | BIGINT PK   |
| name        | STRING(100) |
| slug        | STRING(120) |
| image       | TEXT        |
| banner      | TEXT        |
| description | TEXT        |
| sort_order  | INTEGER     |
| is_featured | BOOLEAN     |
| status      | ENUM        |
| createdAt   | DATE        |
| updatedAt   | DATE        |

---

## Products

| Field           | Type        |
| --------------- | ----------- |
| id              | BIGINT PK   |
| category_id FK  |             |
| name            | STRING(150) |
| slug            | STRING(180) |
| description     | TEXT        |
| material        | STRING(100) |
| brand           | STRING(100) |
| weight          | INTEGER     |
| seo_title       | STRING(255) |
| seo_description | TEXT        |
| featured        | BOOLEAN     |
| status          | ENUM        |
| createdAt       | DATE        |
| updatedAt       | DATE        |

---

## ProductImages

| Field            | Type      |
| ---------------- | --------- |
| id               | BIGINT PK |
| product_id FK    |           |
| color_id FK NULL |           |
| image            | TEXT      |
| alt              | STRING    |
| sort_order       | INTEGER   |
| createdAt        | DATE      |
| updatedAt        | DATE      |

---

## Colors

| Field      | Type       |
| ---------- | ---------- |
| id         | BIGINT PK  |
| name       | STRING(50) |
| code       | STRING(20) |
| image      | TEXT       |
| sort_order | INTEGER    |
| status     | ENUM       |
| createdAt  | DATE       |
| updatedAt  | DATE       |

---

## Sizes

| Field      | Type       |
| ---------- | ---------- |
| id         | BIGINT PK  |
| name       | STRING(20) |
| sort_order | INTEGER    |
| status     | ENUM       |
| createdAt  | DATE       |
| updatedAt  | DATE       |

---

## ProductVariants

| Field          | Type        |
| -------------- | ----------- |
| id             | BIGINT PK   |
| product_id FK  |             |
| color_id FK    |             |
| size_id FK     |             |
| sku            | STRING(100) |
| barcode        | STRING(100) |
| price          | INTEGER     |
| discount_price | INTEGER     |
| stock          | INTEGER     |
| weight         | INTEGER     |
| length         | FLOAT       |
| width          | FLOAT       |
| height         | FLOAT       |
| min_order      | INTEGER     |
| max_order      | INTEGER     |
| is_ready_stock | BOOLEAN     |
| is_preorder    | BOOLEAN     |
| preorder_days  | INTEGER     |
| status         | ENUM        |
| createdAt      | DATE        |
| updatedAt      | DATE        |

---

# CUSTOMER MODULE

## Customers

| Field      | Type        |
| ---------- | ----------- |
| id         | BIGINT PK   |
| name       | STRING(100) |
| email      | STRING      |
| phone      | STRING      |
| password   | STRING      |
| gender     | ENUM        |
| birth_date | DATEONLY    |
| photo      | TEXT        |
| status     | ENUM        |
| createdAt  | DATE        |
| updatedAt  | DATE        |

---

## Addresses

| Field          | Type      |
| -------------- | --------- |
| id             | BIGINT PK |
| customer_id FK |           |
| receiver_name  | STRING    |
| receiver_phone | STRING    |
| province       | STRING    |
| city           | STRING    |
| district       | STRING    |
| postal_code    | STRING    |
| address        | TEXT      |
| latitude       | DOUBLE    |
| longitude      | DOUBLE    |
| is_default     | BOOLEAN   |
| createdAt      | DATE      |
| updatedAt      | DATE      |

---

# SHOPPING MODULE

## Carts

| Field          | Type      |
| -------------- | --------- |
| id             | BIGINT PK |
| customer_id FK |           |
| createdAt      | DATE      |
| updatedAt      | DATE      |

---

## CartItems

| Field         | Type      |
| ------------- | --------- |
| id            | BIGINT PK |
| cart_id FK    |           |
| variant_id FK |           |
| qty           | INTEGER   |
| createdAt     | DATE      |
| updatedAt     | DATE      |

---

## Wishlists

| Field          | Type      |
| -------------- | --------- |
| id             | BIGINT PK |
| customer_id FK |           |
| product_id FK  |           |
| createdAt      | DATE      |

---

# ORDER MODULE

## Orders

| Field           | Type      |
| --------------- | --------- |
| id              | BIGINT PK |
| invoice         | STRING    |
| customer_id FK  |           |
| address_id FK   |           |
| subtotal        | INTEGER   |
| discount        | INTEGER   |
| shipping_cost   | INTEGER   |
| grand_total     | INTEGER   |
| payment_status  | ENUM      |
| shipping_status | ENUM      |
| order_status    | ENUM      |
| payment_method  | STRING    |
| shipping_method | STRING    |
| notes           | TEXT      |
| createdAt       | DATE      |
| updatedAt       | DATE      |

---

## OrderItems

| Field         | Type      |
| ------------- | --------- |
| id            | BIGINT PK |
| order_id FK   |           |
| variant_id FK |           |
| qty           | INTEGER   |
| price         | INTEGER   |
| discount      | INTEGER   |
| subtotal      | INTEGER   |
| createdAt     | DATE      |
| updatedAt     | DATE      |

---

## Payments

| Field          | Type      |
| -------------- | --------- |
| id             | BIGINT PK |
| order_id FK    |           |
| provider       | STRING    |
| transaction_id | STRING    |
| amount         | INTEGER   |
| status         | ENUM      |
| paid_at        | DATE      |
| createdAt      | DATE      |
| updatedAt      | DATE      |

---

## Shipments

| Field           | Type      |
| --------------- | --------- |
| id              | BIGINT PK |
| order_id FK     |           |
| courier         | STRING    |
| service         | STRING    |
| tracking_number | STRING    |
| status          | ENUM      |
| shipped_at      | DATE      |
| received_at     | DATE      |
| createdAt       | DATE      |
| updatedAt       | DATE      |

---

# REVIEW MODULE

## Reviews

| Field          | Type      |
| -------------- | --------- |
| id             | BIGINT PK |
| customer_id FK |           |
| product_id FK  |           |
| rating         | INTEGER   |
| review         | TEXT      |
| createdAt      | DATE      |
| updatedAt      | DATE      |

---

## ReviewImages

| Field        | Type      |
| ------------ | --------- |
| id           | BIGINT PK |
| review_id FK |           |
| image        | TEXT      |
| createdAt    | DATE      |

---

# MARKETING MODULE

## Banners

| Field      | Type      |
| ---------- | --------- |
| id         | BIGINT PK |
| title      | STRING    |
| image      | TEXT      |
| url        | STRING    |
| sort_order | INTEGER   |
| status     | ENUM      |
| createdAt  | DATE      |
| updatedAt  | DATE      |

---

## Vouchers

| Field            | Type                |
| ---------------- | ------------------- |
| id               | BIGINT PK           |
| code             | STRING              |
| title            | STRING              |
| type             | ENUM(PERCENT,FIXED) |
| value            | INTEGER             |
| minimum_purchase | INTEGER             |
| maximum_discount | INTEGER             |
| quota            | INTEGER             |
| used             | INTEGER             |
| start_date       | DATE                |
| end_date         | DATE                |
| status           | ENUM                |
| createdAt        | DATE                |
| updatedAt        | DATE                |

---

# SYSTEM MODULE

## ActivityLogs

| Field      | Type      |
| ---------- | --------- |
| id         | BIGINT PK |
| user_id FK |           |
| activity   | TEXT      |
| ip         | STRING    |
| user_agent | TEXT      |
| createdAt  | DATE      |

---

## Notifications

| Field          | Type      |
| -------------- | --------- |
| id             | BIGINT PK |
| customer_id FK |           |
| title          | STRING    |
| message        | TEXT      |
| is_read        | BOOLEAN   |
| createdAt      | DATE      |

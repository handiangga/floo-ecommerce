# Floo Ecommerce Database Indexes v1.0

## Overview

Dokumen ini mendefinisikan seluruh index, unique constraint, dan composite index yang digunakan pada database.

Tujuan:

- Mempercepat query
- Mencegah data duplikat
- Mengoptimalkan JOIN
- Mengoptimalkan filtering
- Mengoptimalkan sorting

---

# Roles

### Primary Key

```text
id
```

### Unique

```text
name
```

### Index

```text
status
```

---

# Users

### Primary Key

```text
id
```

### Foreign Key Index

```text
role_id
```

### Unique

```text
email

phone
```

### Index

```text
status

last_login
```

---

# Categories

### Primary Key

```text
id
```

### Unique

```text
slug

name
```

### Index

```text
status

sort_order

is_featured
```

---

# Products

### Primary Key

```text
id
```

### Foreign Key

```text
category_id
```

### Unique

```text
slug
```

### Index

```text
category_id

featured

status

createdAt
```

---

# ProductImages

### Primary Key

```text
id
```

### Foreign Key

```text
product_id

color_id
```

### Index

```text
sort_order
```

---

# Colors

### Primary Key

```text
id
```

### Unique

```text
name
```

### Index

```text
status

sort_order
```

---

# Sizes

### Primary Key

```text
id
```

### Unique

```text
name
```

### Index

```text
status

sort_order
```

---

# ProductVariants

### Primary Key

```text
id
```

### Foreign Key

```text
product_id

color_id

size_id
```

### Unique

```text
sku

barcode
```

### Composite Unique

```text
product_id

color_id

size_id
```

### Index

```text
stock

status

price

discount_price

is_ready_stock

is_preorder
```

---

# Customers

### Primary Key

```text
id
```

### Unique

```text
email

phone
```

### Index

```text
status

createdAt
```

---

# Addresses

### Primary Key

```text
id
```

### Foreign Key

```text
customer_id
```

### Index

```text
is_default

city

province
```

---

# Carts

### Primary Key

```text
id
```

### Foreign Key

```text
customer_id
```

### Unique

```text
customer_id
```

---

# CartItems

### Primary Key

```text
id
```

### Foreign Key

```text
cart_id

variant_id
```

### Composite Unique

```text
cart_id

variant_id
```

---

# Wishlists

### Primary Key

```text
id
```

### Foreign Key

```text
customer_id

product_id
```

### Composite Unique

```text
customer_id

product_id
```

---

# Orders

### Primary Key

```text
id
```

### Foreign Key

```text
customer_id

address_id
```

### Unique

```text
invoice
```

### Index

```text
payment_status

shipping_status

order_status

createdAt
```

---

# OrderItems

### Primary Key

```text
id
```

### Foreign Key

```text
order_id

variant_id
```

---

# Payments

### Primary Key

```text
id
```

### Foreign Key

```text
order_id
```

### Unique

```text
transaction_id

order_id
```

### Index

```text
status

paid_at
```

---

# Shipments

### Primary Key

```text
id
```

### Foreign Key

```text
order_id
```

### Unique

```text
order_id

tracking_number
```

### Index

```text
status

courier
```

---

# Reviews

### Primary Key

```text
id
```

### Foreign Key

```text
customer_id

product_id
```

### Index

```text
rating

createdAt
```

---

# ReviewImages

### Primary Key

```text
id
```

### Foreign Key

```text
review_id
```

---

# Banners

### Primary Key

```text
id
```

### Index

```text
status

sort_order
```

---

# Vouchers

### Primary Key

```text
id
```

### Unique

```text
code
```

### Index

```text
status

start_date

end_date
```

---

# ActivityLogs

### Primary Key

```text
id
```

### Foreign Key

```text
user_id
```

### Index

```text
createdAt
```

---

# Notifications

### Primary Key

```text
id
```

### Foreign Key

```text
customer_id
```

### Index

```text
is_read

createdAt
```

---

# Composite Constraints

## Product Variant

```text
UNIQUE

product_id
color_id
size_id
```

---

## Wishlist

```text
UNIQUE

customer_id
product_id
```

---

## Cart Item

```text
UNIQUE

cart_id
variant_id
```

---

## Payment

```text
UNIQUE

order_id
```

---

## Shipment

```text
UNIQUE

order_id
```

---

# Query Optimization Notes

- Semua Foreign Key wajib memiliki index.
- Semua kolom yang sering digunakan untuk filter (`status`, `featured`, `createdAt`) diberi index.
- Semua kolom pencarian utama (`slug`, `sku`, `invoice`, `email`, `phone`, `tracking_number`) menggunakan UNIQUE atau INDEX.
- Composite index digunakan untuk menjaga integritas data pada ProductVariant, CartItem, Wishlist, Payment, dan Shipment.

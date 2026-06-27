# Floo Ecommerce Database Blueprint v1.0

## Overview

Backend dibangun menggunakan:

- Express.js
- PostgreSQL
- Sequelize ORM
- Repository Pattern
- Service Layer
- Joi Validation

Target arsitektur mengikuti standar e-commerce modern sehingga mudah dikembangkan.

---

# Entity Relationship Diagram

```
Roles
   │
   └──────── Users

Categories
   │
   └──────── Products
                  │
                  ├──────── ProductImages
                  │              │
                  │              └──────── Colors (optional)
                  │
                  └──────── ProductVariants
                                   │
                                   ├──────── Colors
                                   └──────── Sizes

Customers
      │
      ├──────── Addresses
      │
      ├──────── Carts
      │         │
      │         └──────── CartItems
      │
      ├──────── Wishlists
      │
      ├──────── Orders
      │         │
      │         ├──────── OrderItems
      │         ├──────── Payments
      │         └──────── Shipments
      │
      └──────── Reviews
                    │
                    └──────── ReviewImages

Users
   │
   └──────── ActivityLogs

Customers
   │
   └──────── Notifications
```

---

# Module

## Authentication

- Roles
- Users

---

## Catalog

- Categories
- Products
- ProductImages
- Colors
- Sizes
- ProductVariants

---

## Customer

- Customers
- Addresses

---

## Shopping

- Carts
- CartItems
- Wishlists

---

## Orders

- Orders
- OrderItems
- Payments
- Shipments

---

## Reviews

- Reviews
- ReviewImages

---

## Marketing

- Banners
- Vouchers

---

## System

- ActivityLogs
- Notifications

---

# Total Tables

| No  | Table           |
| --- | --------------- |
| 1   | Roles           |
| 2   | Users           |
| 3   | Categories      |
| 4   | Products        |
| 5   | ProductImages   |
| 6   | Colors          |
| 7   | Sizes           |
| 8   | ProductVariants |
| 9   | Customers       |
| 10  | Addresses       |
| 11  | Carts           |
| 12  | CartItems       |
| 13  | Wishlists       |
| 14  | Orders          |
| 15  | OrderItems      |
| 16  | Payments        |
| 17  | Shipments       |
| 18  | Reviews         |
| 19  | ReviewImages    |
| 20  | Banners         |
| 21  | Vouchers        |
| 22  | ActivityLogs    |
| 23  | Notifications   |

---

# Design Principles

- Customer dipisahkan dari User (Admin).
- Product menggunakan Variant (warna + ukuran).
- Semua stok berada di ProductVariant.
- CartItem dan OrderItem mengacu ke ProductVariant.
- ProductImage mendukung galeri berdasarkan warna.
- Semua endpoint menggunakan Repository Pattern.
- Semua request menggunakan Joi Validation.
- Response API menggunakan format yang konsisten.
- Soft delete tidak digunakan pada versi pertama.
- Semua foreign key menggunakan constraint database.

---

# Development Flow

```
Blueprint

↓

Migration

↓

Model

↓

Association

↓

Seeder

↓

Repository

↓

Service

↓

Controller

↓

Route

↓

Frontend
```

---

# Status

- [x] Database Blueprint
- [ ] Migration
- [ ] Model
- [ ] Association
- [ ] Seeder
- [ ] Authentication
- [ ] Product API
- [ ] Category API
- [ ] Customer API
- [ ] Order API
- [ ] Dashboard

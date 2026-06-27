# Floo Ecommerce Seeders v1.0

## Overview

Seeder digunakan untuk mengisi data awal sistem agar aplikasi dapat langsung digunakan setelah proses migration.

Urutan eksekusi:

```text
Roles
↓

Users (Owner)

↓

Categories

↓

Colors

↓

Sizes

↓

Banners

↓

Vouchers
```

---

# Roles

Seeder File

```text
seeders/01-roles.js
```

Data

| Name      | Description      |
| --------- | ---------------- |
| OWNER     | Full Access      |
| ADMIN     | Manage System    |
| CS        | Customer Service |
| WAREHOUSE | Warehouse Staff  |
| MARKETING | Marketing Team   |

---

# Default User

Seeder File

```text
seeders/02-users.js
```

Data

```text
Name
Owner

Email
owner@floo.id

Password
12345678
```

> Password akan di-hash menggunakan bcrypt sebelum disimpan.

---

# Categories

Seeder File

```text
seeders/03-categories.js
```

Data

```text
Kebaya

Gamis

Couple

Dress

Bridesmaid

Mom & Kids

Accessories
```

---

# Colors

Seeder File

```text
seeders/04-colors.js
```

Data

```text
Black

White

Cream

Ivory

Beige

Latte

Milo

Brown

Mocha

Coffee

Gold

Silver

Rose Gold

Maroon

Burgundy

Red

Dusty Pink

Baby Pink

Fuchsia

Peach

Salem

Lilac

Lavender

Purple

Navy

Royal Blue

Sky Blue

Denim

Tosca

Mint

Sage

Olive

Army

Emerald

Green

Mustard

Yellow

Orange

Terracotta

Chocolate
```

Setiap warna memiliki:

| Field  | Contoh  |
| ------ | ------- |
| name   | Navy    |
| code   | #1B2951 |
| status | ACTIVE  |

---

# Sizes

Seeder File

```text
seeders/05-sizes.js
```

Data

```text
XS

S

M

L

XL

XXL

XXXL

All Size
```

Sort Order

```text
XS

↓

S

↓

M

↓

L

↓

XL

↓

XXL

↓

XXXL

↓

All Size
```

---

# Banners

Seeder File

```text
seeders/06-banners.js
```

Data

```text
New Arrival

Flash Sale

Couple Collection

Luxury Collection
```

Status

```text
ACTIVE
```

---

# Voucher

Seeder File

```text
seeders/07-vouchers.js
```

Example

```text
WELCOME10

Type
PERCENT

Value
10%

Minimum Purchase
300000

Maximum Discount
50000
```

---

# Order Status

Konstanta awal

```text
PENDING

PROCESS

PACKING

SHIPPED

COMPLETED

CANCELLED
```

---

# Payment Status

```text
UNPAID

PAID

FAILED

REFUNDED
```

---

# Shipping Status

```text
WAITING

PROCESS

SHIPPED

DELIVERED
```

---

# User Status

```text
ACTIVE

INACTIVE
```

---

# Product Status

```text
ACTIVE

INACTIVE
```

---

# Seeder Execution

Semua seeder dijalankan menggunakan:

```bash
npx sequelize-cli db:seed:all
```

Rollback:

```bash
npx sequelize-cli db:seed:undo:all
```

---

# Development Rules

1. Seeder harus idempotent (aman dijalankan ulang setelah undo).
2. Data master (Roles, Colors, Sizes) tidak dihapus oleh aplikasi.
3. Password default wajib di-hash menggunakan bcrypt.
4. Kode voucher harus unik.
5. Warna menggunakan kode HEX standar.
6. Semua status default menggunakan nilai `ACTIVE`.

---

# Seeder Roadmap

| Order | Seeder     |
| ----- | ---------- |
| 01    | Roles      |
| 02    | Users      |
| 03    | Categories |
| 04    | Colors     |
| 05    | Sizes      |
| 06    | Banners    |
| 07    | Vouchers   |

---

# Checklist

- [ ] Roles Seeder
- [ ] Users Seeder
- [ ] Categories Seeder
- [ ] Colors Seeder
- [ ] Sizes Seeder
- [ ] Banners Seeder
- [ ] Vouchers Seeder
- [ ] Seeder Test
- [ ] Rollback Test

# Floo Ecommerce Database Relations v1.0

## Convention

### Foreign Key

- BIGINT
- Indexed

### Update Rule

```text
ON UPDATE CASCADE
```

### Delete Rule

Default

```text
ON DELETE RESTRICT
```

Kecuali disebutkan berbeda.

---

# AUTH MODULE

## Roles → Users

Relationship

```text
One Role

↓

Many Users
```

Foreign Key

```text
Users.role_id

↓

Roles.id
```

Rule

```text
ON UPDATE CASCADE

ON DELETE RESTRICT
```

---

# CATALOG MODULE

## Categories → Products

Relationship

```text
One Category

↓

Many Products
```

Foreign Key

```text
Products.category_id

↓

Categories.id
```

Rule

```text
UPDATE CASCADE

DELETE RESTRICT
```

---

## Products → ProductImages

Relationship

```text
One Product

↓

Many Images
```

Foreign Key

```text
ProductImages.product_id

↓

Products.id
```

Rule

```text
UPDATE CASCADE

DELETE CASCADE
```

Karena jika Product dihapus maka seluruh gallery ikut dihapus.

---

## Colors → ProductImages

Relationship

```text
One Color

↓

Many Images
```

Foreign Key

```text
ProductImages.color_id

↓

Colors.id
```

Nullable

```text
YES
```

Rule

```text
UPDATE CASCADE

DELETE SET NULL
```

Karena gambar produk tetap ada walaupun warna dihapus.

---

## Products → ProductVariants

Relationship

```text
One Product

↓

Many Variants
```

Foreign Key

```text
ProductVariants.product_id

↓

Products.id
```

Rule

```text
UPDATE CASCADE

DELETE CASCADE
```

---

## Colors → ProductVariants

Relationship

```text
One Color

↓

Many Variants
```

Foreign Key

```text
ProductVariants.color_id

↓

Colors.id
```

Rule

```text
UPDATE CASCADE

DELETE RESTRICT
```

---

## Sizes → ProductVariants

Relationship

```text
One Size

↓

Many Variants
```

Foreign Key

```text
ProductVariants.size_id

↓

Sizes.id
```

Rule

```text
UPDATE CASCADE

DELETE RESTRICT
```

---

# CUSTOMER MODULE

## Customers → Addresses

Relationship

```text
One Customer

↓

Many Address
```

Foreign Key

```text
Addresses.customer_id

↓

Customers.id
```

Rule

```text
UPDATE CASCADE

DELETE CASCADE
```

---

## Customers → Carts

Relationship

```text
One Customer

↓

One Cart
```

Foreign Key

```text
Carts.customer_id

↓

Customers.id
```

Unique

```text
YES
```

Rule

```text
UPDATE CASCADE

DELETE CASCADE
```

---

## Carts → CartItems

Relationship

```text
One Cart

↓

Many CartItem
```

Foreign Key

```text
CartItems.cart_id

↓

Carts.id
```

Rule

```text
UPDATE CASCADE

DELETE CASCADE
```

---

## ProductVariants → CartItems

Relationship

```text
One Variant

↓

Many CartItem
```

Foreign Key

```text
CartItems.variant_id

↓

ProductVariants.id
```

Rule

```text
UPDATE CASCADE

DELETE RESTRICT
```

---

## Customers → Wishlists

Relationship

```text
One Customer

↓

Many Wishlist
```

Foreign Key

```text
Wishlists.customer_id

↓

Customers.id
```

Rule

```text
UPDATE CASCADE

DELETE CASCADE
```

---

## Products → Wishlists

Relationship

```text
One Product

↓

Many Wishlist
```

Foreign Key

```text
Wishlists.product_id

↓

Products.id
```

Rule

```text
UPDATE CASCADE

DELETE CASCADE
```

---

# ORDER MODULE

## Customers → Orders

Relationship

```text
One Customer

↓

Many Orders
```

Foreign Key

```text
Orders.customer_id

↓

Customers.id
```

Rule

```text
UPDATE CASCADE

DELETE RESTRICT
```

---

## Addresses → Orders

Relationship

```text
One Address

↓

Many Orders
```

Foreign Key

```text
Orders.address_id

↓

Addresses.id
```

Rule

```text
UPDATE CASCADE

DELETE RESTRICT
```

---

## Orders → OrderItems

Relationship

```text
One Order

↓

Many OrderItem
```

Foreign Key

```text
OrderItems.order_id

↓

Orders.id
```

Rule

```text
UPDATE CASCADE

DELETE CASCADE
```

---

## ProductVariants → OrderItems

Relationship

```text
One Variant

↓

Many OrderItem
```

Foreign Key

```text
OrderItems.variant_id

↓

ProductVariants.id
```

Rule

```text
UPDATE CASCADE

DELETE RESTRICT
```

---

## Orders → Payments

Relationship

```text
One Order

↓

One Payment
```

Foreign Key

```text
Payments.order_id

↓

Orders.id
```

Unique

```text
YES
```

Rule

```text
UPDATE CASCADE

DELETE CASCADE
```

---

## Orders → Shipments

Relationship

```text
One Order

↓

One Shipment
```

Foreign Key

```text
Shipments.order_id

↓

Orders.id
```

Unique

```text
YES
```

Rule

```text
UPDATE CASCADE

DELETE CASCADE
```

---

# REVIEW MODULE

## Customers → Reviews

Relationship

```text
One Customer

↓

Many Reviews
```

Foreign Key

```text
Reviews.customer_id

↓

Customers.id
```

Rule

```text
UPDATE CASCADE

DELETE CASCADE
```

---

## Products → Reviews

Relationship

```text
One Product

↓

Many Reviews
```

Foreign Key

```text
Reviews.product_id

↓

Products.id
```

Rule

```text
UPDATE CASCADE

DELETE CASCADE
```

---

## Reviews → ReviewImages

Relationship

```text
One Review

↓

Many Images
```

Foreign Key

```text
ReviewImages.review_id

↓

Reviews.id
```

Rule

```text
UPDATE CASCADE

DELETE CASCADE
```

---

# SYSTEM MODULE

## Users → ActivityLogs

Relationship

```text
One User

↓

Many ActivityLogs
```

Foreign Key

```text
ActivityLogs.user_id

↓

Users.id
```

Rule

```text
UPDATE CASCADE

DELETE SET NULL
```

Karena log sebaiknya tetap tersimpan walaupun user dinonaktifkan atau dihapus.

---

## Customers → Notifications

Relationship

```text
One Customer

↓

Many Notifications
```

Foreign Key

```text
Notifications.customer_id

↓

Customers.id
```

Rule

```text
UPDATE CASCADE

DELETE CASCADE
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

Tidak boleh ada kombinasi warna dan ukuran yang sama untuk produk yang sama.

---

## Wishlist

```text
UNIQUE

customer_id
product_id
```

Satu customer hanya bisa menyimpan satu wishlist untuk satu produk.

---

## Cart Item

```text
UNIQUE

cart_id
variant_id
```

Satu varian hanya boleh muncul satu kali dalam satu cart. Jika ditambahkan lagi, sistem cukup menambah nilai `qty`.

---

## Payment

```text
UNIQUE

order_id
```

Satu order hanya memiliki satu data pembayaran aktif.

---

## Shipment

```text
UNIQUE

order_id
```

Satu order hanya memiliki satu data pengiriman aktif.

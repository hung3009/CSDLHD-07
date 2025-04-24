-- Tạo Keyspace cho hệ thống eCommerce
CREATE KEYSPACE IF NOT EXISTS ecommerce
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 3};

-- Sử dụng keyspace
USE ecommerce;

-- Bảng Quản lý Sản phẩm
CREATE TABLE IF NOT EXISTS seller_products (
    seller_id UUID,
    product_id UUID,
    name TEXT,
    description TEXT,
    price DECIMAL,
    stock INT,
    status TEXT,  -- ('available', 'out_of_stock', 'hidden')
    images LIST<TEXT>,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (seller_id, product_id)
);

-- Bảng Đơn hàng của Người Bán
CREATE TABLE IF NOT EXISTS seller_orders (
    customer_id UUID,
    order_id UUID,
    total_amount DECIMAL,
    payment_method TEXT,
    address TEXT,
    phone TEXT,
    name TEXT,
    status TEXT,  -- ('pending', 'processing', 'shipped', 'delivered', 'cancelled')
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (customer_id, order_id)
);


-- Bảng Chi tiết Đơn hàng của Người Bán
CREATE TABLE IF NOT EXISTS seller_order_items (
    seller_id UUID,
    order_id UUID,
    product_id UUID,
    quantity INT,
    price DECIMAL,
    total_price DECIMAL,
    PRIMARY KEY ((seller_id, order_id), product_id)
);

-- Bảng Quản lý Kho hàng
CREATE TABLE IF NOT EXISTS seller_inventory (
    seller_id UUID,
    product_id UUID,
    stock INT,
    restock_threshold INT,  -- Ngưỡng cảnh báo khi cần nhập hàng
    last_updated TIMESTAMP,
    PRIMARY KEY (seller_id, product_id)
);

-- Bảng Phân tích Doanh thu
CREATE TABLE IF NOT EXISTS seller_revenue (
    seller_id UUID,
    date DATE,
    total_orders INT,
    total_revenue DECIMAL,
    PRIMARY KEY (seller_id, date)
);

CREATE TABLE IF NOT EXISTS inventory_notifications (
  id UUID PRIMARY KEY,
  seller_id UUID,
  product_id UUID,
  message TEXT,
  created_at TIMESTAMP,
  is_read BOOLEAN
);


INSERT INTO seller_products (seller_id, product_id, name, description, price, stock, status, images, created_at, updated_at)
VALUES (uuid(), uuid(), 'iPhone 15 Pro Max', 'Apple iPhone 15 Pro Max - 256GB, Titan Black', 1399.99, 50, 'available', 
['https://example.com/images/iphone15pro1.jpg', 'https://example.com/images/iphone15pro2.jpg'], toTimestamp(now()), toTimestamp(now()));

INSERT INTO seller_products (seller_id, product_id, name, description, price, stock, status, images, created_at, updated_at)
VALUES (uuid(), uuid(), 'iPhone 14 Pro', 'Apple iPhone 14 Pro - 128GB, Deep Purple', 1099.99, 30, 'available', 
['https://example.com/images/iphone14pro1.jpg', 'https://example.com/images/iphone14pro2.jpg'], toTimestamp(now()), toTimestamp(now()));

INSERT INTO seller_orders (seller_id, order_id, customer_id, total_amount, status, created_at, updated_at)
VALUES (uuid(), uuid(), uuid(), 2799.98, 'processing', toTimestamp(now()), toTimestamp(now()));

INSERT INTO seller_orders (seller_id, order_id, customer_id, total_amount, status, created_at, updated_at)
VALUES (uuid(), uuid(), uuid(), 1399.99, 'pending', toTimestamp(now()), toTimestamp(now()));


INSERT INTO seller_order_items (seller_id, order_id, product_id, quantity, price, total_price)
VALUES (uuid(), uuid(), uuid(), 2, 1399.99, 2799.98);

INSERT INTO seller_order_items (seller_id, order_id, product_id, quantity, price, total_price)
VALUES (uuid(), uuid(), uuid(), 1, 1399.99, 1399.99);

INSERT INTO seller_inventory (seller_id, product_id, stock, restock_threshold, last_updated)
VALUES (uuid(), uuid(), 50, 10, toTimestamp(now()));

INSERT INTO seller_inventory (seller_id, product_id, stock, restock_threshold, last_updated)
VALUES (uuid(), uuid(), 30, 5, toTimestamp(now()));

INSERT INTO seller_revenue (seller_id, date, total_orders, total_revenue)
VALUES (uuid(), '2025-03-29', 5, 6999.95);

INSERT INTO seller_revenue (seller_id, date, total_orders, total_revenue)
VALUES (uuid(), '2025-03-28', 3, 4199.97);

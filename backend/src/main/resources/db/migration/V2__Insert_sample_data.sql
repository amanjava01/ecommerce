-- Insert admin user
INSERT INTO users (email, password_hash, enabled) VALUES 
('admin@ecommerce.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', TRUE);

INSERT INTO user_roles (user_id, role) VALUES 
(1, 'ROLE_ADMIN'),
(1, 'ROLE_USER');

INSERT INTO user_profiles (user_id, full_name, phone) VALUES 
(1, 'System Administrator', '+1234567890');

-- Insert categories
INSERT INTO categories (name, slug, parent_id, level, active) VALUES
('Electronics', 'electronics', NULL, 0, TRUE),
('Computers', 'computers', 1, 1, TRUE),
('Laptops', 'laptops', 2, 2, TRUE),
('Desktops', 'desktops', 2, 2, TRUE),
('Mobile Phones', 'mobile-phones', 1, 1, TRUE),
('Smartphones', 'smartphones', 5, 2, TRUE),
('Accessories', 'accessories', 5, 2, TRUE),
('Fashion', 'fashion', NULL, 0, TRUE),
('Men', 'men', 8, 1, TRUE),
('Women', 'women', 8, 1, TRUE),
('Clothing', 'clothing', 9, 2, TRUE),
('Shoes', 'shoes', 9, 2, TRUE),
('Home & Garden', 'home-garden', NULL, 0, TRUE),
('Furniture', 'furniture', 13, 1, TRUE),
('Kitchen', 'kitchen', 13, 1, TRUE);

-- Insert sample products
INSERT INTO products (name, slug, description, sku, price, category_id, main_image_url, active) VALUES
('MacBook Pro 16"', 'macbook-pro-16', 'Apple MacBook Pro 16-inch with M2 Pro chip', 'MBP-16-M2', 2499.00, 3, '/uploads/macbook-pro.jpg', TRUE),
('iPhone 14 Pro', 'iphone-14-pro', 'Apple iPhone 14 Pro with A16 Bionic chip', 'IPH-14-PRO', 999.00, 6, '/uploads/iphone-14-pro.jpg', TRUE),
('Samsung Galaxy S23', 'samsung-galaxy-s23', 'Samsung Galaxy S23 with Snapdragon 8 Gen 2', 'SGS-23', 799.00, 6, '/uploads/galaxy-s23.jpg', TRUE),
('Dell XPS 13', 'dell-xps-13', 'Dell XPS 13 ultrabook with Intel Core i7', 'DELL-XPS13', 1299.00, 3, '/uploads/dell-xps-13.jpg', TRUE),
('Gaming Desktop PC', 'gaming-desktop-pc', 'High-performance gaming desktop with RTX 4080', 'GAME-PC-01', 1899.00, 4, '/uploads/gaming-pc.jpg', TRUE),
('Wireless Headphones', 'wireless-headphones', 'Premium wireless noise-canceling headphones', 'WH-NC-01', 299.00, 7, '/uploads/headphones.jpg', TRUE),
('Men\'s Casual Shirt', 'mens-casual-shirt', 'Comfortable cotton casual shirt for men', 'MCS-001', 49.99, 11, '/uploads/mens-shirt.jpg', TRUE),
('Women\'s Running Shoes', 'womens-running-shoes', 'Lightweight running shoes for women', 'WRS-001', 129.99, 12, '/uploads/womens-shoes.jpg', TRUE),
('Office Chair', 'office-chair', 'Ergonomic office chair with lumbar support', 'OFC-001', 299.99, 14, '/uploads/office-chair.jpg', TRUE),
('Coffee Maker', 'coffee-maker', 'Programmable drip coffee maker', 'CM-001', 89.99, 15, '/uploads/coffee-maker.jpg', TRUE);

-- Insert inventory for products
INSERT INTO inventory (product_id, stock, reserved) VALUES
(1, 50, 0),
(2, 100, 5),
(3, 75, 2),
(4, 30, 1),
(5, 25, 0),
(6, 200, 10),
(7, 150, 5),
(8, 80, 3),
(9, 40, 2),
(10, 60, 1);

-- Insert sample reviews
INSERT INTO reviews (product_id, user_id, rating, title, body, approved) VALUES
(1, 1, 5, 'Excellent laptop!', 'The MacBook Pro is incredibly fast and the display is stunning.', TRUE),
(2, 1, 4, 'Great phone', 'Love the camera quality and performance.', TRUE),
(3, 1, 4, 'Solid Android phone', 'Good value for money with great features.', TRUE),
(6, 1, 5, 'Amazing sound quality', 'These headphones have excellent noise cancellation.', TRUE);

-- Update product ratings
UPDATE products SET average_rating = 5.0, review_count = 1 WHERE id = 1;
UPDATE products SET average_rating = 4.0, review_count = 1 WHERE id = 2;
UPDATE products SET average_rating = 4.0, review_count = 1 WHERE id = 3;
UPDATE products SET average_rating = 5.0, review_count = 1 WHERE id = 6;
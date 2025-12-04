-- SEED DATA FOR INVENTORYPREDICTOR

-- INSERT CATEGORIES
INSERT INTO categories (id, name, slug, description, image_url) VALUES
('11111111-1111-1111-1111-111111111111', 'Electronics', 'electronics', 'Smartphones, Laptops, Audio & more', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'),
('22222222-2222-2222-2222-222222222222', 'Fashion', 'fashion', 'Clothing, Shoes & Accessories', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400'),
('33333333-3333-3333-3333-333333333333', 'Home & Living', 'home-living', 'Furniture, Decor & Kitchen', 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400'),
('44444444-4444-4444-4444-444444444444', 'Sports', 'sports', 'Sports Equipment & Fitness', 'https://images.unsplash.com/photo-1461896836934- voices-of-fitness?w=400');

-- INSERT PRODUCTS - ELECTRONICS
INSERT INTO products (name, slug, description, price, original_price, brand, category_id, stock_quantity, reorder_level, images, thumbnail, rating, review_count, is_featured) VALUES
('Apple iPhone 15 Pro Max 256GB', 'iphone-15-pro-max', 'The most powerful iPhone ever. A17 Pro chip, 48MP camera system with 5x optical zoom, titanium design, Action button, and all-day battery life. Experience the future of smartphones with ProMotion display and advanced computational photography.', 159900.00, 179900.00, 'Apple', '11111111-1111-1111-1111-111111111111', 45, 10, ARRAY['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800', 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800'], 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', 4.8, 1250, true),

('Samsung Galaxy S24 Ultra 512GB', 'samsung-s24-ultra', 'Ultimate productivity with S Pen, 200MP camera, Snapdragon 8 Gen 3 processor, and Galaxy AI features. 6.8" Dynamic AMOLED display with titanium frame. Capture stunning photos day or night with advanced nightography.', 134999.00, 149999.00, 'Samsung', '11111111-1111-1111-1111-111111111111', 38, 10, ARRAY['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800'], 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400', 4.7, 890, true),

('Sony WH-1000XM5 Wireless Headphones', 'sony-wh1000xm5', 'Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling with 8 microphones. 30-hour battery life, multipoint connection, and ultra-comfortable design for all-day wear.', 29990.00, 34990.00, 'Sony', '11111111-1111-1111-1111-111111111111', 72, 15, ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'], 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 4.7, 2100, true),

('Apple MacBook Pro 14" M3 Pro', 'macbook-pro-14-m3', 'Supercharged by M3 Pro chip with 18GB unified memory. 14.2" Liquid Retina XDR display, up to 18 hours battery life, and advanced thermal architecture. Perfect for developers, designers, and creative professionals.', 199900.00, 219900.00, 'Apple', '11111111-1111-1111-1111-111111111111', 22, 8, ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'], 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 4.9, 560, true),

('LG 55" OLED C3 4K Smart TV', 'lg-oled-c3-55', 'Self-lit OLED pixels for perfect blacks and infinite contrast. α9 AI Processor 4K Gen6, Dolby Vision IQ, Dolby Atmos, and webOS 23. Gaming features include 4 HDMI 2.1 ports, VRR, and 0.1ms response time.', 129990.00, 149990.00, 'LG', '11111111-1111-1111-1111-111111111111', 15, 5, ARRAY['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800'], 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', 4.8, 678, false),

('Apple AirPods Pro 2nd Gen', 'airpods-pro-2', 'Rebuilt from the sound up with H2 chip. 2x more Active Noise Cancellation, Adaptive Transparency, and Personalized Spatial Audio. Touch control, MagSafe charging case with speaker and lanyard loop.', 24900.00, 26900.00, 'Apple', '11111111-1111-1111-1111-111111111111', 120, 25, ARRAY['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800'], 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400', 4.7, 4500, true),

('Sony PlayStation 5 Console', 'playstation-5', 'Experience lightning-fast loading, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio. 825GB SSD, 4K gaming at up to 120fps, and access to hundreds of PS5 and PS4 games.', 49990.00, 54990.00, 'Sony', '11111111-1111-1111-1111-111111111111', 8, 5, ARRAY['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800'], 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', 4.9, 3200, true),

('Samsung Galaxy Watch 6 Classic', 'galaxy-watch-6-classic', 'Premium smartwatch with rotating bezel, Super AMOLED display, and advanced health monitoring. Sleep coaching, body composition analysis, and seamless Galaxy ecosystem integration.', 34999.00, 39999.00, 'Samsung', '11111111-1111-1111-1111-111111111111', 55, 12, ARRAY['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800'], 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400', 4.5, 534, false),

-- FASHION
('Nike Air Max 270 React', 'nike-air-max-270', 'Maximum cushioning meets maximum style. React foam midsole, Max Air unit in heel, and breathable mesh upper. Perfect for all-day comfort and street-ready style. Iconic Nike design meets modern innovation.', 12995.00, 14995.00, 'Nike', '22222222-2222-2222-2222-222222222222', 85, 20, ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'], 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 4.6, 750, true),

('Adidas Ultraboost 23', 'adidas-ultraboost-23', 'Experience incredible energy return with BOOST midsole. Primeknit+ upper adapts to your foot, Continental rubber outsole provides superior grip. Designed for runners who demand the best performance and style.', 16999.00, 18999.00, 'Adidas', '22222222-2222-2222-2222-222222222222', 62, 15, ARRAY['https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800'], 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400', 4.6, 445, true),

('Nike Dri-FIT Training T-Shirt', 'nike-dri-fit-tee', 'Stay dry and comfortable during intense workouts. Dri-FIT technology wicks sweat away, breathable mesh panels, and athletic fit. Perfect for gym, running, or everyday active lifestyle.', 1995.00, 2495.00, 'Nike', '22222222-2222-2222-2222-222222222222', 200, 40, ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'], 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 4.3, 1200, false),

('Levis 501 Original Jeans', 'levis-501-original', 'The original blue jean since 1873. Button fly, straight leg, and sits at waist. Made with premium denim that gets better with every wear. An American icon that never goes out of style.', 4999.00, 5999.00, 'Levis', '22222222-2222-2222-2222-222222222222', 150, 30, ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'], 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 4.5, 890, false),

-- HOME & LIVING
('Dyson V15 Detect Vacuum', 'dyson-v15-detect', 'Reveal hidden dust with laser illumination. Piezo sensor counts and sizes particles, LCD screen shows scientific proof of clean. 60 minutes of fade-free power with anti-tangle technology.', 59990.00, 69990.00, 'Dyson', '33333333-3333-3333-3333-333333333333', 28, 8, ARRAY['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800'], 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400', 4.4, 320, true),

('Philips Air Fryer XXL', 'philips-airfryer-xxl', 'Family-sized air fryer with Rapid Air technology. Cook up to 1.4kg of fries or whole chicken. Fat Removal technology, 7 presets, and smart sensing for perfect results every time.', 14999.00, 17999.00, 'Philips', '33333333-3333-3333-3333-333333333333', 45, 12, ARRAY['https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=800'], 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400', 4.6, 567, false),

('IKEA MALM Bed Frame Queen', 'ikea-malm-bed-queen', 'Clean modern design with smooth lines. High headboard provides comfortable support for sitting up in bed. Adjustable bed sides for mattresses of different thicknesses. Easy to assemble.', 18990.00, 21990.00, 'IKEA', '33333333-3333-3333-3333-333333333333', 20, 6, ARRAY['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'], 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400', 4.3, 234, false),

-- SPORTS
('Nike Mercurial Superfly 9', 'nike-mercurial-superfly', 'Speed boot designed for the fastest players. Zoom Air unit for responsive cushioning, Flyknit upper for lockdown fit, and Aerotrak zone for ball control at high speeds.', 18995.00, 21995.00, 'Nike', '44444444-4444-4444-4444-444444444444', 35, 10, ARRAY['https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800'], 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=400', 4.7, 345, true),

('Fitbit Charge 6', 'fitbit-charge-6', 'Advanced health and fitness tracker with GPS, heart rate monitoring, SpO2, stress management, and sleep tracking. 7-day battery, water resistant to 50m, and Google integration.', 12999.00, 14999.00, 'Fitbit', '44444444-4444-4444-4444-444444444444', 88, 20, ARRAY['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800'], 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400', 4.4, 678, false),

('Yoga Mat Premium 6mm', 'yoga-mat-premium', 'Non-slip surface with alignment lines. Eco-friendly TPE material, 6mm thick for joint protection. Includes carrying strap. Perfect for yoga, pilates, and floor exercises.', 1999.00, 2499.00, 'Generic', '44444444-4444-4444-4444-444444444444', 150, 30, ARRAY['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800'], 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', 4.2, 456, false),

('Dumbbell Set 20kg Adjustable', 'dumbbell-set-20kg', 'Space-saving adjustable dumbbells from 2.5kg to 20kg. Quick-change weight system, comfortable grip, and compact design. Perfect for home gym strength training.', 8999.00, 10999.00, 'Generic', '44444444-4444-4444-4444-444444444444', 40, 10, ARRAY['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'], 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', 4.5, 234, false);

-- INSERT SAMPLE SALES DATA (last 90 days)
INSERT INTO sales_analytics (product_id, date, quantity_sold, revenue)
SELECT 
  p.id,
  generate_series(CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE, '1 day')::date,
  floor(random() * 10 + 1)::int,
  floor(random() * 10 + 1) * p.price
FROM products p;

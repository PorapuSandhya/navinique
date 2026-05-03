-- Clear existing products
DELETE FROM products;

-- Insert new products with unique, simple names and distinct specifications
INSERT INTO products (category_id, name, description, price, original_price, rating, image_url, tag)
VALUES (
  (SELECT id FROM categories WHERE slug = 'sarees' LIMIT 1),
  'Pure Cotton Saree',
  'A simple hand-loomed saree for everyday comfort. Length: 5.5 Meters. Fabric: 100% Pure Organic Cotton. Sleeves: Customizable blouse. Pattern: Plain with Border.',
  5698,
  7358,
  4.6,
  'https://images.unsplash.com/photo-1583391733958-d25e07fac044?auto=format&fit=crop&q=80&w=800',
  'Bestseller'
);
INSERT INTO products (category_id, name, description, price, original_price, rating, image_url, tag)
VALUES (
  (SELECT id FROM categories WHERE slug = 'sarees' LIMIT 1),
  'Soft Georgette Saree',
  'Lightweight and fluid georgette with a subtle sheen. Length: 5.5 Meters. Fabric: High-grade Georgette. Sleeves: Sleeveless/Half blouse options.',
  2692,
  4360,
  4.9,
  'https://images.unsplash.com/photo-1596455607563-ad6193f76b17?auto=format&fit=crop&q=80&w=800',
  'Trending'
);
INSERT INTO products (category_id, name, description, price, original_price, rating, image_url, tag)
VALUES (
  (SELECT id FROM categories WHERE slug = 'sarees' LIMIT 1),
  'Banarasi Silk Saree',
  'Rich silk with traditional gold zari patterns. Length: 5.5 Meters. Fabric: Pure Banarasi Silk. Sleeves: Full-sleeve blouse piece.',
  6209,
  9136,
  4.1,
  'https://images.unsplash.com/photo-1583391733958-d25e07fac044?auto=format&fit=crop&q=80&w=800',
  'Premium'
);

INSERT INTO products (category_id, name, description, price, original_price, rating, image_url, tag)
VALUES (
  (SELECT id FROM categories WHERE slug = 'lehengas' LIMIT 1),
  'Bridal Lehenga Set',
  'Elaborate festive wear with heavy embroidery. Skirt Length: 42 Inches. Fabric: Velvet Blend. Sleeves: Full Sleeves. Includes matching dupatta.',
  8534,
  9782,
  4.9,
  'https://images.unsplash.com/photo-1583391733958-d25e07fac044?auto=format&fit=crop&q=80&w=800',
  'Trending'
);

INSERT INTO products (category_id, name, description, price, original_price, rating, image_url, tag)
VALUES (
  (SELECT id FROM categories WHERE slug = 'kurtis' LIMIT 1),
  'Casual Cotton Kurti',
  'A neat, everyday kurti with floral prints. Length: 44 Inches. Fabric: Mulmul Cotton. Sleeves: 3/4 Sleeves.',
  3972,
  5675,
  4.3,
  'https://images.unsplash.com/photo-1621335829175-95f437384d7c?auto=format&fit=crop&q=80&w=800',
  'Bestseller'
);
INSERT INTO products (category_id, name, description, price, original_price, rating, image_url, tag)
VALUES (
  (SELECT id FROM categories WHERE slug = 'kurtis' LIMIT 1),
  'Linen Straight Kurti',
  'Simple linen kurti for office or casual outings. Length: 46 Inches. Fabric: Pure Linen. Sleeves: Half Sleeves.',
  2747,
  3961,
  4.5,
  'https://images.unsplash.com/photo-1589465885857-44edb59bbff2?auto=format&fit=crop&q=80&w=800',
  NULL
);

INSERT INTO products (category_id, name, description, price, original_price, rating, image_url, tag)
VALUES (
  (SELECT id FROM categories WHERE slug = 'kids-wear' LIMIT 1),
  'Kids Ethnic Set',
  'Comfortable Kurta and Pyjama set for little ones. Length: 22 Inches. Fabric: Cotton Silk. Sleeves: Full Sleeves. Age: 2-4 Years.',
  4899,
  7766,
  4.1,
  'https://images.unsplash.com/photo-1519238396253-3c561ccffcc2?auto=format&fit=crop&q=80&w=800',
  'Bestseller'
);
INSERT INTO products (category_id, name, description, price, original_price, rating, image_url, tag)
VALUES (
  (SELECT id FROM categories WHERE slug = 'kids-wear' LIMIT 1),
  'Little Sherwani Set',
  'Grand festive sherwani for young boys. Length: 24 Inches. Fabric: Brocade Silk. Sleeves: Full Sleeves. Age: 4-6 Years.',
  6142,
  7670,
  4.1,
  'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=800',
  'Trending'
);

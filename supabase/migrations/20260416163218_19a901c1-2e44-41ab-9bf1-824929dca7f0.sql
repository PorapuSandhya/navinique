
-- Update categories with real clothing images
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1614886137085-5a0e95bcc4e3?w=600&h=800&fit=crop' WHERE slug = 'sarees';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=600&h=800&fit=crop' WHERE slug = 'lehengas';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=800&fit=crop' WHERE slug = 'kurtis';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1543263936-d54865d4f696?w=600&h=800&fit=crop' WHERE slug = 'kids-wear';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=800&fit=crop' WHERE slug = 'accessories';

-- Update products with real clothing images
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1614886137085-5a0e95bcc4e3?w=600&h=800&fit=crop' WHERE name = 'Royal Blue Silk Saree';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop' WHERE name = 'Maroon Silk Saree';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=800&fit=crop' WHERE name = 'Pink Embroidered Kurti';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1583391733981-4840e98cd4f0?w=600&h=800&fit=crop' WHERE name = 'Yellow Festive Kurti';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=600&h=800&fit=crop' WHERE name = 'Green Bridal Lehenga';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1610117238527-2b18a4fbe1e1?w=600&h=800&fit=crop' WHERE name = 'Red Bridal Lehenga';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1543263936-d54865d4f696?w=600&h=800&fit=crop' WHERE name = 'Kids Anarkali Set';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=800&fit=crop' WHERE name = 'Gold Temple Necklace';

-- Update gallery images with real photos
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1610117238527-2b18a4fbe1e1?w=800&h=800&fit=crop' WHERE title = 'Bridal Collection';
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1614886137085-5a0e95bcc4e3?w=800&h=800&fit=crop' WHERE title = 'Silk Sarees';
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1583391733981-4840e98cd4f0?w=800&h=800&fit=crop' WHERE title = 'Festive Kurtis';
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop' WHERE title = 'Ethnic Accessories';
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1543263936-d54865d4f696?w=800&h=800&fit=crop' WHERE title = 'Kids Ethnic Wear';
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=800&h=800&fit=crop' WHERE title = 'Designer Lehengas';

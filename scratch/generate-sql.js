import fs from 'fs';

const imagePool = {
  'sarees': [
    'https://images.unsplash.com/photo-1610030469983-98e550d615ef?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1583391733958-d25e07fac044?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1596455607563-ad6193f76b17?auto=format&fit=crop&q=80&w=800'
  ],
  'lehengas': [
    'https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1583391733958-d25e07fac044?auto=format&fit=crop&q=80&w=800'
  ],
  'kurtis': [
    'https://images.unsplash.com/photo-1589465885857-44edb59bbff2?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1621335829175-95f437384d7c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&q=80&w=800'
  ],
  'kids-wear': [
    'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1519238396253-3c561ccffcc2?auto=format&fit=crop&q=80&w=800'
  ],
  'accessories': [
    'https://images.unsplash.com/photo-1599643478524-fb524458bc59?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=800'
  ]
};

const fabricTypes = ['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Banarasi', 'Organza', 'Linen'];
const tags = ['New', 'Bestseller', 'Trending', 'Limited Edition', 'Premium'];

const categories = [
  { id: '286d944c-35cd-4f6c-81ba-73f8a0029b39', name: 'Sarees', slug: 'sarees' },
  { id: 'bbd4a2b9-e13d-4c3e-b7a4-3151ebf676b9', name: 'Lehengas', slug: 'lehengas' },
  { id: '85e05423-f2cc-4168-a3f2-111111111111', name: 'Kurtis', slug: 'kurtis' }, // We need the actual IDs, I'll use a subquery in SQL
];

// Instead of hardcoding category IDs, let's use a subquery to match category slug
let sql = `-- Clear existing products
DELETE FROM products;

-- Insert new products
`;

for (const slug of Object.keys(imagePool)) {
  const catName = slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ');
  
  for (let i = 1; i <= 7; i++) {
    const pool = imagePool[slug];
    const imageUrl = pool[i % pool.length];
    const fabric = fabricTypes[i % fabricTypes.length];
    const tag = tags[i % tags.length];
    const name = `Authentic ${fabric} ${catName} - Edition ${i}`;
    const description = `Experience the luxury of real ${fabric} with this exquisite ${catName.toLowerCase()}. Handcrafted with decent and premium fabric, perfect for modern elegance. Unedited, authentic quality directly from the weavers.`;
    const price = Math.floor(Math.random() * 5000) + 1500;
    const originalPrice = price + Math.floor(Math.random() * 2000) + 1000;
    const rating = (Math.random() * 1 + 4).toFixed(1);
    const tagVal = i % 3 === 0 ? 'NULL' : `'${tag}'`;

    sql += `INSERT INTO products (category_id, name, description, price, original_price, rating, image_url, tag)
VALUES (
  (SELECT id FROM categories WHERE slug = '${slug}' LIMIT 1),
  '${name}',
  '${description.replace(/'/g, "''")}',
  ${price},
  ${originalPrice},
  ${rating},
  '${imageUrl}',
  ${tagVal}
);\n`;
  }
}

fs.writeFileSync('scratch/seed.sql', sql);
console.log('Generated scratch/seed.sql');

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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

async function run() {
  console.log('Fetching categories...');
  const { data: categories, error: catError } = await supabase.from('categories').select('*');
  
  if (catError) {
    console.error('Error fetching categories', catError);
    return;
  }

  if (!categories || categories.length === 0) {
    console.error('No categories found. Cannot seed products without categories.');
    return;
  }

  console.log('Deleting old products...');
  // Delete all products
  const { error: delError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (delError) {
    console.error('Error deleting products', delError);
  } else {
    console.log('Old products cleared.');
  }

  const productsToInsert = [];

  for (const category of categories) {
    console.log(`Generating products for ${category.name} (${category.slug})...`);
    
    // Create 7 products for each category
    for (let i = 1; i <= 7; i++) {
      const pool = imagePool[category.slug] || imagePool['sarees'];
      const imageUrl = pool[i % pool.length];
      const fabric = fabricTypes[(i + category.id.charCodeAt(0)) % fabricTypes.length];
      const tag = tags[i % tags.length];
      
      productsToInsert.push({
        category_id: category.id,
        name: `Authentic ${fabric} ${category.name} - Edition ${i}`,
        description: `Experience the luxury of real ${fabric} with this exquisite ${category.name.toLowerCase()}. Handcrafted with decent and premium fabric, perfect for modern elegance. Unedited, authentic quality directly from the weavers.`,
        price: Math.floor(Math.random() * 5000) + 1500, // 1500 to 6500
        original_price: Math.floor(Math.random() * 2000) + 7000,
        rating: (Math.random() * 1 + 4).toFixed(1), // 4.0 to 5.0
        image_url: imageUrl,
        tag: i % 3 === 0 ? null : tag,
      });
    }
  }

  console.log(`Inserting ${productsToInsert.length} new products...`);
  const { error: insertError } = await supabase.from('products').insert(productsToInsert);
  
  if (insertError) {
    console.error('Error inserting products', insertError);
  } else {
    console.log(`Successfully seeded ${productsToInsert.length} realistic products!`);
  }
}

run();

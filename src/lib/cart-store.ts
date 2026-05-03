import { supabase } from "@/integrations/supabase/client";

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let sid = localStorage.getItem("cart_session_id");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("cart_session_id", sid);
  }
  return sid;
}

export type CartItem = {
  id: string;
  product_id: string;
  quantity: number;
  size?: string;
  color?: string;
  product: {
    id: string;
    name: string;
    price: number;
    original_price: number | null;
    image_url: string | null;
  };
};

function getCartMeta() {
  if (typeof window === "undefined") return {};
  const meta = localStorage.getItem("cart_item_meta");
  return meta ? JSON.parse(meta) : {};
}

function setCartMeta(cartItemId: string, size: string, color: string) {
  const meta = getCartMeta();
  meta[cartItemId] = { size, color };
  localStorage.setItem("cart_item_meta", JSON.stringify(meta));
}

export async function getCartItems(): Promise<CartItem[]> {
  const sid = getSessionId();
  const { data, error } = await supabase
    .from("cart_items")
    .select("id, product_id, quantity, products(id, name, price, original_price, image_url)")
    .eq("session_id", sid);

  if (error) throw error;
  
  const meta = getCartMeta();
  
  return (data || []).map((item: any) => ({
    id: item.id,
    product_id: item.product_id,
    quantity: item.quantity,
    size: meta[item.id]?.size,
    color: meta[item.id]?.color,
    product: item.products,
  }));
}

export async function addToCart(productId: string, quantity = 1, size?: string, color?: string) {
  const sid = getSessionId();
  
  // Fetch ALL rows for this product in this session
  const { data: existingRows } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("session_id", sid)
    .eq("product_id", productId);

  const meta = getCartMeta();
  
  // Find a row that matches BOTH product_id AND the specific size/color
  const matchingRow = (existingRows || []).find(row => {
    const rowMeta = meta[row.id];
    return rowMeta?.size === size && rowMeta?.color === color;
  });

  let cartItemId;
  if (matchingRow) {
    // Increment quantity for the matching variant
    await supabase
      .from("cart_items")
      .update({ quantity: matchingRow.quantity + quantity })
      .eq("id", matchingRow.id);
    cartItemId = matchingRow.id;
  } else {
    // Create a NEW row for this specific variant
    const { data: newItem } = await supabase
      .from("cart_items")
      .insert({ session_id: sid, product_id: productId, quantity })
      .select("id")
      .single();
    cartItemId = newItem?.id;
  }

  if (cartItemId && size && color) {
    setCartMeta(cartItemId, size, color);
  }
}

export async function updateCartQuantity(cartItemId: string, quantity: number) {
  if (quantity <= 0) {
    await supabase.from("cart_items").delete().eq("id", cartItemId);
    const meta = getCartMeta();
    delete meta[cartItemId];
    localStorage.setItem("cart_item_meta", JSON.stringify(meta));
  } else {
    await supabase.from("cart_items").update({ quantity }).eq("id", cartItemId);
  }
}

export async function removeFromCart(cartItemId: string) {
  await supabase.from("cart_items").delete().eq("id", cartItemId);
  const meta = getCartMeta();
  delete meta[cartItemId];
  localStorage.setItem("cart_item_meta", JSON.stringify(meta));
}

export async function clearCart() {
  const sid = getSessionId();
  await supabase.from("cart_items").delete().eq("session_id", sid);
  localStorage.removeItem("cart_item_meta");
}

export { getSessionId };

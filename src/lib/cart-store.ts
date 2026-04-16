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
  product: {
    id: string;
    name: string;
    price: number;
    original_price: number | null;
    image_url: string | null;
  };
};

export async function getCartItems(): Promise<CartItem[]> {
  const sid = getSessionId();
  const { data, error } = await supabase
    .from("cart_items")
    .select("id, product_id, quantity, products(id, name, price, original_price, image_url)")
    .eq("session_id", sid);

  if (error) throw error;
  return (data || []).map((item: any) => ({
    id: item.id,
    product_id: item.product_id,
    quantity: item.quantity,
    product: item.products,
  }));
}

export async function addToCart(productId: string, quantity = 1) {
  const sid = getSessionId();
  // Check if already in cart
  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("session_id", sid)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("cart_items")
      .insert({ session_id: sid, product_id: productId, quantity });
  }
}

export async function updateCartQuantity(cartItemId: string, quantity: number) {
  if (quantity <= 0) {
    await supabase.from("cart_items").delete().eq("id", cartItemId);
  } else {
    await supabase.from("cart_items").update({ quantity }).eq("id", cartItemId);
  }
}

export async function removeFromCart(cartItemId: string) {
  await supabase.from("cart_items").delete().eq("id", cartItemId);
}

export async function clearCart() {
  const sid = getSessionId();
  await supabase.from("cart_items").delete().eq("session_id", sid);
}

export { getSessionId };

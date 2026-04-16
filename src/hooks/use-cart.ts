import { useState, useEffect, useCallback } from "react";
import { getCartItems, addToCart, updateCartQuantity, removeFromCart, clearCart, type CartItem } from "@/lib/cart-store";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const data = await getCartItems();
      setItems(data);
      setCartCount(data.reduce((sum, i) => sum + i.quantity, 0));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = async (productId: string, qty = 1) => {
    await addToCart(productId, qty);
    await refresh();
  };

  const update = async (cartItemId: string, qty: number) => {
    await updateCartQuantity(cartItemId, qty);
    await refresh();
  };

  const remove = async (cartItemId: string) => {
    await removeFromCart(cartItemId);
    await refresh();
  };

  const clear = async () => {
    await clearCart();
    await refresh();
  };

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return { items, loading, cartCount, total, add, update, remove, clear, refresh };
}

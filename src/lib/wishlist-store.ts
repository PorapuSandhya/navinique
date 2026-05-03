
export function getWishlistItems(): string[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("wishlist");
  return stored ? JSON.parse(stored) : [];
}

export function toggleWishlist(productId: string) {
  const items = getWishlistItems();
  const index = items.indexOf(productId);
  let newItems;
  if (index > -1) {
    newItems = items.filter(id => id !== productId);
  } else {
    newItems = [...items, productId];
  }
  localStorage.setItem("wishlist", JSON.stringify(newItems));
  window.dispatchEvent(new Event("wishlist-updated"));
  return index === -1; // returns true if added, false if removed
}

export function isInWishlist(productId: string): boolean {
  return getWishlistItems().includes(productId);
}

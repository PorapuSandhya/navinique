import sareeBlue from "@/assets/prod-saree-blue.jpg";
import sareeMaroon from "@/assets/prod-saree-maroon.jpg";
import kurtiPink from "@/assets/prod-kurti-pink.jpg";
import kurtiYellow from "@/assets/prod-kurti-yellow.jpg";
import lehengaGreen from "@/assets/prod-lehenga-green.jpg";
import lehengaRed from "@/assets/prod-lehenga-red.jpg";
import kidsAnarkali from "@/assets/prod-kids-anarkali.jpg";
import necklace from "@/assets/prod-necklace.jpg";

export const PRODUCT_IMAGES: Record<string, string> = {
  "Royal Blue Silk Saree": sareeBlue,
  "Maroon Silk Saree": sareeMaroon,
  "Pink Embroidered Kurti": kurtiPink,
  "Yellow Festive Kurti": kurtiYellow,
  "Green Bridal Lehenga": lehengaGreen,
  "Red Bridal Lehenga": lehengaRed,
  "Kids Anarkali Set": kidsAnarkali,
  "Gold Temple Necklace": necklace,
};

export function resolveProductImage(name: string, fallback?: string | null) {
  return PRODUCT_IMAGES[name] || fallback || "https://placehold.co/600x800?text=Product";
}

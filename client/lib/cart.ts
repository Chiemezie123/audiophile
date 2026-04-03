import { getProductBySlug, type Product } from "@/lib/catalog";

export function getCartProducts(
  items: Array<{ productSlug: string; quantity: number }>
) {
  return items
    .map((item) => {
      const product = getProductBySlug(item.productSlug);
      if (!product) {
        return null;
      }

      return {
        product,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity,
      };
    })
    .filter(
      (
        item
      ): item is {
        product: Product;
        quantity: number;
        lineTotal: number;
      } => Boolean(item)
    );
}

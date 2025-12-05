import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Product Details | InventoryPredictor',
  description: 'View product details and add to cart',
};

// Redirect to product listing if no product ID is provided
export default function ProductDetailsPage() {
  redirect('/product-listing');
}

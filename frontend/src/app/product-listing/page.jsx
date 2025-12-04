import { getProducts } from '@/lib/supabase';
import ProductListingInteractive from './components/ProductListingInteractive';

export const metadata = {
  title: 'Shop All Products | InventoryPredictor',
  description: 'Browse our complete collection of products',
};

// Transform database product to UI format
function transformProduct(product) {
  const discount = product.original_price 
    ? Math.round((1 - product.price / product.original_price) * 100) 
    : 0;
  
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.original_price || product.price,
    image: product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    alt: product.name,
    rating: product.rating || 0,
    reviewCount: product.review_count || 0,
    inStock: product.stock_quantity > 0,
    discount,
    category: product.categories?.name || 'General',
    brand: product.brand || 'Brand',
    addedDate: product.created_at,
  };
}

export default async function ProductListingPage() {
  // Fetch products from Supabase
  const { data: products } = await getProducts();
  const transformedProducts = (products || []).map(transformProduct);
  
  return <ProductListingInteractive initialProducts={transformedProducts} />;
}

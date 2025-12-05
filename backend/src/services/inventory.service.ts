import { supabase } from '../config/database';

// Mock inventory data
const mockInventory = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    stock_quantity: 45,
    reorder_level: 10,
    price: 2999,
    category_id: 1,
    category: 'Electronics',
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    brand: 'AudioTech',
    is_active: true
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    stock_quantity: 23,
    reorder_level: 15,
    price: 4999,
    category_id: 1,
    category: 'Electronics',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    brand: 'FitTech',
    is_active: true
  },
  {
    id: 3,
    name: 'Organic Cotton T-Shirt',
    stock_quantity: 67,
    reorder_level: 20,
    price: 899,
    category_id: 2,
    category: 'Fashion',
    thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    brand: 'EcoWear',
    is_active: true
  },
  {
    id: 4,
    name: 'Modern Table Lamp',
    stock_quantity: 12,
    reorder_level: 15,
    price: 1599,
    category_id: 3,
    category: 'Home & Living',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    brand: 'LightCraft',
    is_active: true
  },
  {
    id: 5,
    name: 'Gaming Mouse',
    stock_quantity: 3,
    reorder_level: 10,
    price: 1299,
    category_id: 1,
    category: 'Electronics',
    thumbnail: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    brand: 'GameTech',
    is_active: true
  }
];

class InventoryService {
  async getAllInventory(params: { lowStock?: boolean; limit?: number; offset?: number }) {
    const { lowStock, limit = 50, offset = 0 } = params;

    if (supabase) {
      let query = supabase
        .from('products')
        .select('id, name, slug, stock_quantity, reorder_level, price, category_id, thumbnail, brand')
        .eq('is_active', true)
        .order('stock_quantity', { ascending: true });

      if (lowStock) {
        query = query.lt('stock_quantity', 10);
      }

      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }

    // Use mock data
    let filteredData = [...mockInventory];
    
    if (lowStock) {
      filteredData = filteredData.filter(item => item.stock_quantity < 10);
    }
    
    filteredData.sort((a, b) => a.stock_quantity - b.stock_quantity);
    
    return filteredData.slice(offset, offset + limit);
  }

  async getInventoryById(id: string) {
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw new Error(`Product not found: ${id}`);
      return data;
    }

    // Use mock data
    const product = mockInventory.find(item => item.id === parseInt(id));
    if (!product) throw new Error(`Product not found: ${id}`);
    return product;
  }

  async updateInventory(params: { productId: string; qtyChange: number }) {
    const { productId, qtyChange } = params;

    if (supabase) {
      const { data: product } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', productId)
        .single();

      if (!product) throw new Error(`Product not found: ${productId}`);

      const newQty = Math.max(0, product.stock_quantity + qtyChange);

      const { data, error } = await supabase
        .from('products')
        .update({ stock_quantity: newQty })
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    // Use mock data (simulate update)
    const productIndex = mockInventory.findIndex(item => item.id === parseInt(productId));
    if (productIndex === -1) throw new Error(`Product not found: ${productId}`);
    
    const product = mockInventory[productIndex];
    const newQty = Math.max(0, product.stock_quantity + qtyChange);
    mockInventory[productIndex] = { ...product, stock_quantity: newQty };
    
    return mockInventory[productIndex];
  }

  async getLowStockItems() {
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .lt('stock_quantity', 10)
        .eq('is_active', true)
        .order('stock_quantity', { ascending: true });

      if (error) throw error;
      return data || [];
    }

    // Use mock data
    return mockInventory
      .filter(item => item.stock_quantity < 10)
      .sort((a, b) => a.stock_quantity - b.stock_quantity);
  }

  async getInventoryStats() {
    if (supabase) {
      try {
        // Simplified query without complex joins
        const { data: products, error } = await supabase
          .from('products')
          .select('stock_quantity, reorder_level, price, name, category_id')
          .eq('is_active', true);

        if (error) {
          console.error('Inventory stats error:', error);
          throw error;
        }

        const total = products?.length || 0;
        const lowStock = products?.filter(p => p.stock_quantity <= (p.reorder_level || 10)).length || 0;
        const outOfStock = products?.filter(p => p.stock_quantity === 0).length || 0;
        const criticalStock = products?.filter(p => p.stock_quantity <= 5).length || 0;
        
        // Calculate real total inventory value
        const totalValue = products?.reduce((sum, product) => {
          return sum + (product.price * product.stock_quantity);
        }, 0) || 0;

        // Calculate average product value
        const averageValue = total > 0 ? Math.round(totalValue / total) : 0;

        // Calculate additional metrics
        const highValueProducts = products?.filter(p => p.price > 50000).length || 0;
        const premiumInventoryValue = products?.filter(p => p.price > 50000)
          .reduce((sum, p) => sum + (p.price * p.stock_quantity), 0) || 0;

        return {
          total,
          lowStock,
          outOfStock,
          criticalStock,
          totalValue: Math.round(totalValue),
          averageValue,
          topCategory: 'Electronics',
          totalProducts: total,
          highValueProducts,
          premiumInventoryValue: Math.round(premiumInventoryValue)
        };
      } catch (error) {
        console.error('Error fetching inventory stats:', error);
        throw error;
      }
    }

    return {
      total: 5,
      lowStock: 1,
      outOfStock: 0,
      totalValue: 333250,
      criticalStock: 1,
      averageValue: 66650,
      topCategory: 'Electronics',
      totalProducts: 5
    };
  }
}

export default new InventoryService();

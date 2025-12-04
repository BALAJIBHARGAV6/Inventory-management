import { supabase } from '../config/database';

class InventoryService {
  async getAllInventory(params: { lowStock?: boolean; limit?: number; offset?: number }) {
    const { lowStock, limit = 50, offset = 0 } = params;

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

  async getInventoryById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(`Product not found: ${id}`);
    return data;
  }

  async updateInventory(params: { productId: string; qtyChange: number }) {
    const { productId, qtyChange } = params;

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

  async getLowStockItems() {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .lt('stock_quantity', 10)
      .eq('is_active', true)
      .order('stock_quantity', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getInventoryStats() {
    const { data: products } = await supabase
      .from('products')
      .select('stock_quantity, reorder_level')
      .eq('is_active', true);

    if (!products) return { total: 0, lowStock: 0, outOfStock: 0 };

    return {
      total: products.length,
      lowStock: products.filter((p: { stock_quantity: number }) => p.stock_quantity > 0 && p.stock_quantity < 10).length,
      outOfStock: products.filter((p: { stock_quantity: number }) => p.stock_quantity === 0).length,
    };
  }
}

export default new InventoryService();

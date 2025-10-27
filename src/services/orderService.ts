import { supabase } from '../lib/supabase';
import { Order, ShippingAddress } from '../types';

export const orderService = {
  async createOrder(
    userId: string,
    items: Array<{ product_id: string; product_name: string; product_image: string; quantity: number; price: number }>,
    totalAmount: number,
    shippingAddress: ShippingAddress
  ): Promise<Order> {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        status: 'pending',
        shipping_address: shippingAddress,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    for (const item of items) {
      const { error: stockError } = await supabase.rpc('decrement_stock', {
        product_id: item.product_id,
        quantity: item.quantity,
      });

      if (stockError) {
        console.error('Stock update failed:', stockError);
      }
    }

    return order;
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('id', orderId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getAllOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getOrderStats(): Promise<{ totalOrders: number; totalRevenue: number; pendingOrders: number }> {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('total_amount, status');

    if (error) throw error;

    const totalOrders = orders?.length || 0;
    const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
    const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;

    return { totalOrders, totalRevenue, pendingOrders };
  },
};

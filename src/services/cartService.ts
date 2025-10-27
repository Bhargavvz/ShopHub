import { supabase } from '../lib/supabase';
import { CartItem } from '../types';

export const cartService = {
  async getCartItems(userId: string): Promise<CartItem[]> {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  },

  async addToCart(userId: string, productId: string, quantity: number): Promise<CartItem> {
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select(`
          *,
          product:products(*)
        `)
        .single();

      if (error) throw error;
      return data;
    }

    const { data, error } = await supabase
      .from('cart_items')
      .insert({
        user_id: userId,
        product_id: productId,
        quantity,
      })
      .select(`
        *,
        product:products(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async updateCartItemQuantity(cartItemId: string, quantity: number): Promise<CartItem> {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .select(`
        *,
        product:products(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async removeFromCart(cartItemId: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) throw error;
  },

  async clearCart(userId: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  },
};

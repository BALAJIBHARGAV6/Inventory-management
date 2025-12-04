'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext({
  cart: [],
  cartCount: 0,
  cartTotal: 0,
  isLoading: false,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem('inventory_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart data:', error);
        localStorage.removeItem('inventory_cart');
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('inventory_cart', JSON.stringify(cart));
    }
  }, [cart, mounted]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const addToCart = async (product, quantity = 1) => {
    if (!product || !product.id) {
      console.error('Invalid product data');
      return;
    }

    setIsLoading(true);
    
    try {
      // Optimistically update UI
      setCart((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { 
          ...product, 
          quantity,
          addedAt: new Date().toISOString()
        }];
      });

      // TODO: Add backend API call here
      // await fetch('/api/cart/add', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ productId: product.id, quantity })
      // });

      console.log(`Added ${quantity}x "${product.name}" to cart`);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Revert optimistic update on error
      setCart((prev) => prev.filter(item => !(item.id === product.id && item.addedAt)));
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!productId) return;

    setIsLoading(true);
    
    try {
      const removedItem = cart.find(item => item.id === productId);
      setCart((prev) => prev.filter((item) => item.id !== productId));

      // TODO: Add backend API call here
      // await fetch(`/api/cart/remove/${productId}`, { method: 'DELETE' });

      console.log(`Removed "${removedItem?.name}" from cart`);
      
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Revert on error - could re-add the item
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setIsLoading(true);
    
    try {
      setCart((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );

      // TODO: Add backend API call here
      // await fetch('/api/cart/update', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ productId, quantity })
      // });
      
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    
    try {
      setCart([]);
      
      // TODO: Add backend API call here
      // await fetch('/api/cart/clear', { method: 'DELETE' });
      
      console.log('Cart cleared');
      
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{ 
        cart, 
        cartCount, 
        cartTotal,
        isLoading, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

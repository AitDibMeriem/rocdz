import { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  laptopId: number;
  title: string;
  price: number;
  qty: number;
  imageUrl?: string | null;
  brand?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (laptopId: number) => void;
  updateQty: (laptopId: number, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("rocdz_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("rocdz_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.laptopId === item.laptopId);
      if (existing) {
        return prev.map(i => i.laptopId === item.laptopId ? { ...i, qty: i.qty + item.qty } : i);
      }
      return [...prev, item];
    });
  };

  const removeItem = (laptopId: number) => {
    setItems(prev => prev.filter(i => i.laptopId !== laptopId));
  };

  const updateQty = (laptopId: number, qty: number) => {
    if (qty <= 0) { removeItem(laptopId); return; }
    setItems(prev => prev.map(i => i.laptopId === laptopId ? { ...i, qty } : i));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

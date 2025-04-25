import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { useLoading } from "../hooks/useLoading";
import { Plus, Minus, Trash2 } from "lucide-react";

interface CartItem {
  _id: string;
  product_id: string;
  user_id: string;
  quantity: number;
  price: number;
  total_price: number;
  image: string;
  name: string;
  seller_id: string;
}

interface CartContextType {
  cartItems: CartItem[];
  fetchCart: () => void;
}

export const CartContext = createContext<CartContextType>({
    cartItems: [],
    fetchCart: () => {}
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const {setLoading} = useLoading()

  const fetchCart = async () => {
    try {
        setLoading(true)
      const userId = localStorage.getItem("id");
      if (!userId) return;

      const response = await axiosInstance.get(`/cart/list/${userId}`);
      setCartItems(response.data.cartItems);
      setLoading(false)
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

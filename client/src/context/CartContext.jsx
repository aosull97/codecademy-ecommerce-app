import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import PropTypes from "prop-types";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { currentUser, signedIn } = useAuth();

  const fetchCart = useCallback(async () => {
    if (currentUser?.email) {
      try {
        const response = await axios.get(
          `http://localhost:3000/cart/${currentUser.email}`
        );
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  }, [currentUser?.email]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product) => {
    if (!signedIn) {
      alert("Please sign in to add items to your cart.");
      return;
    }
    try {
      await axios.post("http://localhost:3000/cart", {
        ...product,
        email: currentUser.email,
      });
      await fetchCart(); // Re-fetch cart to update state
      alert(`${product.product} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart.");
    }
  };

  const removeFromCart = async (productName) => {
    if (!currentUser?.email) return;
    try {
      await axios.delete(
        `http://localhost:3000/cart/${
          currentUser.email
        }/${encodeURIComponent(productName)}`
      );
      await fetchCart(); // Re-fetch cart
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    fetchCart,
    cartItemCount: cartItems.map((item) => item.quantity).reduce((a, b) => a + b, 0),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
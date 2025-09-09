import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { cartItems, removeFromCart, fetchCart } = useCart();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    fetchCart();
  }, [currentUser?.email, fetchCart]);

    const goToCheckout = () => {
      navigate("/checkout")
    }

  const changeQuantity = (itemId, newQuantity) => {
    if (!itemId) {
      console.error("Cannot change quantity without an item ID.");
      return;
    }

    if (newQuantity <= 0) {
      const itemToRemove = cartItems.find((item) => item.id === itemId);
      if (itemToRemove) {
        removeFromCart(itemToRemove.product);
      }
      return;
    }
    axios
      .put(`http://localhost:3000/cart/${itemId}`, {
        quantity: newQuantity,
      })
      .then(() => {
        fetchCart(); // Re-fetch to update the cart state
      })
      .catch((error) => {
        console.error(`Error changing quantity for item ${itemId}:`, error);
      });
  };

  return (
    <div className="absolute inset-y-28 overflow-x-hidden right-6 w-1/4 overflow-scroll border-2 border-coffee grid grid-cols-1 gap-y-8 justify-items-center rounded-md p-4 bg-almond m--3">
        <div>
            <h1 className="text-xl antialiased font-garamond font-semibold text-center p-1 underline">Cart</h1>
        </div>
        
        {cartItems.length != 0 ? cartItems.map(
            (cartItem) => 
                <div key={cartItem.id} className="w-52 font-garamond">
                <img
                  src={cartItem.img}
                  className="w-52 h-52 rounded-sm border-2 border-camel"
                />
                <div className="flex flex-col items-center">
                  <div className="font-semibold text-base">{cartItem.product}</div>
                  <div className="pt-1">£{cartItem.price}</div>
                  <div className="pb-1 flex">
                    <button onClick={() => changeQuantity(cartItem.id, cartItem.quantity - 1)} className="pr-2">-</button>
                    <div>Quantity: {cartItem.quantity}</div>
                    <button onClick={() => changeQuantity(cartItem.id, cartItem.quantity + 1)} className="pl-2">+</button>
                    </div>
                  <button onClick={() => removeFromCart(cartItem.product)}  className="border-2 px-1 border-orange-50 rounded-md hover:bg-orange-50">Remove</button>
                </div>
              </div>
        )
        :
        <div>
          <p className="font-garamond">No items in cart</p>
        </div>
        }

      {cartItems.length != 0 ? <div className="pt-4">
          <button onClick={goToCheckout} className="font-garamond text-xl border-2 border-coffee px-1 rounded-md bg-camel hover:bg-orange-50">Go to checkout</button>
        </div> : null }
        
        
        </div>
  )
}

export default Cart
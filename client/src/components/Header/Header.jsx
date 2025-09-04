import SignInButton from "../Sign In/SignInButton"
import PropTypes from 'prop-types';
import CartButton from "../Cart/CartButton";
import WishListButton from "../WishList/WishListButton";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const Header = ({ prevLocation, productId }) => {
  const [numberOfCartItems, setNumberOfCartItems] = useState(0)

    const { signedIn, currentUser } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get(`http://localhost:3000/cart/${currentUser?.email}`)
      .then((response) => {
        setNumberOfCartItems(response.data.map(item => item.quantity).reduce((a, b) => a + b, 0) )
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if(!signedIn & numberOfCartItems > 0) {
    axios.delete(`http://localhost:3000/cart`)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('Error deleting cart:', error);
    });
  }
 
  return (
    <div className="flex w-screen justify-between items-center mb-4 pt-4 pb-2">
      <div>
        <h1 className="text-6xl antialiased font-gwendolyn font-extrabold text-left  ml-4">
          Alice`s Antiques
        </h1>
      </div>
      <div className="mr-10 flex space-x-4 border-2 content-center h-10">
        <CartButton numberOfCartItems={numberOfCartItems} />
        {signedIn ? 
        <WishListButton /> : null}
        <SignInButton prevLocation={prevLocation} productId={productId}/>
      </div>
    </div>
  );
}

Header.propTypes = {
  prevLocation: PropTypes.string,
  productId: PropTypes.number
  };

export default Header;
import SignInButton from "../Sign In/SignInButton";
import PropTypes from "prop-types";
import CartButton from "../Cart/CartButton";
import WishListButton from "../WishList/WishListButton";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Header = ({ prevLocation, productId }) => {
  const { signedIn } = useAuth();
  const { cartItemCount } = useCart();
  axios.defaults.withCredentials = true;

  return (
    <div className="flex w-screen justify-between items-center mb-4 pt-4 pb-2">
      <div>
        <h1 className="text-6xl antialiased font-gwendolyn font-extrabold text-left  ml-4">
          Alice`s Antiques
        </h1>
      </div>
      <div className="mr-10 flex space-x-4 border-2 content-center h-10">
        <CartButton numberOfCartItems={cartItemCount} />
        {signedIn ? <WishListButton /> : null}
        <SignInButton prevLocation={prevLocation} productId={productId} />
      </div>
    </div>
  );
};

Header.propTypes = {
  prevLocation: PropTypes.string,
  productId: PropTypes.number,
};

export default Header;

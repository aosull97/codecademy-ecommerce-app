import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { useAuth } from "../../context/AuthContext";

const SignInButton = ({ prevLocation, productId }) => {

  const navigate = useNavigate();
  const { signedIn, signOut } = useAuth();

 const handleClick = () => {
     if (signedIn) {
       signOut();
       navigate('/');
     } else {
       navigate("/login", {
           state: { prevLocation: prevLocation, productId: productId },
         });
   }
 };

  return (
    <div>
        <button
          className="border-2 p-1 rounded-lg font-garamond font-semibold border-almond hover:bg-almond"
          onClick={handleClick}
        >
         {signedIn ? 'Log Out' : 'Sign In'}
        </button>
    </div>
  );

}

SignInButton.propTypes = {
  prevLocation: PropTypes.string,
  productId: PropTypes.number
  };

export default SignInButton
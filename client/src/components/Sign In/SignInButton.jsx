import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

const SignInButton = ({signedIn, prevLocation, productId}) => {

  const navigate = useNavigate();


 const handleClick = () => {
   {
     signedIn
       ? navigate(-1)
       : navigate("/login", {
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
  signedIn: PropTypes.bool,
  prevLocation: PropTypes.string,
  productId: PropTypes.number
  };

export default SignInButton
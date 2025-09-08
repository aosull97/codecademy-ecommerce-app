import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../context/AuthContext";
import AccountButton from "../Account/AccountButton";

const SignInButton = ({ prevLocation, productId }) => {
  const navigate = useNavigate();
  const { signedIn } = useAuth();

  const handleClick = () => {
    if (signedIn) {
      null;
    } else {
      navigate("/login", {
        state: { prevLocation: prevLocation, productId: productId },
      });
    }
  };

  return (
    <div>
      {signedIn ? (
        <AccountButton />
      ) : (
        <button
          className="border-2 p-1 rounded-lg font-garamond font-semibold border-almond hover:bg-almond"
          onClick={handleClick}
        >
          Sign In
        </button>
      )}
    </div>
  );
};

SignInButton.propTypes = {
  prevLocation: PropTypes.string,
  productId: PropTypes.number,
};

export default SignInButton;

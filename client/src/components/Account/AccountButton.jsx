import { MdAccountCircle } from "react-icons/md";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AccountButton = () => {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleAccountClick = () => {
    setAccountMenuOpen(!accountMenuOpen);
  };

  return (
    <div className="">
      <button onClick={handleAccountClick} className="">
        <MdAccountCircle size={37} className="text-camel -mt-0.5 -ml-1" />
      </button>
      {accountMenuOpen ? (
        <div className="bg-orange-50 border-2 border-coffee rounded-md p-2 absolute right-5 w-32 text-center font-garamond text-camel space-y-2 shadow-lg flex flex-col">
          <button
            onClick={() => {
              setAccountMenuOpen(false);
              navigate("/orders");
            }}
            className="hover:underline hover:text-coffee"
          >
            Orders
          </button>
          <button
            onClick={signOut}
            className="hover:underline hover:text-coffee"
          >
            Log Out
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default AccountButton;

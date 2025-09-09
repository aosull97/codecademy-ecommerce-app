import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { currentUser } = useAuth();
  axios.defaults.withCredentials = true;

  const fetchOrders = () => {
    setIsLoading(true);
    if (currentUser?.email) {
      axios
        .get(`http://localhost:3000/orders/${currentUser.email}`)
        .then((response) => {
          setOrders(response.data);
        })
        .catch((error) => {
          console.error("Error fetching users orders:", error);
          setOrders([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setOrders([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentUser?.email]);

  return (
    <div className="bg-orange-50 h-screen font-garamond">
      <div className="pt-10 pl-6">
        <Link
          to={-1}
          className="inline-flex items-center border-2 border-camel py-1 rounded-md text-camel hover:text-coffee hover:bg-camel hover:border-coffee"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 16 24"
            stroke="currentColor"
            className="h-5 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            ></path>
          </svg>
          <span className="ml-1 pr-1.5 font-bold text-md">Back</span>
        </Link>
      </div>
      <div>
        <h1 className="text-3xl antialiased text-coffee font-semibold text-center p-4 underline">
          Your Orders
        </h1>
      </div>
      {isLoading ? (
        <div>
          <p className="font-garamond p-28 text-center">
            Loading your orders...
          </p>
        </div>
      ) : orders.length > 0 ? (
        <div className="px-4 sm:px-6 lg:px-8">
          <table className="w-full divide-y divide-coffee">
            <thead className="bg-almond">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Order</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.map((orderItem) => (
                <tr key={orderItem.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {orderItem.created_at.slice(0, 10)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{orderItem.order}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">£{orderItem.order_price}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{orderItem.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <p className="font-garamond p-28 text-center">
            You have no orders yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default Orders;

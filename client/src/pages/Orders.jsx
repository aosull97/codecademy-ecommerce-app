import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const { currentUser } = useAuth();

  const fetchOrders = () => {
    if (currentUser?.email) {
      axios
        .get(`http://localhost:3000/orders/${currentUser.email}`)
        .then((response) => {
          setOrders(response.data);
        })
        .catch((error) => {
          console.error("Error fetching users orders:", error);
          setOrders([]);
        });
    } else {
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentUser?.email]);

  console.log(orders);

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
      {orders.length != 0 ? (
        <div className="flex justify-between p-28">
          <div className="flex flex-col">
            <p className="font-semibold pb-4">Date</p>
            {orders.length != 0
              ? orders.map((orderItem) => (
                  <div key={orderItem.id} className="">
                    <div className="pb-2 mb-4 ">
                      <p>{orderItem.created_at.slice(0, 10)}</p>
                    </div>
                  </div>
                ))
              : null}
          </div>
          <div className="flex flex-col">
            <p className="font-semibold pb-4">Order</p>
            {orders.length != 0
              ? orders.map((orderItem) => (
                  <div key={orderItem.id} className="">
                    <div className="pb-2 mb-4 ">
                      <p>{orderItem.order}</p>
                    </div>
                  </div>
                ))
              : null}
          </div>
          <div className="flex flex-col">
            <p className="font-semibold pb-4">Price</p>
            {orders.length != 0
              ? orders.map((orderItem) => (
                  <div key={orderItem.id} className="">
                    <div className="pb-2 mb-4 ">
                      <p>£{orderItem.order_price}</p>
                    </div>
                  </div>
                ))
              : null}
          </div>
          <div className="flex flex-col">
            <p className="font-semibold pb-4">Status</p>
            {orders.length != 0
              ? orders.map((orderItem) => (
                  <div key={orderItem.id} className="">
                    <div className="pb-2 mb-4 ">
                      <p>{orderItem.status}</p>
                    </div>
                  </div>
                ))
              : null}
          </div>
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

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"

const Checkout = () => {

    const [checkoutItems, setCheckoutItems] = useState([])
    const [deliveryTotal, setDeliveryTotal] = useState(3.95)
    const [subtotal, setSubtotal] = useState(0)
    const [total, setTotal] = useState(0)

    const { currentUser } = useAuth();

    useEffect(() => {
      const interval = setInterval(() => {
        axios.get(`http://localhost:3000/cart/${currentUser?.email}`)
        .then((response) => {
          setCheckoutItems(response.data)
        })
      }, 1000)
      return () => clearInterval(interval)
    }, [])

    const removeCheckoutItem = (productName, userEmail) => {
      if (!productName || !userEmail) {
        console.error("Cannot remove item without itemId or user email.");
        return;
      }
      // Use encodeURIComponent to handle special characters in product names
      axios.delete(`http://localhost:3000/cart/${userEmail}/${encodeURIComponent(productName)}`)
      .then(response => {
        console.log(response.data);
        // Correctly filter the local state by product name
        setCheckoutItems(prevItems => prevItems.filter(item => item.product !== productName));
      })
      .catch(error => {
        console.error('Error deleting cart item:', error);
      });
    }
    
   const deliverySelected = () => {
        if(document.getElementById("standard").checked) {
            setDeliveryTotal(3.95)
        } else if(document.getElementById("express").checked) {
            setDeliveryTotal(5.65)
        }
   }

   const calculateSubtotal = () => {

    let totalArray = []
    let sum = 0

    for(let i = 0; i < checkoutItems.length; i++) {
        let itemQuantity = checkoutItems[i].quantity
        let itemPrice = checkoutItems[i].price
        let itemTotal = itemQuantity * itemPrice
        totalArray.push(itemTotal)
    }

    for(let y = 0; y < totalArray.length; y++) {
        sum += totalArray[y];
    }

    setSubtotal(sum)
   }

   const calculateTotal = () => {
    setTotal(deliveryTotal + subtotal)
   }

   useEffect(() => {
    calculateSubtotal(),
    deliverySelected(),
    calculateTotal()
   })


   const createOrder = (price, email) => {
    const data = {
        order_price: price,
        order: checkoutItems.map(item => item.product).join(", "),
        email: email
    }

    console.log(data)

    axios.post('http://localhost:3000/orders', data)
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error('Error creating order:', error);
    });
   }




  return (
    <div className="font-garamond min-h-screen bg-orange-50">
      <div className="p-4">
      <a
        href="/"
        className="inline-flex items-center border-2 border-camel py-1 rounded-md text-camel hover:bg-white"
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
      </a>
      </div>
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        <div className="px-4 pt-8">
          <p className="text-xl font-medium">Order Summary</p>
          <p className="text-gray-800">
            Check your items. And select a suitable shipping method.
          </p>
          <div className="mt-8 space-y-3 rounded-lg bg-white px-2 py-4 sm:px-6">
            {checkoutItems.map((checkoutItem) => (
              <div key={checkoutItem.id} className="font-garamond flex">
                <img
                  src={checkoutItem.img}
                  className="w-32 h-32  rounded-sm border-2 border-camel"
                />
                <div className="flex flex-col pl-4">
                  <div className="font-semibold text-base">
                    {checkoutItem.product}
                  </div>
                  <div className="pt-1">£{checkoutItem.price}</div>
                  <div className="pb-1">Quantity: {checkoutItem.quantity}</div>
                  <button
                    onClick={() => removeCheckoutItem(checkoutItem.product, currentUser?.email)}
                    className="border-2 px-1 border-orange-50 rounded-md hover:bg-orange-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-lg font-medium ">Shipping Methods</p>
          <form className="mt-5 grid gap-6">
            <div className="relative">
              <input
                className="peer hidden"
                id="standard"
                type="radio"
                name="radio"
                defaultChecked
              />
              <span className="peer-checked:border-camel absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-white bg-inherit"></span>
              <label
                className="peer-checked:border-2 peer-checked:border-camel peer-checked:bg-white flex cursor-pointer select-none rounded-lg border-2 border-white p-4"
                htmlFor="standard"
              >
                <img
                  className="w-14 object-contain"
                  src="/images/naorrAeygcJzX0SyNI4Y0.png"
                  alt=""
                />
                <div className="ml-5">
                  <span className="mt-2 font-semibold">
                    Standard Delivery £3.95
                  </span>
                  <p className="text-slate-500 text-sm leading-6">
                    Delivery: 3-5 Days
                  </p>
                </div>
              </label>
            </div>
            <div className="relative">
              <input
                className="peer hidden"
                id="express"
                type="radio"
                name="radio"
              />
              <span className="peer-checked:border-camel absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-white bg-inherit"></span>
              <label
                className="peer-checked:border-2 peer-checked:border-camel peer-checked:bg-white flex cursor-pointer select-none rounded-lg border-2 border-white p-4"
                htmlFor="express"
              >
                <img
                  className="w-14 object-contain"
                  src="/images/oG8xsl3xsOkwkMsrLGKM4.png"
                  alt=""
                />
                <div className="ml-5">
                  <span className="mt-2 font-semibold">
                    Express Delivery £5.65
                  </span>
                  <p className="text-slate-500 text-sm leading-6">
                    Delivery: 1-2 Days
                  </p>
                </div>
              </label>
            </div>
          </form>
        </div>
        <div className="mt-10 rounded-lg bg-white px-4 pt-8 lg:mt-0">
          <p className="text-xl font-medium">Payment Details</p>
          <p className="text-gray-800">
            Complete your order by providing your payment details.
          </p>
          <div className="">
            <label
              htmlFor="email"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Email
            </label>
            <div className="relative">
              <input
                type="text"
                id="email"
                name="email"
                className="w-full rounded-md border border-gray-300 px-4 py-3 pl-11 text-sm outline-almond "
                placeholder="your.email@gmail.com"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
            </div>
            <label
              htmlFor="card-holder"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Card Holder
            </label>
            <div className="relative">
              <input
                type="text"
                id="card-holder"
                name="card-holder"
                className="w-full rounded-md border border-gray-300 px-4 py-3 pl-11 text-sm uppercase shadow-sm outline-almond"
                placeholder="Your full name here"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                  />
                </svg>
              </div>
            </div>
            <label
              htmlFor="card-no"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Card Details
            </label>
            <div className="flex">
              <div className="relative w-7/12 flex-shrink-0">
                <input
                  type="text"
                  id="card-no"
                  name="card-no"
                  className="w-full rounded-md border border-gray-300 px-2 py-3 pl-11 text-sm shadow-sm outline-almond"
                  placeholder="xxxx-xxxx-xxxx-xxxx"
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1z" />
                    <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm13 2v5H1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm-1 9H2a1 1 0 0 1-1-1v-1h14v1a1 1 0 0 1-1 1z" />
                  </svg>
                </div>
              </div>
              <input
                type="text"
                name="credit-expiry"
                className="w-full rounded-md border border-gray-300 px-2 py-3 text-sm shadow-sm outline-almond"
                placeholder="MM/YY"
              />
              <input
                type="text"
                name="credit-cvc"
                className="w-1/6 flex-shrink-0 rounded-md border border-gray-300 px-2 py-3 text-sm shadow-sm outline-almond"
                placeholder="CVC"
              />
            </div>
            <label
              htmlFor="billing-address"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Billing Address
            </label>
            <div className="flex flex-col sm:flex-row">
              <div className="relative flex-shrink-0 sm:w-7/12">
                <input
                  type="text"
                  id="billing-address"
                  name="billing-address"
                  className="w-full rounded-md border border-gray-300 px-4 py-3 pl-11 text-sm shadow-sm outline-almond"
                  placeholder="Street Address"
                />
              </div>
              <select
                type="text"
                name="billing-state"
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm outline-almond focus:z-10 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="State">State</option>
              </select>
              <input
                type="text"
                name="billing-zip"
                className="flex-shrink-0 rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm outline-almond sm:w-1/6 focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Postcode"
              />
            </div>

            <div className="mt-6 border-t border-b py-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Subtotal</p>
                <p className="font-semibold text-gray-900">£{subtotal}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Shipping</p>
                <p className="font-semibold text-gray-900">£{deliveryTotal}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Total</p>
              <p className="text-2xl font-semibold text-gray-900">£{total}</p>
            </div>
          </div>
          <button 
            onClick={() => createOrder(total, currentUser?.email)}
            className="mt-4 mb-8 w-full rounded-md bg-camel px-6 py-3 font-medium text-white">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout
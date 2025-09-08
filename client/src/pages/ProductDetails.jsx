import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header/Header";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const ProductDetails = () => {
  const { signedIn, currentUser } = useAuth();
  axios.defaults.withCredentials = true;

  const [product, setProduct] = useState([]);

  const { productId } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:3000/products/${productId}`).then((res) => {
      setProduct(res.data[0]);
    }).catch(error => console.error("Error fetching product details:", error));
  }, [productId]); // Add productId to the dependency array

  const addItemToCart = (name, price, img, quantity, email) => {
    if (signedIn) {
      const data = {
        product: name,
        price: price,
        img: img,
        quantity: quantity,
        email: email,
      };
      console.log(data);
      axios.post("http://localhost:3000/cart", data).then((response) => {
        console.log(response.status);
      });
    } else {
      alert("Sign in to add item to cart");
    }
  };

  const addItemToWishlist = (name, price, img, email) => {
    if (signedIn) {
      const data = {
        product: name,
        price: price,
        img: img,
        email: email,
      };
      console.log(data);
      axios.post("http://localhost:3000/wishlist", data).then((response) => {
        console.log(response.status);
      });
    } else {
      alert("Sign in to add item to wishlist");
    }
  };

  return (
    <div className="bg-orange-50 h-screen font-garamond">
      <div>
        <Header prevLocation={"/productdetails"} productId={product.id} />
      </div>

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

      <div className="flex pt-14 justify-center">
        <div className="p-5">
          <img
            src={product.image_url}
            className="w-[32rem] h-[32rem] rounded-sm border-2 border-camel"
          />
        </div>
        <div className="my-5 p-4 w-2/6 bg-almond">
          <h1 className="font-semibold text-4xl pt-2">{product.name}</h1>
          <p className="font-bold text-xl pt-4">£{product.price}</p>
          <p className="pt-4 ">{product.description}</p>
          <p className="pt-1">{product.extra_details}</p>
          <p className="pt-4">Colour: {product.colour}</p>

          <div className="flex mt-14 items-center">
            <div className="p-1 w-4/5 h-8 bg-camel text-center text-sm rounded-lg text-almond hover:shadow-lg">
              <button
                onClick={() =>
                  addItemToCart(
                    product.name,
                    product.price,
                    product.image_url,
                    1,
                    currentUser?.email
                  )
                }
              >
                Add To Cart
              </button>
            </div>
            <div className="px-4 h-8 w-8">
              <div className="bg-orange-50 h-8 w-8 border-camel border-2 text-camel pt-0.5 pl-0.5 rounded-full hover:shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#C19A6B"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                  onClick={() =>
                    addItemToWishlist(
                      product.name,
                      product.price,
                      product.image_url,
                      currentUser?.email
                    )
                  }
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

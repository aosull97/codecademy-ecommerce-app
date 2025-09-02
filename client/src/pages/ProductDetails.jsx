import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header/Header";
import WishListButton from "../components/WishList/WishListButton";
import PropTypes from 'prop-types';

const ProductDetails = () => {

    const location = useLocation();

    const signedIn = location.state;

    console.log(signedIn)

    ProductDetails.propTypes = {
        signedIn: PropTypes.node.isRequired,
        };

    const [product, setProduct] = useState([]);
   
    const {productId} = useParams();

    useEffect(() => {
        axios.get(`http://localhost:3000/products/${productId}`)
          .then((res) => {
            setProduct(res.data[0]);
          })
      }, [])

      console.log(product)

      const addItemToCart = (name, price, img, quantity) => {

        if(signedIn) {

        const data = {
          product: name,
          price: price,
          img: img, 
          quantity: quantity
    
      }
        console.log(data)
        axios.post("http://localhost:3000/cart", data).then((response) => {
          console.log(response.status)
        }
      )

    } else {
        alert("Sign in to add item to cart")
    }
    
    }

    const addItemToWishlist = (name, price, img) => {

        if(signedIn) {

        const data = {
          product: name,
          price: price,
          img: img
    
      }
        console.log(data)
        axios.post("http://localhost:3000/wishlist", data).then((response) => {
          console.log(response.status)
        }
      )

    } else {
        alert("Sign in to add to your wish list")
    }
    
    }
        
        
        
  return (
    <div className="bg-orange-50 h-screen font-garamond">
      <div>
        <Header signedIn={signedIn} prevLocation={'/productdetails'} productId={product.id}/>
      </div>

      <div className="pt-10 pl-6">
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
                    1
                  )
                }
              >
                Add To Cart
              </button>
            </div>
            <div className="px-4 h-8 w-8">
              <button
                onClick={() =>
                  addItemToWishlist(
                    product.name,
                    product.price,
                    product.image_url
                  )
                }
              >
                <WishListButton />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails
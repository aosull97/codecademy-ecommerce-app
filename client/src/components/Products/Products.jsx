import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Products = ({category}) => {
  const [products, setProducts] = useState([]);
  const { signedIn, currentUser } = useAuth();

  console.log(currentUser?.email)

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const result = await fetch(`http://localhost:3000/products`);
    result
      .json()
      .then((result) => setProducts(result))
      .catch((e) => console.log(e));
  };

  const addItemToCart = (name, price, img, quantity, email) => {

    if(signedIn) {

    const data = {
      product: name,
      price: price,
      img: img, 
      quantity: quantity,
      email: email,

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


  return category !== "All" ? (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 overflow-auto auto-rows-auto gap-y-8 justify-items-center border-2 rounded-md border-almond m-4 p-4 bg-almond">
        {products.map(
          (product) =>
            product.category == category && (
              <div key={product.id} className="w-52 font-garamond">
                <img
                  src={product.image_url}
                  className="w-52 h-52 rounded-sm border-2 border-camel"
                />
                <Link to={"/products/" + product.id }><div className="font-semibold text-base hover:underline cursor-pointer">{product.name}</div></Link>
                <div className="text-sm">{product.description}</div>
                <div className="pt-1">£{product.price}</div>
                <button onClick={() => addItemToCart(product.name, product.price, product.image_url, 1, currentUser?.email)} className="border-2 hover:shadow-lg transition-shadow border-camel mt-2 px-1 text-sm bg-orange-50 rounded-md">Add</button>
              </div>
            )
        )}
      </div>
    </div>
  ) : (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 overflow-auto auto-rows-auto gap-y-8 justify-items-center border-2 rounded-md border-almond m-4 p-4 bg-almond">
      {products.map((product) => (
        <div key={product.id} className="w-52 font-garamond">
          <img
            src={product.image_url}
            className="w-52 h-52 rounded-sm border-2 border-camel"
          />
          <Link to={`/products/${product.id}`}>
          <div className="font-semibold text-base hover:underline cursor-pointer">{product.name}</div>
          </Link>
          <div className="text-sm">{product.description}</div>
          <div className="pt-1">£{product.price}</div>
          <button onClick={() => addItemToCart(product.name, product.price, product.image_url, 1, currentUser?.email)} className="border-2 hover:shadow-lg transition-shadow border-camel mt-2 px-1 text-sm bg-orange-50 rounded-md">Add</button>
        </div>
      ))}
    </div>
  ); 

}

Products.propTypes = {
  category: PropTypes.node.isRequired,
  signedIn: PropTypes.bool
  };




export default Products;
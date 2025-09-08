import { useEffect, useState } from "react"
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const WishList = () => {

    const [wishlistItems, setWishlistItems] = useState([])

    const { currentUser, signedIn } = useAuth();
    axios.defaults.withCredentials = true;

     const fetchWishlistItems = () => {
      if (currentUser?.email) {
        axios.get(`http://localhost:3000/wishlist/${currentUser.email}`)
          .then((response) => {
            setWishlistItems(response.data);
          })
          .catch(error => {
            console.error('Error fetching cart:', error);
            setWishlistItems([]);
          });
      } else {
        setWishlistItems([]);
      }
    };

    useEffect(() => {
      fetchWishlistItems();
    }, [currentUser?.email])


    const removeWishListItem = (productName, userEmail) => {
        if(signedIn) {
      if (!productName || !userEmail) {
        console.error("Cannot remove item without itemId or user email.");
        return;
      }
      // Use encodeURIComponent to handle special characters in product names
      axios.delete(`http://localhost:3000/wishlist/${userEmail}/${encodeURIComponent(productName)}`)
      .then(response => {
        console.log(response.data);
        // Correctly filter the local state by product name
        setWishlistItems(prevItems => prevItems.filter(item => item.product !== productName));
      })
      .catch(error => {
        console.error('Error deleting wish list item:', error);
      });
    } else {
        alert("Sign in to remove item from wish list")
    }}



    

  return (
    <div className="absolute inset-y-28 overflow-x-hidden right-6 w-1/4 overflow-scroll border-2 border-coffee grid grid-cols-1 gap-y-8 justify-items-center rounded-md p-4 bg-almond m--3">
        <div>
            <h1 className="text-xl antialiased font-garamond font-semibold text-center p-1 underline">Wish List</h1>
        </div>
        
        {wishlistItems.length != 0 ? wishlistItems.map(
            (wishListItem) => 
                <div key={wishListItem.id} className="w-52 font-garamond">
                <img
                  src={wishListItem.img}
                  className="w-52 h-52 rounded-sm border-2 border-camel"
                />
                <div className="flex flex-col items-center">
                  <div className="font-semibold text-base">{wishListItem.product}</div>
                  <div className="pt-1">£{wishListItem.price}</div>
                  <button onClick={() => removeWishListItem(wishListItem.product, currentUser?.email)}  className="border-2 px-1 border-orange-50 rounded-md hover:bg-orange-50">Remove</button>
                </div>
              </div>
        )
        :
        <div>
          <p className="font-garamond">No items in wish list</p>
        </div>
        }

        </div>
  )
}

export default WishList;
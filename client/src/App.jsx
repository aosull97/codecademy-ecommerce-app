import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import ProductDetails from "./pages/ProductDetails";


function App() {

  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/products/:productId" element={<ProductDetails />} />
      </Routes>
  );
}
export default App;
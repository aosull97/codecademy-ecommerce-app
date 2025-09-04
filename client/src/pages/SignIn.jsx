import { useState, useEffect } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";
import SocialSignIn from "../components/Sign In/SocialSignIn";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignIn = () => {

  const location = useLocation();
  const prevLocation = location.state?.prevLocation;
  const prevProductId = location.state?.productId;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:3000/users");

      let matchingUser = response.data.find((user) => user.email === email);

      if (matchingUser) {
        const userHashedPassword =  matchingUser.pwd_hash;
        bcrypt.compare(password, userHashedPassword, (err, isMatch) => {
          if (err) {
            throw err;
          } else if (isMatch) {
            setCurrentUser(matchingUser);
          } else {
            console.log("Password is incorrect")
            alert("Incorrect credentials")
          }
        })
      } else {
        console.log("Incorrect email")
        alert("This email is not registered")
      }

    } catch (error) {
      console.log(error);
    }
  };

  const { setCurrentUser, signedIn } = useAuth();

  useEffect(() => {
    if (signedIn) {
      if (prevLocation === '/productdetails' && prevProductId) {
        navigate(`/products/${prevProductId}`, { replace: true });
      } else {
        navigate(prevLocation || '/', { replace: true });
      }
    }
  }, [signedIn, navigate, prevLocation, prevProductId]);

  return (
    <div className="bg-orange-50 font-garamond">
      
      <a href="/"
        className="inline-flex items-center border-2 border-camel py-1 rounded-md text-camel hover:bg-white m-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 24" stroke="currentColor" className="h-5 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18">
            </path>
        </svg>
        <span className="ml-1 pr-1.5 font-bold text-md">Back</span>
      </a>
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4 -mt-4">
        <div className="max-w-md w-full">
          <div className="p-8 rounded-2xl bg-white shadow">
            <h2 className="text-gray-800 text-center text-2xl font-bold">
              Sign in
            </h2>
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="text-gray-800 text-sm mb-2 block"
                >
                  Email
                </label>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="email"
                    id="email"
                    required
                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-almond"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-gray-800 text-sm mb-2 block"
                >
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type="password"
                    id="password"
                    required
                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-almond"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="!mt-8">
                <button
                  type="submit"
                  className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-camel hover:bg-orange-100 focus:outline-none"
                >
                  Sign in
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-100 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
              <SocialSignIn />
              <p className="text-gray-800 text-sm !mt-8 text-center">
                Dont have an account?{" "}
                <a
                  href="/register"
                  className="text-camel hover:underline ml-1 whitespace-nowrap font-semibold"
                >
                  Register here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

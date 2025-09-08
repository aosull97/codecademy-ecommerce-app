import { useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"

const Register = () => {
    const navigate = useNavigate()
    axios.defaults.withCredentials = true;

    const [userInfo, setUserInfo] = useState({
        fullName: '',
        email: '',
        password: ""
    });
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleInput = (e) => {
        e.persist();
        setUserInfo({...userInfo, [e.target.name]: e.target.value})
    }

    const saveUser = async (e) => {
          e.preventDefault()

          if (userInfo.password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
          }

          const data = {
              full_name: userInfo.fullName,
              email: userInfo.email,
              password: userInfo.password // Send the plain password
          }
          try {
            await axios.post(`http://localhost:3000/users`, data);
            alert('User Added');
            navigate("/login");
          } catch (error) {
            console.error("Registration failed:", error.response?.data || error.message);
            alert("Registration failed. The email might already be in use.");
          }

      }
      
    

  return (
    <div className="bg-orange-50 font-garamond">
    <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
      <div className="max-w-md w-full">

        <div className="p-8 rounded-2xl bg-white shadow">
          <h2 className="text-gray-800 text-center text-2xl font-bold">Register</h2>
          <form className="mt-8 space-y-4" onSubmit={saveUser}>
            <div>
              <div className="relative flex items-center">
                <input name="fullName" type="text" required value={userInfo.fullName} onChange={handleInput} className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-almond" placeholder="Full Name" />
              </div>
            </div>

            <div>
              <div className="relative flex items-center">
                <input name="email" type="email" required value={userInfo.email} onChange={handleInput} className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-almond" placeholder="Email" />
              </div>
            </div>

            <div>
              <div className="relative flex items-center">
                <input name="password" type="password" required value={userInfo.password} onChange={handleInput} className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-almond" placeholder="Password" />
              </div>
            </div>

            <div>
              <div className="relative flex items-center">
                <input name="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-almond" placeholder="Confirm password" />
              </div>
            </div>

            <div className="!mt-8">
              <button type="submit" className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-camel hover:bg-orange-100 focus:outline-none">
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Register
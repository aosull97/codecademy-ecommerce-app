import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // To prevent rendering children before check is complete

  axios.defaults.withCredentials = true;

  const checkSession = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/check-session');
      if (response.data.user) {
        setCurrentUser(response.data.user);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Not authenticated');
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const signOut = async () => {
    try {
      await axios.get('http://localhost:3000/logout');
      setCurrentUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = { currentUser, setCurrentUser, signedIn: !!currentUser, signOut };

  // Render children only after the initial session check is complete
  return (
    <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
  );
};
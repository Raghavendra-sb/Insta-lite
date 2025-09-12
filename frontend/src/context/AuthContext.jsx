import React, { createContext, useState, useEffect } from 'react';
import { loginUser, logoutUser, registerUser, setAuthToken } from '../api/auth';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to decode JWT (simplified, for actual use, consider a robust library or backend validation)
  const decodeJwt = (token) => {
    try {
      // Tokens are typically base64 encoded JSON.
      // Split the token into its parts (header, payload, signature)
      const base64Url = token.split('.')[1];
      // Replace non-url-safe characters and decode
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Failed to decode JWT:", e);
      return null;
    }
  };

  useEffect(() => {
    const loadUserFromToken = () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const decoded = decodeJwt(token);
        // In a real app, you'd verify this token with the backend
        // For this example, we're trusting the token structure (which is risky client-side)
        if (decoded && decoded._id) { // Assuming _id exists in the payload
          setUser({
            _id: decoded._id,
            username: decoded.username, // Assuming username is in payload
            role: decoded.role || 'user', // Assuming role is in payload, default to 'user'
          });
          setAuthToken(token); // Set token for future API calls
        } else {
          localStorage.removeItem('accessToken');
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUserFromToken();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      const res = await loginUser(credentials);
      // The backend sets HttpOnly cookies for accessToken and refreshToken.
      // We might still get accessToken in the body for immediate client-side use if desired.
      const accessTokenFromResponse = res.data.accessToken;
      if (accessTokenFromResponse) {
        localStorage.setItem('accessToken', accessTokenFromResponse);
        setAuthToken(accessTokenFromResponse); // Set for API calls
        const decoded = decodeJwt(accessTokenFromResponse);
        setUser({
          _id: decoded._id,
          username: decoded.username,
          role: decoded.role || 'user',
        });
        toast.success(res.message);
      } else {
        // If accessToken isn't in response body, we might rely solely on httpOnly cookies
        // or need a /current-user endpoint to fetch user details.
        // For this demo, let's assume it's returned.
        console.warn("Access token not found in login response body. Relying on cookie.");
        // As a fallback, try to refetch user info if token is only in cookie
        // (This would require another API endpoint, e.g., /users/me)
        toast.success(res.message);
      }
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      const errorMessage = err.message || err.data?.message || 'Login failed';
      toast.error(errorMessage);
      throw errorMessage;
    }
  };

  const handleRegister = async (formData) => {
    try {
      setLoading(true);
      const res = await registerUser(formData);
      // After registration, typically the user is logged in or redirected to login
      // For now, let's just show a success message and don't automatically log in.
      toast.success(res.message);
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      const errorMessage = err.message || err.data?.message || 'Registration failed';
      toast.error(errorMessage);
      throw errorMessage;
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      localStorage.removeItem('accessToken');
      setAuthToken(null); // Clear token from axios headers
      setUser(null);
      toast.success('Logged out successfully');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const errorMessage = err.message || err.data?.message || 'Logout failed';
      toast.error(errorMessage);
      throw errorMessage;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login: handleLogin, logout: handleLogout, register: handleRegister }}>
      {children}
    </AuthContext.Provider>
  );
};
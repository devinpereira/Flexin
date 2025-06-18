import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const OAuthSuccess = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser } = useContext(UserContext);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const userData = searchParams.get('user');

    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));

        // Store token and update user context
        localStorage.setItem('token', token);
        updateUser(user);

        // Check if there's a redirect destination
        const redirectPath = sessionStorage.getItem('redirectAfterLogin');

        if (redirectPath) {
          sessionStorage.removeItem('redirectAfterLogin');
          navigate(redirectPath);
        } else {
          navigate('/calculators');
        }
      } catch (err) {
        setError('Failed to process authentication data');
        console.error(err);
        setTimeout(() => navigate('/auth/login'), 2000);
      }
    } else {
      setError('Authentication failed');
      setTimeout(() => navigate('/auth/login'), 2000);
    }
  }, [location, navigate, updateUser]);

  return <p>{error || "Logging in..."}</p>;
};

export default OAuthSuccess;

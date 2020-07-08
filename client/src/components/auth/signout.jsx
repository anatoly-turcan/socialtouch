import React, { useContext, useEffect } from 'react';
import UserContext from './../../context/userContext';
import api from '../../services/apiService';

const Signout = () => {
  console.log('signOUT');

  useEffect(() => {
    const sendSignoutRequest = async () => {
      try {
        localStorage.removeItem('user');
        await api.signout();
        window.location = '/';
      } catch (error) {}
    };

    sendSignoutRequest();
  }, []);

  return <div className="global-loader">Loading...</div>;
};

export default Signout;

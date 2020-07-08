import React, { useEffect, useContext } from 'react';
import api from '../../services/apiService';
import UserContext from './../../context/userContext';

const Signout = ({ history }) => {
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const sendSignoutRequest = async () => {
      try {
        await api.signout();
        setUser(null);
        history.replace('/signin');
      } catch (error) {}
    };

    sendSignoutRequest();
  }, []);

  return <div className="global-loader">Loading...</div>;
};

export default Signout;

import React, { useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import UserContext from '../../context/userContext';
import { signout } from '../../services/apiService';

const Signout = ({ history }) => {
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const sendSignoutRequest = async () => {
      try {
        await signout();
        setUser(null);
        history.replace('/signin');
      } catch ({ response }) {
        if (response) toast.error(response.data.message);
      }
    };

    sendSignoutRequest();
  }, []);

  return <div className="global-loader">Loading...</div>;
};

export default Signout;

import { useContext, useEffect } from 'react';
import UserContext from './../../context/userContext';
import auth from '../../services/authService';

const Signout = () => {
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const sendSignoutRequest = async () => {
      try {
        await auth.signout();
        localStorage.removeItem('user');
        setUser(null);
      } catch (error) {}
    };

    sendSignoutRequest();
  });

  return null;
};

export default Signout;

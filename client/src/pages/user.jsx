import React, { useContext } from 'react';
import UserContext from '../context/userContext';

const User = () => {
  const { user } = useContext(UserContext);

  return (
    <div>
      {user.username}
      {user.link}
      {user.img && user.img.location}
    </div>
  );
};

export default User;

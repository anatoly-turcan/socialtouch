import React, { useContext } from 'react';
import UserContext from './../context/userContext';

const UserPage = () => {
  const { user } = useContext(UserContext);

  return (
    <div>
      {user.username}
      {user.link}
      {user.img.location}
    </div>
  );
};

export default UserPage;

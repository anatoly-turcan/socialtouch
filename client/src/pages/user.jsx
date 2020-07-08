import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../context/userContext';
import api from '../services/apiService';

const User = ({ history, match }) => {
  const { user } = useContext(UserContext);
  const [linkedUser, setLinkedUser] = useState(null);

  useEffect(() => {
    const { link } = match.params;
    if (link === user.link) setLinkedUser(user);
    else {
      const fetchData = async () => {
        try {
          setLinkedUser(await api.getUser(link));
        } catch (error) {
          if (error.response && error.response.status === 404)
            history.replace('/not-found');
        }
      };
      fetchData();
    }
  }, [user, history, match.params]);

  return (
    <div>
      {linkedUser && linkedUser.username} <br />
      {linkedUser && linkedUser.link} <br />
      {linkedUser && linkedUser.img && linkedUser.img.location} <br />
    </div>
  );
};

export default User;

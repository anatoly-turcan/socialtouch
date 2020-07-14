import React, { useState, useEffect, useContext } from 'react';
import { getFriends } from '../../services/apiService';
import { toast } from 'react-toastify';
import UserContext from '../../context/userContext';
import Loader from './loader';
import { Link } from 'react-router-dom';
import avatar from '../../img/no-avatar.png';

const AllFriends = ({ link }) => {
  const { user } = useContext(UserContext);
  const [friends, setFriends] = useState(null);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFriends(await getFriends(link || user.link, 0));
      } catch ({ response }) {
        if (response) toast.error(response.data.message);
      } finally {
        setLoader(false);
      }
    };
    fetchData();
  }, []);

  const renderFriends = () =>
    friends.map((friend) => (
      <div className="person-info-multiple-el" key={friend.link}>
        <div className="round__box-b">
          <Link to={`/${friend.link}`} className="">
            <img src={friend.img_location || avatar} alt="Friend box" />
          </Link>
        </div>
        {friend.username.length > 10
          ? `${friend.username.substring(0, 10)}...`
          : friend.username}
      </div>
    ));

  if (loader)
    return (
      <div className="person-info">
        <Loader h100 size={6} />
      </div>
    );

  if (friends)
    return (
      <div className="person-info-multiple">
        {friends.length ? renderFriends() : 'No friends'}
      </div>
    );
};

export default AllFriends;

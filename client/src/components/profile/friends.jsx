import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../common/loader';
import { getFriends } from '../../services/apiService';
import avatar from '../../img/no-avatar.png';

const ProfileFriends = ({ link, limit }) => {
  const [friends, setFriends] = useState(null);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setFriends(await getFriends(link, limit));
      setLoader(false);
    };
    fetchData();
  }, []);

  if (loader)
    return (
      <div className="person-info">
        <Loader h100 size={6} />
      </div>
    );

  if (friends)
    return (
      <div className="person-info-multiple">
        {friends.map((friend) => (
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
        ))}
      </div>
    );

  return null;
};

export default ProfileFriends;

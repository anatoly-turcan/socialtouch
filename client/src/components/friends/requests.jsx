import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../common/loader';
import { getFriendRequests } from '../../services/meService';
import { confirmFriendship, unfriend } from '../../services/userService';
import avatar from '../../img/no-avatar.png';

const FriendRequests = () => {
  const [requests, setRequests] = useState(null);
  const [loader, setLoader] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setRequests(await getFriendRequests());
      } catch ({ response }) {
        if (response) toast.error(response.data.message);
      } finally {
        setLoader(false);
      }
    };
    fetchData();
  }, [forceUpdate]);

  const handleAccept = async (friendLink) => {
    try {
      const success = await confirmFriendship(friendLink);
      if (success) {
        toast.success('Friend request accepted');
        setForceUpdate(!forceUpdate);
      }
    } catch ({ response }) {
      if (response) toast.error(response.data.message);
    }
  };

  const handleDecline = async (friendLink) => {
    try {
      const success = await unfriend(friendLink);
      if (success) {
        toast.success('Friend request declined');
        setForceUpdate(!forceUpdate);
      }
    } catch ({ response }) {
      if (response) toast.error(response.data.message);
    }
  };

  const renderRequests = () =>
    requests.map((friend) => (
      <div className="person-info-multiple-el" key={friend.link}>
        <div className="round__box-b">
          <Link to={`/${friend.link}`} className="">
            <img src={friend.img_location || avatar} alt="Friend box" />
          </Link>
        </div>
        {friend.username.length > 10
          ? `${friend.username.substring(0, 10)}...`
          : friend.username}
        <div className="friend__request__actions">
          <button
            type="button"
            className="btn btn-light"
            onClick={() => handleAccept(friend.link)}
          >
            Accept
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => handleDecline(friend.link)}
          >
            Decline
          </button>
        </div>
      </div>
    ));

  if (loader)
    return (
      <div className="person-info">
        <Loader h100 size={6} />
      </div>
    );

  if (requests)
    return (
      <div className="person-info-multiple">
        {requests.length ? renderRequests() : 'No requests'}
      </div>
    );
};

export default FriendRequests;

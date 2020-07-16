import React, { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import UserContext from '../../context/userContext';
import GroupContext from '../../context/groupContext';
import EditGroup from './edit';
import {
  getSubscribersCount,
  subscribe,
  unsubscribe,
} from '../../services/apiService';
import noGroup from '../../img/no-group.png';

const GroupBox = () => {
  const { user } = useContext(UserContext);
  const { group } = useContext(GroupContext);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(group.isSubscribed || false);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const fetchSubscribersCount = async () => {
      try {
        setSubscribersCount(await getSubscribersCount(group.link));
      } catch ({ response }) {
        if (response) toast.error(response.data.message);
      }
    };
    fetchSubscribersCount();
  }, [isSubscribed]);

  const handleSubscribe = async () => {
    try {
      const success = await subscribe(group.link);
      if (success) setIsSubscribed(true);
    } catch ({ response }) {
      if (response) toast.error(response.data.message);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      const success = await unsubscribe(group.link);
      if (success) setIsSubscribed(false);
    } catch ({ response }) {
      if (response) toast.error(response.data.message);
    }
  };

  const handleEdit = () => setEdit(true);
  const handleBack = () => setEdit(false);

  const isMine = group.creator.link === user.link;

  if (edit) return <EditGroup goBack={handleBack} />;

  return (
    <div className="group">
      <div className="group__image">
        <img
          src={group.image ? group.image.location : noGroup}
          alt={group.name}
        />
      </div>
      <div className="group__name centered">{group.name}</div>
      <div className="group__actions">
        {isSubscribed ? (
          <button
            className="btn btn-transparent white t-50"
            onClick={handleUnsubscribe}
          >
            Unsubscribe
          </button>
        ) : (
          <button className="btn btn-light" onClick={handleSubscribe}>
            Subscribe
          </button>
        )}
        <span className="group__subscribers">{subscribersCount || '*'}</span>
      </div>
      <div className="group__info">
        <div className="group__description">
          {group.description || 'No description'}
        </div>
        {isMine && (
          <div className="group__edit">
            <button class="ri-settings-3-fill" onClick={handleEdit}></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupBox;

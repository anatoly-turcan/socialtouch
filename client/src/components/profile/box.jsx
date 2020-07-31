import React, { useState, useEffect, Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../common/loader';
import AllFriends from '../common/allFriends';
import AllGroups from '../common/allGroups';
import ProfileInfo from './info';
import ProfileMore from './more';
import {
  getFriends,
  getUserGroups,
  getFriendsCount,
  getGroupsCount,
  addFriend,
  unfriend,
} from '../../services/apiService';
import avatar from '../../img/no-avatar.png';
import noGroup from '../../img/no-group.png';

const ProfileBox = ({ user, isMe }) => {
  const history = useHistory();
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [friendsCount, setFriendsCount] = useState(null);
  const [groupsCount, setGroupsCount] = useState(null);
  const [loader, setLoader] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isFriend, setIsFriend] = useState(user.isFriend || false);

  useEffect(() => {
    (async () => {
      try {
        setLoader(true);
        await Promise.all([
          getFriends(user.link).then(setFriends),
          getUserGroups(user.link).then(setGroups),
          getFriendsCount(user.link).then(setFriendsCount),
          getGroupsCount(user.link).then(setGroupsCount),
        ]);
      } catch ({ response }) {
        if (response) toast.error(response.data.message);
      } finally {
        setLoader(false);
      }
    })();
  }, []);

  const handleInfo = () => setShowMore('info');
  const handleAllFriends = () => setShowMore('friends');
  const handleAllGroups = () => setShowMore('groups');
  const handleBack = () => setShowMore(false);

  const handleAddFriend = async () => {
    try {
      const success = await addFriend(user.link);
      if (success) {
        toast.success('Friend request sent');
        setIsFriend(true);
      }
    } catch ({ response }) {
      if (response) toast.error(response.data.message);
    }
  };

  const handleUnfriend = async () => {
    try {
      const success = await unfriend(user.link);
      if (success) setIsFriend(false);
    } catch ({ response }) {
      if (response) toast.error(response.data.message);
    }
  };

  const handleChat = () =>
    history.push({
      pathname: '/chat',
      state: { link: user.link },
    });

  const renderFriends = () =>
    friends.length
      ? friends.map((friend) => (
          <Link to={`/${friend.link}`} className="round__box" key={friend.link}>
            <img src={friend.img_location || avatar} alt="Friend box" />
          </Link>
        ))
      : 'No friends';

  const renderGroups = () =>
    groups.length
      ? groups.map((group) => (
          <Link
            to={`/group/${group.link}`}
            className="round__box"
            key={group.link}
          >
            <img
              src={group.image ? group.image.location : noGroup}
              alt="Friend box"
            />
          </Link>
        ))
      : 'No groups';

  const renderButtons = () => (
    <Fragment>
      <button className="btn btn-light person--btn" onClick={handleChat}>
        Send message
      </button>
      {!isFriend ? (
        <button className="btn btn-light person--btn" onClick={handleAddFriend}>
          Add friend
        </button>
      ) : (
        <button
          className="person--btn btn-transparent t-50 white"
          onClick={handleUnfriend}
        >
          Unfriend
        </button>
      )}
    </Fragment>
  );

  if (showMore)
    return (
      <ProfileMore goBack={handleBack}>
        {showMore === 'info' && <ProfileInfo link={user.link} />}
        {showMore === 'friends' && <AllFriends link={user.link} />}
        {showMore === 'groups' && <AllGroups link={user.link} />}
      </ProfileMore>
    );

  return (
    <div className="person">
      <div className="person__element person--photo">
        <img
          src={(user.image && user.image.location) || avatar}
          alt={user.name}
        />
      </div>

      <div className="person__element person--name">{user.username}</div>

      <div className="person__element person--actions h-100">
        {!isMe ? (
          renderButtons()
        ) : (
          <div className="centered w-100 my-profile ">My profile</div>
        )}
      </div>

      <div className="person__element person--data">
        {loader && <Loader size={5} />}
        {!loader && (
          <Fragment>
            <div className="person--data-el person__friends">
              <button
                className="person--data--heading btn-transparent w-100"
                onClick={handleAllFriends}
              >
                Friends
                <span className="person--data-counter">
                  {friendsCount || '0'}
                </span>
              </button>
              <div className="person--data--el-container">
                {renderFriends()}
              </div>
            </div>

            <div className="person--data-el person__groups">
              <button
                className="person--data--heading btn-transparent w-100"
                onClick={handleAllGroups}
              >
                Groups
                <span className="person--data-counter">
                  {groupsCount || '0'}
                </span>
              </button>
              <div className="person--data--el-container">{renderGroups()}</div>
            </div>
          </Fragment>
        )}
      </div>

      <div className="person__element person--more">
        <button className="btn btn-transparent link-light" onClick={handleInfo}>
          Show full information
        </button>
      </div>
    </div>
  );
};

export default ProfileBox;

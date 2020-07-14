import React, { useState } from 'react';
import AllFriends from '../components/common/allFriends';
import FindUsers from './../components/friends/find';

const Friends = () => {
  const [selection, setSelection] = useState('friends');

  const classes = 'btn btn-dark';

  const handleSelectFriends = () => {
    setSelection('friends');
  };

  const handleSelectFind = () => {
    setSelection('find');
  };

  return (
    <div className="content__fg">
      <div className="fg__header">
        <button
          className={selection === 'friends' ? `${classes} active` : classes}
          onClick={handleSelectFriends}
        >
          My friends
        </button>
        <button
          className={selection === 'find' ? `${classes} active` : classes}
          onClick={handleSelectFind}
        >
          Find users
        </button>
      </div>
      <div className="fg_content">
        {selection === 'friends' && <AllFriends />}
        {selection === 'find' && <FindUsers />}
      </div>
    </div>
  );
};

export default Friends;

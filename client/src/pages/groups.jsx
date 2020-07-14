import React, { useState } from 'react';
import AllGroups from '../components/common/allGroups';
import FindGroups from '../components/groups/find';

const Groups = () => {
  const [selection, setSelection] = useState('groups');

  const classes = 'btn btn-dark';

  const handleSelectFriends = () => {
    setSelection('groups');
  };

  const handleSelectFind = () => {
    setSelection('find');
  };

  return (
    <div className="content__fg">
      <div className="fg__header">
        <button
          className={selection === 'groups' ? `${classes} active` : classes}
          onClick={handleSelectFriends}
        >
          My groups
        </button>
        <button
          className={selection === 'find' ? `${classes} active` : classes}
          onClick={handleSelectFind}
        >
          Find groups
        </button>
      </div>
      <div className="fg_content">
        {selection === 'groups' && <AllGroups />}
        {selection === 'find' && <FindGroups />}
      </div>
    </div>
  );
};

export default Groups;

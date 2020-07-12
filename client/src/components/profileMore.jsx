import React from 'react';

const ProfileMore = ({ children, goBack }) => {
  return (
    <div className="person-info">
      <button className="person-info-back btn btn-light" onClick={goBack}>
        Go back
      </button>
      {children}
    </div>
  );
};

export default ProfileMore;

import React from 'react';
import avatar from '../../img/no-avatar.png';

const ProfileBox = ({ user }) => {
  return (
    <div className="person">
      <div className="person__element person--photo">
        <img
          src={(user.image && user.image.location) || avatar}
          alt={user.name}
        />
      </div>

      <div className="person__element person--name">{user.username}</div>

      <div className="person__element person--actions">
        <a href="#" className="btn btn-light person--btn">
          Send message
        </a>
        <a href="#" className="btn btn-light person--btn">
          Add friend
        </a>
      </div>

      <div className="person__element person--data">
        <div className="person--data-el person__friends">
          <a href="#" className="person--data--heading">
            Friends <span className="person--data-counter">*</span>
          </a>
          <div className="person--data--el-container">
            {/* <a href="#" className="round__box">
              <img
                src="https://randomuser.me/api/portraits/women/32.jpg"
                alt="Friend image / link"
              />
            </a> */}
            Here will be friends
          </div>
        </div>

        <div className="person--data-el person__groups">
          <a href="#" className="person--data--heading">
            Groups <span className="person--data-counter">*</span>
          </a>
          <div className="person--data--el-container">
            {/* <a href="#" className="round__box">
              <img
                src="https://freerangestock.com/thumbnail/39563/main-social-networks-connected-by-a-triangle-mesh.jpg"
                alt="Group image / link"
              />
            </a> */}
            Here will be groups
          </div>
        </div>
      </div>

      <div className="person__element person--more">
        <a href="#" className="link-light">
          Show full information
        </a>
      </div>
    </div>
  );
};

export default ProfileBox;

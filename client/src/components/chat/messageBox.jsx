import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../context/userContext';
import avatar from '../../img/no-avatar.png';
import Time from '../common/time';

const MessageBox = ({ message }) => {
  const { content, author, at } = message;
  const { user } = useContext(UserContext);
  const boxClasses = `message__box ${
    user.link === author.link ? 'my-message' : ''
  }`;
  const messageClasses = `message ${
    user.link === author.link ? 'my-message message-right' : 'message-left'
  }`;

  let username = author.username.split(' ')[0];

  if (username.length > 15) username = `${username.substr(0, 15)}...`;

  return (
    <div className={boxClasses}>
      <div className={messageClasses}>
        <div className="message__user-image">
          <div className="round__box">
            <Link to={`/${author.link}`}>
              <img src={`${author.image || avatar}`} alt={author.username} />
            </Link>
          </div>
        </div>
        <div className="message__data">
          <div className="message__header">
            <Link to={`/${author.link}`}>{username}</Link>
            <div className="message__at">
              <Time data={at} />
            </div>
          </div>
          <div className="message__content">{content}</div>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;

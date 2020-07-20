import React, { useState, useEffect } from 'react';
import { getChats } from '../../services/apiService';
import avatar from '../../img/no-avatar.png';

const ChatList = ({ handleSelect }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      setChats(await getChats());
    };
    fetchChats();
  }, []);

  const renderChats = () =>
    chats.map((chat) => (
      <button
        className="chat__list__el"
        onClick={() => handleSelect(chat.link)}
        key={chat.link}
      >
        <span className="chat__user-image round__box">
          <img src={chat.img_location || avatar} alt={chat.username} />
        </span>
        <span className="chat__user-name">{chat.username}</span>
      </button>
    ));

  return (
    <div className="chats__list">
      {chats.length ? renderChats() : 'No chats'}
    </div>
  );
};

export default ChatList;

import React, { useState, useEffect } from 'react';
import ChatSend from './send';
import ChatMessages from './messages';

const ChatContainer = () => {
  return (
    <div className="chat">
      <ChatMessages />
      <ChatSend />
    </div>
  );
};

export default ChatContainer;

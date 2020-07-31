import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import openSocket from 'socket.io-client';
import { ioServer } from '../config.json';
import ChatList from '../components/chat/list';
import ChatContainer from '../components/chat/container';
import ChatContext from '../context/chatContext';

const Chat = () => {
  const location = useLocation();
  const [link, setLink] = useState(null);
  const [room, setRoom] = useState(null);
  const [socket, setSocket] = useState(null);
  const [incomingMessage, setIncomingMessage] = useState(null);

  useEffect(() => {
    setSocket(openSocket(ioServer));
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('room', (data) => setRoom(data));
      socket.on('message', (message) => setIncomingMessage(message));
    }
  }, [socket]);

  useEffect(() => {
    if (location.state) setLink(location.state.link);
  }, [location]);

  useEffect(() => {
    if (socket) {
      socket.emit('chat', link);
    }
  }, [link]);

  return (
    <div className="content__chat">
      <ChatContext.Provider value={{ socket, room, incomingMessage }}>
        <ChatList handleSelect={setLink} />
        {socket && room ? (
          <ChatContainer />
        ) : (
          <div className="centered">Select chat to start messaging</div>
        )}
      </ChatContext.Provider>
    </div>
  );
};

export default Chat;

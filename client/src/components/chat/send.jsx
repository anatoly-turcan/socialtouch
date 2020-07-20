import React, { useState, useContext, useRef, useEffect } from 'react';
import ChatContext from '../../context/chatContext';
import Input from '../common/input';

const ChatSend = () => {
  const { socket, room } = useContext(ChatContext);
  const [message, setMessage] = useState('');
  const inputElement = useRef(null);

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
    }
    setMessage('');
  }, [room]);

  const handleChange = ({ target: input }) => {
    setMessage(input.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (message.length) {
      socket.emit('send', { message, room });
      setMessage('');
    }
  };

  return (
    <form className="chat__send" onSubmit={handleSubmit}>
      <Input
        name="message"
        placeholder="New message"
        onChange={handleChange}
        value={message}
        reference={inputElement}
        autoComplete="off"
        autoFocus
      />
      <button type="submit" className="centered btn-light">
        <i className="ri-send-plane-2-fill"></i>
      </button>
    </form>
  );
};

export default ChatSend;

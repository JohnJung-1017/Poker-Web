import React, { useState } from 'react';

import './Seat.css';

function Seat({ seat_no, socket, roomId, players, className }) {
  const [userName, setUserName] = useState('');
  const [stack, setStack] = useState('');

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handleStackChange = (event) => {
    setStack(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      userName: userName,
      stack: stack,
      seat_no: seat_no,
      roomId: roomId,
      socketId: socket.id,
    };

    socket.emit('joinRoom', data);
  };

  return (
    <div className={`seat-container_ ${className}`}>
      <form onSubmit={handleSubmit}>
        <label className="seat-label">
          User Name:
          <input
            type="text"
            value={userName}
            onChange={handleUserNameChange}
            className="seat-input"
          />
        </label>
        <br />
        <label className="seat-label">
          Stack:
          <input
            type="text"
            value={stack}
            onChange={handleStackChange}
            className="seat-input"
          />
        </label>
        <br />
        <button type="submit" className="seat-button">
          Start
        </button>
      </form>
    </div>
  );
}

export default Seat;

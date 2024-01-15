import React, { useState } from 'react';

import './Action.css';

function Action({ socket, canCheck, roomId }) {
  const [isBet, setIsBet] = useState(false);
  const [betAmount, setBetAmount] = useState('');

  const checkHandler = () => {
    const data = {
      action: 'check',
      socketId: socket.id,
      roomId: roomId,
    };
    socket.emit('action', data);
  };
  const callHandler = () => {
    const data = {
      action: 'call',
      socketId: socket.id,
      roomId: roomId,
    };
    socket.emit('action', data);
  };
  const foldHandler = () => {
    const data = {
      action: 'fold',
      socketId: socket.id,
      roomId: roomId,
    };
    socket.emit('action', data);
  };
  const isBetHandler = () => {
    setIsBet(true);
  };
  const betAmountChange = (event) => {
    setBetAmount(event.target.value);
  };
  const betHandler = () => {
    const data = {
      action: 'bet',
      socketId: socket.id,
      betAmount: betAmount,
      roomId: roomId,
    };
    console.log('betHandler', data);
    socket.emit('action', data);
  };

  return (
    <div className="action-container">
      {canCheck ? (
        <div>
          <button onClick={checkHandler} className="action-button">
            Check
          </button>
          <button onClick={isBetHandler} className="action-button">
            Bet
          </button>
          <button onClick={foldHandler} className="action-button">
            Fold
          </button>
          {isBet ? (
            <div className='bet-input-container'>
              <input
                type="text"
                value={betAmount}
                onChange={betAmountChange}
                className="bet-input"
              ></input>
              <button onClick={betHandler} className="bet-button">
                Bet
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div>
          <button onClick={callHandler} className="action-button">
            Call
          </button>
          <button onClick={isBetHandler} className="action-button">
            Bet
          </button>
          <button onClick={foldHandler} className="action-button">
            Fold
          </button>
          {isBet ? (
            <div className='bet-input-container'>
              <input
                type="text"
                value={betAmount}
                onChange={betAmountChange}
                className="bet-input"
              ></input>
              <button onClick={betHandler} className="bet-button">
                Bet
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default Action;

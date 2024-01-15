import React from 'react';

import './Ready.css';

function Ready({ userName, stack, seat_no, className}) {
  return (
    <div  className={`ready-container ${className}`}>
      <div className="ready-row">
        <label className="ready-label">User Name</label>
        <span className="ready-value">{userName}</span>
      </div>
      <div className="ready-row">
        <label className="ready-label">Stack</label>
        <span className="ready-value">{stack}</span>
      </div>
      <div className="ready-row">
        <label className="ready-label">Seat No</label>
        <span className="ready-value">{seat_no}</span>
      </div>
    </div>
  );
}

export default Ready;

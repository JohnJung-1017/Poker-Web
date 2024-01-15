import React from "react";
import "./GameState.css";

function GameState({ communityCards, currentRound, pot }) {
  const numCards = 5 - communityCards.length;
  const emptyCards = Array.from({ length: numCards }, (_, index) => (
    <div key={index} className="card"></div>
  ));

  return (
    <div className="game-state-container">
      
      <div className="board-cards">
        {communityCards.map((card, index) => (
          <div key={index} className="card">
            {card}
          </div>
        ))}
        {emptyCards}
      </div>
      <div className="pot-title">Pot:</div>
      <p className="pot-amount">{pot}</p>
    </div>
  );
}

export default GameState;
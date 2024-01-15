import { useState, useEffect } from "react";
import Action from "./Action";
import "./Player.css";

function Player({ seat_no, socket, roomId, players, turnOfSocketId, canCheck,className}) {
  const [userName, setUserName] = useState("");
  const [stack, setStack] = useState("");
  const [myTurn, setMyTurn] = useState(false);
  const [card1, setCard1] = useState("");
  const [card2, setCard2] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [isPlayer,setIsPlayer] = useState(false);

  useEffect(() => {
    const maxSeat = 6;
    for (let i = 1; i <= maxSeat; i++) {
      const player = players.find((p) => p.seat_no === seat_no);
      if (player) {
        setUserName(player.userName);
        setStack(player.stack);
        setBetAmount(player.bet);
        if (socket.id === player.socketId) {
          
          setCard1(player.hand[0]);
          setCard2(player.hand[1]);
          setIsPlayer(true)
        }
      }
    }

    if (turnOfSocketId === socket.id) {
      const player = players.find((p) => p.seat_no === seat_no);
      if (player.socketId === turnOfSocketId) {
        setMyTurn(true);
      }
    } else {
      setMyTurn(false);
    }
  }, [socket, players, turnOfSocketId]);

  return (
    <div className={`player-container ${className}`}>
      <h3 className="player-username">User Name: {userName}</h3>
      
      {isPlayer?
      <div className="player-cards">
        <span className="card">{card1}</span>
        <span className="card">{card2}</span>
      </div>
      :null}
      
      <h3 className="player-stack">Stack: {stack}</h3>
      <h5 className="player-seat">Seat: {seat_no}</h5>
      {betAmount ? <h3 className="player-bet">Bet Amount: {betAmount}</h3> : null}
      {myTurn ? <Action socket={socket} roomId={roomId} canCheck={canCheck} /> : null}
    </div>
  );
}

export default Player;

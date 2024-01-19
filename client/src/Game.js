import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Ready from './Ready';
import Seat from './Seat';
import Player from './Player';
import EmptyPlayer from './EmptyPlayer';
import GameState from './GameState';
import nicePoker from './image/redTable.png';

import './Game.css';

function Game({ socket }) {
  const [players, setPlayers] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [isGameStart, setIsGameStart] = useState(false);
  const [communityCards, setCommunityCards] = useState([]);
  const [pot, setPot] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [turnOfSocketId, setTurnOfSocketId] = useState('');
  const [canCheck, setCanCheck] = useState(false);
  const [winner, setWinner] = useState([]);
  const params = useParams();
  const roomId = params.roomId;
  const [isGameResultReceived, setIsGameResultReceived] = useState(false);

  useEffect(() => {
    socket.on('firstJoined', (res) => {
      setPlayers([...res]);
    });

    socket.on('newPlayer', (res) => {
      setPlayers([...res]);
    });

    socket.emit('firstJoin', {
      roomId: roomId,
      socketId: socket.id,
    });

    socket.on('gameStart', (res) => {
      setPlayers([...res.players]);
      setCommunityCards([...res.communityCards]);
      setPot(res.pot);
      setIsGameStart(true);
    });

    socket.on('nextRound', (res) => {
      setPlayers([...res.players]);
      setCommunityCards([...res.communityCards]);
      setPot(res.pot);
      setCurrentRound(res.round);
    });

    socket.on('betMade', (res) => {
      setPlayers([...res.players]);
      setPot(res.pot);
    });

    socket.on('currentTurn', (res) => {
      setTurnOfSocketId(res.socketId);
      setCanCheck(res.canCheck);
    });

    socket.on('gameResult', (res) => {
      setWinner([...res.winner]);
      setPlayers([res.players]);
      setIsGameResultReceived(true);
      setIsGameStart(false);
    });

    return () => {
      // Clean up the event handlers
      socket.off('firstJoined');
      socket.off('newPlayer');
      socket.off('gameStart');
      socket.off('nextRound');
      socket.off('betMade');
      socket.off('currentTurn');
      socket.off('gameResult');
    };
  }, [socket.id, roomId, socket]);

  useEffect(() => {
    players.forEach((player) => {
      if (player.socketId === socket.id) {
        setIsClient(true);
      }
    });
  }, [players]);

  useEffect(() => {
    if (isGameResultReceived) {
      const timeout = setTimeout(() => {
        setIsGameResultReceived(false);
        setIsGameStart(true);
        // Execute code to start a new game here
        socket.emit('start-game', roomId);
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isGameResultReceived, roomId, socket]);

  const renderSeats = () => {
    const maxSeats = 6; // 최대 좌석 수
    const renderedSeats = [];

    for (let i = 1; i <= maxSeats; i++) {
      const player = players.find((p) => p.seat_no === i);
      let playerClassName = "";
      if (i === 1){
        playerClassName = "player-1";
      }else if(i === 2){
        playerClassName = "player-2";
      }else if(i === 3){
        playerClassName = "player-3";
      }else if(i === 4){
        playerClassName = "player-4";
      }else if(i === 5){
        playerClassName = "player-5";
      }else if(i === 6){
        playerClassName = "player-6";
      }
      if (player) {
        renderedSeats.push(<Ready key={player.socketId} userName={player.userName} stack={player.stack} seat_no={player.seat_no} className={playerClassName}/>);
      } else {
        
        renderedSeats.push(
          <Seat
            key={i}
            seat_no={i}
            socket={socket}
            roomId={roomId}
            players={players}
            className={playerClassName}
          />
        );
      }
    }

    return <div className="seat-container">{renderedSeats}</div>;
  };

  const renderGame = () => {
    const maxSeats = 6; // 최대 좌석 수
    const renderedPlayers = [];

    for (let i = 1; i <= maxSeats; i++) {
      const player = players.find((p) => p.seat_no === i);
      let playerClassName = "";
      if (i === 1){
        playerClassName = "player-1";
      }else if(i === 2){
        playerClassName = "player-2";
      }else if(i === 3){
        playerClassName = "player-3";
      }else if(i === 4){
        playerClassName = "player-4";
      }else if(i === 5){
        playerClassName = "player-5";
      }else if(i === 6){
        playerClassName = "player-6";
      }
      if (player) {
        renderedPlayers.push(
          <Player
            key={player.socketId}
            seat_no={i}
            socket={socket}
            roomId={roomId}
            players={players}
            turnOfSocketId={turnOfSocketId}
            canCheck={canCheck}
            className={playerClassName}
          />
        );
      }else{
        renderedPlayers.push(
          <EmptyPlayer
          seat_no={i}
          className={playerClassName}
          />
        )
      }
    }

    return <div className="seat-container">{renderedPlayers}</div>;
  };

  const renderWinner = () => {
    const renderedWinner = [<h1 key="title">승자는</h1>];
    winner.forEach((w) => {
      renderedWinner.push(<h1 key={w.userName}>{w.userName}</h1>);
    });
    return <div className="winner-container">{renderedWinner}</div>;
  };

  const onClickHandler = () => {
    socket.emit('start-game', roomId);
  };

    const backgroundImageStyle = {
      backgroundImage: `url(${nicePoker})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  


  return (
    <div className="game-container">
      <div className='canvas'>
        <div className='table' style={backgroundImageStyle}>
          {isGameResultReceived ? renderWinner() : null}
          <div className='gameState-container'>
        {isGameStart ? (
          <GameState
            communityCards={communityCards}
            currentRound={currentRound}
            pot={pot}
          />
        ) : null}
          </div>
      
          {isGameStart ? renderGame() : renderSeats()}
      
      
          {!isGameStart && players.length >= 2 ? (
        <button className="start-button" onClick={onClickHandler}>
          Start
        </button>
        ) : null}
        </div>
        <div className='underBar'>
        <div class="underBar_chatting">
                        <div class="underBar_chatting_icon">
                            
                        </div>
                    </div>
                    <div class="underBar_join">
                        JOIN
                        <div class="underBar_join_contact">
                        </div>
                    </div>
        </div>
      </div>
    </div>
  );
}

export default Game;

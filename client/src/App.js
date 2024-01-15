import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateRoom from './CreateRoom';
import Home from './Home';
import Game from './Game';
import io from 'socket.io-client';

const socket = io('http://localhost:8080');
function App() {

  // const startHandler = async () => {
  //   await axios.get('/startgame/').then(res => {
  //     console.log(res)
  //   })
  //   // await axios.post('/api/board')//보드 5장을 한번에 받아옴
  //   // setGameStart(true)
  //   // 서버로부터 게임에 참여하는 플레이어들의 정보를 불러온후 화면에 출력한다.
  // }
  

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/start-game' element={<CreateRoom socket={socket}/>}></Route>
          <Route path='/games/:roomId' element={<Game socket={socket}/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

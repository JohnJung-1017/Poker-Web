import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // 스타일 파일을 import

function Home() {
  return (
    <div className="container">
      <Link to="/start-game" className="link">
        <button className="button">GAME START</button>
      </Link>
    </div>
  );
}

export default Home;
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import nicePoker from './image/nicePoker2.jpg';

/* 시작화면 */ 
function Home() {
  const backgroundImageStyle = {
    backgroundImage: `url(${nicePoker})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className="home">
      <div className="home_nav">
        <div className='home_nav_NameOfSite'>Fish Poker</div>
        <div className='home_nav_buttons'>1번 버튼</div>
        <div className='home_nav_buttons'>2번 버튼</div>
        <div className='home_nav_buttons'>3번 버튼</div>
        <div className='home_nav_buttons'>4번 버튼</div>
      </div>
      <div className='home_underBar'></div>
      <div className='home_left'>
        <div className='home_left_inform'>Free Online Poker Website</div>
        <Link to="/start-game" className="home_link">
          <button className="home_button">START A NEW GAME</button>
        </Link>
      </div>
      <div className='home_right' style={backgroundImageStyle}></div>
    </div>
  );
}

export default Home;
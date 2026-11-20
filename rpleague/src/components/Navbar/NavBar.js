import './NavBar.css';
import React from 'react';
import Logo from '../../images/logo.png';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();

  const fantasyinfo = () => {
    navigate('/FantasyInfoPage');
  };

  const leaderboard = () => {
    navigate('/GeneralLeaderboardPage');
  };

  const leaguepage = () => {
    navigate('/LeagueCreateJoin');
  };

  const profilepage = () => {
    navigate('/ProfilePage');
  };

  return (
    <div className="row black" id="fixit">
      <div className="col-1">
        <div className="thelogo">
          <img src={Logo} alt="Logo" id="logo" />
        </div>
      </div>
      <div className="col-9">
        <div className="row" id="navBar">
          <a id="navNews" className="goodTime navLinks" onClick={fantasyinfo}> HELP </a>
          <a id="navRanking" className="goodTime navLinks"onClick={leaderboard} >LEADERBOARD</a>
          <p id="nav1" className="goodTime black">RP</p>
          <p id="nav2" className="goodTime black">LEAGUE</p>
          <a id="navRoster" className="goodTime navLinks" onClick={leaguepage} >LEAGUES</a>
          <a id="navLeague" className="goodTime navLinks" onClick={profilepage}>PROFILE</a>
        </div>
      </div>
    </div>
  )
}



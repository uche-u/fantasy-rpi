import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LeagueOwnerPage.css';
import NavBar from '../../components/Navbar/NavBar.js';
import Popup from '../../components/League Home Page/Popup.js';
import LeagueLeaderboard from "../../components/Leaderboard Pages/League Leaderboard/LeagueLeaderboard";




const LeagueOwnerPage = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramValue = params.get('code');
    setCode(paramValue);
  }, []);

  const draft = () => {
    navigate('/LeagueDraftingPage?code=' + code);
};

    const goToProfile = () => {
        navigate('/ProfilePage');
    };

    return (
        <div>
            <NavBar/>
            <div className="arrow-left" onClick={goToProfile}></div>

            <div className="waydown"></div>
            <hr id="nav-underline"/>
            <div id="intro">
                <p id="text1">RPL</p>
                <p style={{fontFamily: 'Optima', fontSize: '20px'}}>Welcome to your league, commissioner.</p>
            </div>

            <div className="row text-center row-cols-md-2" id="mainbtns">
                <div className="col-sm-6">
                    <div className="card h-100">
                        <div className="card-body">
                            <p className="card-text"><span className="stretched-link hoverpointer"
                                                           onClick={togglePopup}>INVITE +</span></p>
                            <Popup handleClose={togglePopup} show={showPopup} code={code}/>
                        </div>
                    </div>
                </div>
                

                <LeagueLeaderboard leagueCode={code}/>

            </div>
            <hr id="nav-underline"/>
            <div id="events">
                <p id="text1">Your Roster</p>
                <div className="arrow-down" id="arrow-down-drafting" onClick={draft}></div>
            </div>
        </div>
    );
}

export default LeagueOwnerPage;

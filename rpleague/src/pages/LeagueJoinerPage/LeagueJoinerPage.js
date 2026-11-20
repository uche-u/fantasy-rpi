import React, { useState, useEffect } from 'react';
import './LeagueJoinerPage.css';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/Navbar/NavBar.js';
import LeagueLeaderboard from "../../components/Leaderboard Pages/League Leaderboard/LeagueLeaderboard";

const LeagueJoinerPage = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState('');

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

    return(
        <div>
            <NavBar />
            <div className="arrow-left" onClick={goToProfile}></div>
            <div id="intro">
                <p id="text1">RPL</p>
                <p style={{ fontFamily: 'Optima', fontSize: '20px' }}>Welcome to your league, player.</p>
            </div>

            <LeagueLeaderboard leagueCode={code} />

            <div id="events">
                <p id="text1">Your Roster</p>
                <div className="arrow-down" id="arrow-down-drafting" onClick={draft}></div>
            </div>
        </div>
    );
}

export default LeagueJoinerPage;

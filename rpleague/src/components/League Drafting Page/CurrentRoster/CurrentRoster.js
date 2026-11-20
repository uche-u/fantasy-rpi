// File path: src/components/CurrentRoster/CurrentRoster.js

import React, { useState, useEffect } from 'react';
import sampleData from './sampleData.json';
import './CurrentRoster.css';

const CurrentRoster = () => {

    const [playersInfo, setPlayersInfo] = useState([]);

    const [code, setCode] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const paramValue = params.get('code');
        setCode(paramValue);
    }, []);

    console.log(code);


    useEffect(() => {
        async function fetchPlayersInfo() {
            try {
                const response = await fetch('http://localhost:3000/league/KFQKVZ/FINALTEST');
                const playerIds = await response.json();
                const infoPromises = playerIds.map(async playerId => {
                    const playerResponse = await fetch(`http://localhost:3000/player/${playerId}`);
                    return playerResponse.json();
                });
                const playersInfo = await Promise.all(infoPromises);
                const filteredPlayers = playersInfo.filter(player => player.football && player.football["Bio Link"]);
                setPlayersInfo(filteredPlayers );
            } catch (error) {
                console.error('Error fetching player info:', error);
            }
        }
        fetchPlayersInfo();
    }, []);


    return (
        <div className="current-roster">
            <h2 className="planned-roster-title">Current Roster</h2>
            <hr className="title-underline" />
            <div className="roster-list">
                {playersInfo.map((player, index) => (
                    <div className="roster-row" key={index}>
                        <div className="roster-cell">{player['#']}</div>
                        <div className="roster-cell">{player['Name']}</div>
                        <div className="roster-cell">{player['id']}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CurrentRoster;

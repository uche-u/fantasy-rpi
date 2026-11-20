// File path: src/components/DraftOrder/DraftOrder.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import draftOrderData from './mockData.json';
//import mockDataMain from './mockDataMain.json';
import profilePic from './profile1.png';
import './DraftOrder.css';

const DraftOrder = () => {
    axios.defaults.withCredentials = true;

    const [code, setCode] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const paramValue = params.get('code');
        setCode(paramValue);
    }, []);

    console.log(code);


    const [userData, setUserData] = useState({
        username: '',
        email: '',
        leagues: []
      });
    const navigate = useNavigate();

    useEffect(() => {
    const fetchData = async () => {
        try {
        const response = await axios.get('/profile', { withCredentials: true });
        setUserData(response.data);
        } catch (error) {
        console.error('Error fetching user data:', error);
        }
    };

    fetchData();
    }, []);




    const [playersInfo, setPlayersInfo] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);

    const handleClick = playerId => {
        if (selectedPlayers.includes(playerId)) {
            setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
        } else {
            setSelectedPlayers([...selectedPlayers, playerId]);
        }
    };

    const handleLogSelectedIds = () => {
        console.log("Selected Player IDs:", selectedPlayers);
        console.log(userData.username);
        //let body = {};
        //body.players[userData.username] = selectedPlayers;
        let body = "{\"players." + userData.username + "\" : [" + selectedPlayers + "]}";
        console.log(body);

        const url = "http://localhost:3000/addDraft/" + "KFQKVZ";
        let apiParams = {
            method: "PUT",
            body: body,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        };
        fetch(url, apiParams)
        .then(response => response.json())
        .then(data => {
            console.log(JSON.stringify(data));
        })
        .catch(error => {
            console.error('Error:', error);
        });
        alert("Players Drafted")
    };


    useEffect(() => {
        async function fetchPlayersInfo() {
            try {
                const response = await fetch('http://localhost:3000/player');
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
        <div className="draft-order">
            <h3 className="player-list-title">Player List</h3>
            <div className="player-list">
                <button onClick={handleLogSelectedIds}>Draft!</button>
                {playersInfo.map(player => (
                    <div className={`player-row ${selectedPlayers.includes(player.id) ? "player-row-selected" : ""}`} onClick={() => handleClick(player.id)} key={player.id} >
                        <img src={profilePic} alt="Profile" className="list-profile-pic" />
                        <div className="player-info">{player['#']}</div>
                        <div className="player-info">{player['Name']}</div>
                        <div className="player-info player-number">{player['id']}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DraftOrder;

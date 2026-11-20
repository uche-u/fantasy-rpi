import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LeagueLeaderboard.css';

const LeagueLeaderboard = ({ leagueCode }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get(`/league/${leagueCode}/leaderboard`);
                setLeaderboard(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch leaderboard:', error);
                alert('Failed to load the leaderboard');
                setIsLoading(false);
            }
        };

        if (leagueCode) {
            fetchLeaderboard();
        }
    }, [leagueCode]);

    if (isLoading) {
        return <p>Loading leaderboard...</p>;
    }

    if (!leaderboard.length) {
        return <p>No data available.</p>;
    }

    return (
        <div className="leaderboard-container">
            <h2 className="leaderboard-header">Leaderboard</h2>
            <ul className="leaderboard-list">
                {leaderboard.map((player, index) => (
                    <li key={index} className="leaderboard-item">
                        <strong>{index + 1}. {player.username}</strong> {player.points} points
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LeagueLeaderboard;

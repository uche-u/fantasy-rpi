// File path: src/components/PlannedRoster/PlannedRoster.js

import React from 'react';
import sampleData from './sampleData.json';
import './PlannedRoster.css';

const PlannedRoster = () => {
    return (
        <div className="planned-roster">
            <h2 className="planned-roster-title">Planned Roster</h2>
            <hr className="title-underline" />
            <div className="roster-list">
                {sampleData.map((player, index) => (
                    <div className="roster-row" key={index}>
                        <div className="roster-cell">{player.position}</div>
                        <div className="roster-cell">{player.number}</div>
                        <div className="roster-cell">{player.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PlannedRoster;

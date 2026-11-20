import React from 'react';
import Navbar from '../../components/Navbar/NavBar.js';
import PlannedRoster from '../../components/League Drafting Page/PlannedRoster/PlannedRoster';
import CurrentRoster from '../../components/League Drafting Page/CurrentRoster/CurrentRoster';
import DraftOrder from '../../components/League Drafting Page/DraftOrder/DraftOrder';
import './LeagueDrafting.css';
import { useNavigate } from 'react-router-dom';

const LeagueDrafting = () => {
    return (
        <div className="league-drafting-page">
            <Navbar />
            <div className="content">
                <DraftOrder />
                <div className="center-content">
                    

                    <CurrentRoster />
                </div>
            </div>
        </div>
    );
}

export default LeagueDrafting;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import './App.css';
import './bootstrap.css';
import LandingPage from './pages/LandingPage/LandingPage.js';
import FantasyInfoPage from './pages/FantasyInfoPage/FantasyInfoPage.js';
import NavBar from './components/Navbar/NavBar.js';
import LeagueDrafting from "./pages/League Drafting Page/LeagueDrafting";
import LeagueCreateJoin from './pages/LeageCreateJoin/LeagueCreateJoin.js';
import LeagueOwnerPage from './pages/LeagueOwnerPage/LeagueOwnerPage.js';
import LeagueJoinerPage from './pages/LeagueJoinerPage/LeagueJoinerPage.js';
import Profile from './pages/Profile page/profile.js';
import GeneralLeaderboardPage from './pages/General Leaderboard/general_leaderboard.js';

import axios from "axios";
axios.defaults.withCredentials = true;



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/LeagueCreateJoin" element={<LeagueCreateJoin />} />
          <Route path="/FantasyInfoPage" element={<FantasyInfoPage />} />
          <Route path="/LeagueDraftingPage" element={<LeagueDrafting />} />
          <Route path="/LeagueOwnerPage" element={<LeagueOwnerPage />} />
          <Route path="/LeagueJoinerPage" element={<LeagueJoinerPage />} />
          <Route path="/ProfilePage" element={<Profile />} />
          <Route path="/GeneralLeaderboardPage" element={<GeneralLeaderboardPage />} />
            
        </Routes>
      </div>
    </Router>
  );
}

export default App;

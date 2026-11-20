import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../../components/Navbar/NavBar.js';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    credits: 0, // default 0
    leagues: { created: [], joined: [] }
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/profile', { withCredentials: true });
        console.log(response.data);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  // dynamic title display
  const getUserTitle = () => {
    const hasCreated = userData.leagues.created.length > 0;
    const hasJoined = userData.leagues.joined.length > 0;
    if (hasCreated && hasJoined) {
      return "LEAGUE COMMISSIONER, MEMBER";
    } else if (hasCreated) {
      return "LEAGUE COMMISSIONER";
    } else if (hasJoined) {
      return "MEMBER";
    }
    return "No league participation"; // Default
  };

  // sign out
  const handleSignOut = async () => {
    try {
      await axios.get('/logout');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to log out');
    }
  };

  const thecreated = () => {
    navigate('/LeagueOwnerPage?code=' + document.getElementById("createdleague").innerHTML);
  };

  const thejoined = () => {
    navigate('/LeagueJoinerPage?code=' + document.getElementById("joinedleague").innerHTML);
  };

  return (
      <div className="full-height">
        <NavBar />
        <div className="container-fluid1">
          <div className="profile-section">
            <hr className="nav-underline" />

            <div className="profile-content">
              <div className="user-info">
                <div className="user-details">
                  <div className="profile-photo"></div>
                  <p className="user-name">{userData.username}</p>
                  <p className="user-title">{getUserTitle()}</p>
                  <p className="user-credit">Credits: {userData.credits}</p>
                </div>
                <div className="sign-out">
                  <span className="btn blue" onClick={handleSignOut}>Sign Out</span>
                </div>
              </div>

              <div className="league-section">
                <h3>Created Leagues</h3>
                {userData.leagues.created.length > 0 ? (
                    userData.leagues.created.map((league, index) => (
                        <div key={index} className="league" onClick={thecreated}>
                          <p className="league-name" id="createdleague">{league}</p>
                          <p className="league-position">Commissioner</p>
                        </div>
                    ))
                ) : (
                    <p>You have not created any leagues.</p>
                )}

                <h3>Joined Leagues</h3>
                {userData.leagues.joined.length > 0 ? (
                    userData.leagues.joined.map((league, index) => (
                        <div key={index} className="league" onClick={thejoined}>
                          <p className="league-name" id="joinedleague">{league}</p>
                          <p className="league-position">Member</p>
                        </div>
                    ))
                ) : (
                    <p>You have not joined any leagues.</p>
                )}
              </div>


              <div className="details-section">
                <p className="details-title">User Details</p>
                <ul className="details-list">
                  <li>Username: {userData.username}</li>
                  <li>Email: {userData.email}</li>
                  <li>Phone Number: ##########</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default ProfilePage;

import NavBar from '../../components/Navbar/NavBar.js'
import LeaderboardRow from '../../components/Leaderboard Pages/LeaderboardRow.js';
import './GeneralLeaderboard.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
function GeneralLeaderboardPage() {

  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchUsers();
  }, []); 

  

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/getusers');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const thedata = await response.json();
      console.log(thedata);
      const data = thedata.users;
      setUsers(data);
      let count = 1;
      while (count - 1 < data.length && count-1 < 10) {
        let curruser = data[count-1];
        let currusername = curruser.username;
        let currcredits = curruser.credits;
        if (currcredits < 100 && currcredits > 9) {
          currcredits = "0" + currcredits;
        }
        else if (currcredits < 10) {
          currcredits = "00" + currcredits;
        }
        document.getElementById(`place${count}`).innerHTML = `<div>${count}</div>
        <div>${currusername}</div>
        <div>${currcredits}</div>`

        count = count + 1;
      }
      


      
      
      

    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
    
    
  };
  

  return (
    <div>
      <NavBar />
      <div className="container leftmargin">
        <div className="row">
          <div className="col-12 text-center" id="overall-leaderboard">
            <h1 className="text-white goodTime">OVERALL LEADERBOARD</h1>
          </div>
        </div>
        <div className="row goodTime">
          <div className="offset-2 col-8">
            <div className="d-flex justify-content-between p-2 rounded bigfont">
              <div><strong>Rank</strong></div>
              <div><strong>Username</strong></div>
              <div><strong>Credits</strong></div>
            </div>
            <div className="p-2 rounded topmargin">
              <div className="d-flex justify-content-between top3" id="place1">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div className="p-2 rounded">
              <div className="d-flex justify-content-between" id="place2">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div className="p-2 rounded">
              <div className="d-flex justify-content-between" id="place3">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div className="borderbottom smalltopmargin smallbottommargin"></div>
            <div className="p-2 rounded">
              <div className="d-flex justify-content-between" id="place4">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div className="p-2 rounded">
              <div className="d-flex justify-content-between" id="place5">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div className="p-2 rounded">
              <div className="d-flex justify-content-between" id="place6">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div className="p-2 rounded">
              <div className="d-flex justify-content-between" id="place7">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div className="p-2 rounded">
              <div className="d-flex justify-content-between" id="place8">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div className="p-2 rounded">
              <div className="d-flex justify-content-between" id="place9">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div className="p-2 rounded">
              <div className="d-flex justify-content-between" id="place10">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeneralLeaderboardPage;
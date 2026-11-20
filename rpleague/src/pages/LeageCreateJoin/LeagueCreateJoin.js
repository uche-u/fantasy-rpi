import React, { useState, useEffect } from 'react';
import './LeagueCreateJoin.css'; // Import your component's CSS file here
import NavBar from '../../components/Navbar/NavBar.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;

const LeagueCreateJoin = () => {

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    leagues: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/profile', { withCredentials: true });
      setUserData(response.data);
      console.log(response.data.username);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  let publicleagues = [];

  const navigate = useNavigate();
  // State to manage the visibility and positioning of the "Create League" and "Join League" sections
  const [createLeagueVisible, setCreateLeagueVisible] = useState(false);
  const [joinLeagueVisible, setJoinLeagueVisible] = useState(false);

  const [createleaguename, setCreateLeagueName] = useState('');
  const [createleaguetype, setCreateLeagueType] = useState('Football');
  const [createleagueplayers, setCreateLeaguePlayers] = useState(4);
  const [createleaguedraft, setCreateLeagueDraft] = useState(new Date().toISOString().slice(0, 16));
  const [createleagueprivacy, setCreateLeaguePrivacy] = useState('public');

  const [joinleaguecode, setJoinLeagueCode] = useState('');

  const [requestBody, setRequestBody] = useState({}); 


  const [publicLeagues, setPublicLeagues] = useState([]);
  

  // Function to fetch public leagues data from the server
  const fetchPublicLeagues = async () => {
    try {
      const response = await fetch('http://localhost:3000/publicleagues');
      if (!response.ok) {
        throw new Error('Failed to fetch public leagues');
      }
      const data = await response.json();
      console.log(data);
      setPublicLeagues(data);
      publicleagues = data;
      let drafttimeString = publicleagues.success[0].draft.toLocaleString();
      drafttimeString = drafttimeString.replace("T", " ").replace("Z", " ").replace(".000", "");
      console.log(drafttimeString);
      if (publicleagues.success.length > 0) {
        document.getElementById("firstleague").innerHTML = (`<p class="publicleagueinfo">League Name: <strong><span>${publicleagues.success[0].name}</span></strong></p>
        <p class="publicleagueinfo lesstopmargin">League Type: <strong><span>${publicleagues.success[0].type}</span></strong></p>
        <p class="publicleagueinfo lesstopmargin">Current Number of Players: <strong><span>${publicleagues.success[0].drafters.length}</span></strong></p>
        <p class="publicleagueinfo lesstopmargin">Max Number of Players: <strong><span>${publicleagues.success[0].maxplayers}</span></strong></p>
        <p class="publicleagueinfo lesstopmargin">Draft Time: <strong><span>${drafttimeString}</span></strong></p>`);
        document.getElementById("publicleaguecode1").innerHTML = `${publicleagues.success[0].code}`;
      }
      if (publicleagues.success.length > 1) {
        drafttimeString = publicleagues.success[1].draft.toLocaleString();
        drafttimeString = drafttimeString.replace("T", " ").replace("Z", " ").replace(".000", "");
        document.getElementById("secondleague").innerHTML = (`<p class="publicleagueinfo">League Name: <strong><span>${publicleagues.success[1].name}</span></strong></p>
        <p class="publicleagueinfo lesstopmargin">League Type: <strong><span>${publicleagues.success[1].type}</span></strong></p>
        <p class="publicleagueinfo lesstopmargin">Current Number of Players: <strong><span>${publicleagues.success[1].drafters.length}</span></strong></p>
        <p class="publicleagueinfo lesstopmargin">Max Number of Players: <strong><span>${publicleagues.success[1].maxplayers}</span></strong></p>
        <p class="publicleagueinfo lesstopmargin">Draft Time: <strong><span>${drafttimeString}</span></strong></p>`);
        document.getElementById("publicleaguecode2").innerHTML = `${publicleagues.success[1].code}`;
      }
      if (publicleagues.success.length > 2) {
        drafttimeString = publicleagues.success[2].draft.toLocaleString();
        drafttimeString = drafttimeString.replace("T", " ").replace("Z", " ").replace(".000", "");
        document.getElementById("thirdleague").innerHTML = (`<p class="publicleagueinfo">League Name: <strong><span>${publicleagues.success[2].name}</span></strong></p>
        <p class="publicleagueinfo lesstopmargin">League Type: <strong><span>${publicleagues.success[2].type}</span></strong></p>
        <p class="publicleagueinfo lesstopmargin">Current Number of Players: <strong><span>${publicleagues.success[2].drafters.length}</span></strong></p>
        <p class="publicleagueinfo lesstopmargin">Max Number of Players: <strong><span>${publicleagues.success[2].maxplayers}</span></strong></p>
        <p class="publicleagueinfo lesstopmargin">Draft Time: <strong><span>${drafttimeString}</span></strong></p>`);
        document.getElementById("publicleaguecode3").innerHTML = `${publicleagues.success[2].code}`;
      }
      if (publicleagues.success.length > 3) {
        drafttimeString = publicleagues.success[3].draft.toLocaleString();
        drafttimeString = drafttimeString.replace("T", " ").replace("Z", " ").replace(".000", "");
        document.getElementById("fourthleague").innerHTML = (`<p class="publicleagueinfo">League Name: <strong><span>${publicleagues.success[3].name}</span></strong></p>
        <p class="publicleagueinfo lesstopmargin">League Type: <strong><span>${publicleagues.success[3].type}</span></strong></p>
        <p class="publicleagueinfo lesstopmargin">Current Number of Players: <strong><span>${publicleagues.success[3].drafters.length}</span></strong></p>
        <p class="publicleagueinfo lesstopmargin">Max Number of Players: <strong><span>${publicleagues.success[3].maxplayers}</span></strong></p>
        <p class="publicleagueinfo lesstopmargin">Draft Time: <strong><span>${drafttimeString}</span></strong></p>`);
        document.getElementById("publicleaguecode4").innerHTML = `${publicleagues.success[3].code}`;
      }
      

    } catch (error) {
      console.error('Error fetching public leagues:', error.message);
    }
    console.log(publicLeagues);
    console.log("theleagues");
    console.log(publicleagues);
    
  };

  const joinpublicleague1 = async () => {
    let firstcode = document.getElementById("publicleaguecode1").innerHTML;
    if (firstcode == "code1") {
      alert("Not enough public leagues have been created yet!");
    }
    else {
      if (userData.leagues.joined.length > 0) {
        alert("You may only be a member of one league at a time!");
        return;
      }
      const res = await fetch("http://localhost:3000/getleague/" + firstcode);
      const data = await res.json();
      console.log(data);
      if (data.error) {
        alert(data.error);
      }
      else {
        document.getElementById("joinleaguepage").style.right = "100%";
        document.getElementById("joinleaguepage").style.display = "none";
        navigate('/LeagueJoinerPage?code='+firstcode);
      }
    }
  };

  const joinpublicleague2 = async () => {
    let secondcode = document.getElementById("publicleaguecode2").innerHTML;
    if (secondcode == "code2") {
      alert("Not enough public leagues have been created yet!");
    }
    else {
      if (userData.leagues.joined.length > 0) {
        alert("You may only be a member of one league at a time!");
        return;
      }
      const res = await fetch("http://localhost:3000/getleague/" + secondcode);
      const data = await res.json();
      console.log(data);
      if (data.error) {
        alert(data.error);
      }
      else {
        document.getElementById("joinleaguepage").style.right = "100%";
        document.getElementById("joinleaguepage").style.display = "none";
        navigate('/LeagueJoinerPage?code='+secondcode);
      }
    }
  };

  const joinpublicleague3 = async () => {
    let thirdcode = document.getElementById("publicleaguecode3").innerHTML;
    if (thirdcode == "code3") {
      alert("Not enough public leagues have been created yet!");
    }
    else {
      if (userData.leagues.joined.length > 0) {
        alert("You may only be a member of one league at a time!");
        return;
      }
      const res = await fetch("http://localhost:3000/getleague/" + thirdcode);
      const data = await res.json();
      console.log(data);
      if (data.error) {
        alert(data.error);
      }
      else {
        document.getElementById("joinleaguepage").style.right = "100%";
        document.getElementById("joinleaguepage").style.display = "none";
        navigate('/LeagueJoinerPage?code='+thirdcode);
      }
    }
  };

  const joinpublicleague4 = async () => {
    let fourthcode = document.getElementById("publicleaguecode4").innerHTML;
    if (fourthcode == "code4") {
      alert("Not enough public leagues have been created yet!");
    }
    else {
      if (userData.leagues.joined.length > 0) {
        alert("You may only be a member of one league at a time!");
        return;
      }
      const res = await fetch("http://localhost:3000/getleague/" + fourthcode);
      const data = await res.json();
      console.log(data);
      if (data.error) {
        alert(data.error);
      }
      else {
        document.getElementById("joinleaguepage").style.right = "100%";
        document.getElementById("joinleaguepage").style.display = "none";
        navigate('/LeagueJoinerPage?code='+fourthcode);
      }
    }
  };

  useEffect(() => {
    fetchPublicLeagues();
  }, []); 
  
  useEffect(() => {
    setRequestBody({
      createleaguename: createleaguename,
      createleaguetype: createleaguetype,
      createleagueplayers: createleagueplayers,
      createleaguedraft: createleaguedraft,
      createleagueprivacy: createleagueprivacy
    });
  }, [createleaguename, createleaguetype, createleagueplayers, createleaguedraft, createleagueprivacy]);

  // Function to handle the "Create League" button click
  const handleCreateLeagueClick = () => {
    setCreateLeagueVisible(true);
    document.getElementById("createleaguepage").style.display = "block";
        setTimeout(function() {
            document.getElementById("createleaguepage").style.left = "0";
        }, 1);
    };

  // Function to handle the "Join League" button click
  const handleJoinLeagueClick = async () => {
    
    setJoinLeagueVisible(true);
    document.getElementById("joinleaguepage").style.display = "block";
      setTimeout(function() {
          document.getElementById("joinleaguepage").style.right = "0";
      }, 1);
  };

  // Function to handle the left arrow click
  const handleLeftArrowClick = () => {
    setCreateLeagueVisible(false);
    document.getElementById("createleaguepage").style.left = "100%";
      
      setTimeout(function() {
          document.getElementById("createleaguepage").style.display = "none";
      }, 500);
  };

  // Function to handle the right arrow click
  const handleRightArrowClick = () => {
    setJoinLeagueVisible(false);
    document.getElementById("joinleaguepage").style.right = "100%";
      
      setTimeout(function() {
          document.getElementById("joinleaguepage").style.display = "none";
      }, 500);
  };

  const handleCreateLeague = async (event) => {
    event.preventDefault();
    fetchData();
    if (userData.leagues.created.length > 0) {
      alert("You may only be a commissioner of one league at a time!");
      return;
    }
    if (createleaguename == "") {
      alert("**Fill in a League Name please!");
      return;
    }

    let code = "";
    
      let test = false;
    
    while (!test) {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      while (code.length < 6) {
        code += alphabet[Math.floor(Math.random() * alphabet.length)];
      }
      let ret = await fetch("http://localhost:3000/createleague/" + code);
      let a = await ret.json();
      test = a.response;
    }
    console.log(test);
    

    let requestBody = {}; 
    requestBody.thename = createleaguename;
    requestBody.type = createleaguetype;
    requestBody.players = createleagueplayers;
    requestBody.draft = createleaguedraft;
    requestBody.privacy = createleagueprivacy;
    const requestOptions = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    };

    const res = await fetch("http://localhost:3000/createleague/" + code, requestOptions);
    const data = await res.json();

    document.getElementById("createleaguepage").style.left = "100%";
    document.getElementById("createleaguepage").style.display = "none";
    navigate('/LeagueOwnerPage?code='+code);

  };

  const handleJoinLeague = async (event) => {
    event.preventDefault();
    fetchData();
    if (userData.leagues.joined.length > 0) {
      alert("You may only be a member of one league at a time!");
      return;
    }
    if (userData.leagues.created.length > 0) {
      if (userData.leagues.created[0] == joinleaguecode) {
        alert("You are already the commissioner of this league!");
      return;
      }
    }
    if (joinleaguecode == "") {
      alert("**Fill in a League Code please!");
      return;
    }
    const res = await fetch("http://localhost:3000/getleague/" + joinleaguecode);
    const data = await res.json();
    console.log(data);
    if (data.error) {
      alert(data.error);
    }
    else {
      document.getElementById("joinleaguepage").style.right = "100%";
      document.getElementById("joinleaguepage").style.display = "none";
      navigate('/LeagueJoinerPage?code='+joinleaguecode);
    }

  };

  return (
    <div>
      <NavBar />
    <div id="leaguecreatejoin">
      <main id="createorjoinpage">
        <div className="container-fluid">
          <div className="row">
            <div id="left-side">
              <p className="goodTime line1 underlines hoverpointer smallhover" id="join" onClick={handleJoinLeagueClick}>
                JOIN A
              </p>
              <p id="LEA" className="endZone line2">
                LEA
              </p>
              <p className="goodTime line3 move1">JOIN THE MADNESS</p>
              <p className="goodTime line3 move3">OF EXISTING LEAGUES</p>
            </div>
            <div id="right-side">
              <p className="goodTime line1 underlines hoverpointer smallhover" id="create" onClick={handleCreateLeagueClick}>
                CREATE A
              </p>
              <p className="endZone line2 gue">GUE</p>
              <p className="goodTime line3 move2 gue1">BE THE COMMISSIONER</p>
              <p className="goodTime line3 move4 gue1">CREATE YOUR OWN LEAGUES</p>
            </div>
          </div>
        </div>
      </main>

      {/* Create League Page */}
      <main id="createleaguepage">
    
    <div className="container-fluid">
      <div className="row">
        <div id="leftsideleaguecreate" className="col-6">
          <div className="arrow-left smallhover hoverpointer" id="leftarrow" onClick={handleLeftArrowClick}></div>
          <p className="goodTime leaguecreateline1 biggertop">CREATE A</p>
          <p className="goodTime leaguecreateline2">LEAGUE</p>
        </div>
        <div id="rightsideleaguecreate" className="col-6">
          <form className="biggertop">
            <div className="form-group">
              <label htmlFor="leagueName">League Name</label>
              <input type="text" className="form-control" id="leagueName" placeholder="Enter League Name" value={createleaguename} onChange={(e) => setCreateLeagueName(e.target.value)}/>
            </div>
            <div className="form-group">
              <label htmlFor="leagueType">League Type</label>
              <select className="form-control" id="leagueType" value={createleaguetype} onChange={(e) => setCreateLeagueType(e.target.value)}>
                <option value="Football">Football</option>
                <option value="Baseball">Baseball</option>
                <option value="Softball">Softball</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="numPlayers">Number of Players</label>
              <select className="form-control" id="numberOfPlayers" value={createleagueplayers} onChange={(e) => setCreateLeaguePlayers(e.target.value)}>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="draftTime">Draft Time</label>
              <input type="datetime-local" className="form-control" id="draftTime" value={createleaguedraft} onChange={(e) => setCreateLeagueDraft(e.target.value)}/>
            </div>
            <div className="form-group">
              <label htmlFor="leagueType">League Privacy</label>
              <select className="form-control" id="leaguePrivacy" value={createleagueprivacy} onChange={(e) => setCreateLeaguePrivacy(e.target.value)} >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <span className="btn btn-primary" onClick={(event) => handleCreateLeague(event)}>CREATE</span>
          </form>
        </div>
      </div>
    </div>


      </main>

      {/* Join League Page */}
      <main id="joinleaguepage">
    


    <div className="container-fluid">
      <div className="row">
        <div id="leftsideleaguejoin" className="col-6">
          <form className="toppadding topmargin" id="joinBtn">
            <div className="form-group">
              <label className="bigbold smalltopmargin" htmlFor="leagueCode">Private League</label>
              <input type="text" className="form-control" id="leagueCode" placeholder="Enter League Invite Code" value={joinleaguecode} onChange={(e) => setJoinLeagueCode(e.target.value)} />
            </div>
            <a href="leaguehome2.html" className="btn btn-primary" onClick={(event) => handleJoinLeague(event)}>JOIN</a>
          </form>
          <p className="topmargin bigbold">Public League</p>

          <div className="publicrow">
            <div className="publicleague hoverpointer smallhover" id="firstleague" onClick={joinpublicleague1}>
              <p>Not enough public leagues have been created yet!</p>
            </div>
            <div className="publicleague hoverpointer smallhover" id="secondleague" onClick={joinpublicleague2}>
            <p>Not enough public leagues have been created yet!</p>
            </div>
          </div>
          <div className="publicrow">
            <div className="publicleague hoverpointer smallhover" id="thirdleague" onClick={joinpublicleague3}>
            <p>Not enough public leagues have been created yet!</p>
            </div>
            <div className="publicleague hoverpointer smallhover" id="fourthleague" onClick={joinpublicleague4}>
            <p>Not enough public leagues have been created yet!</p>
            </div>
          </div>

        </div>
        <div id="rightsideleaguejoin" className="col-6">
          <div className="arrow-right hoverpointer smallhover" id="rightarrow" onClick={handleRightArrowClick}></div>
          <p className="goodTime leaguejoinline1 biggesttop">JOIN A</p>
          <p className="goodTime leaguejoinline2">LEAGUE</p>
        </div>
        <div className="publicleaguecodes">
          <span id="publicleaguecode1">code1</span>
          <span id="publicleaguecode2">code2</span>
          <span id="publicleaguecode3">code3</span>
          <span id="publicleaguecode4">code4</span>
        </div>
      </div>
    </div>


      </main>
    </div>
    </div>
  );
};

export default LeagueCreateJoin;

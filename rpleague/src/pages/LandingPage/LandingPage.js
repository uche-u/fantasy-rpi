import './LandingPage.css';
import InputField from '../../components/League Home Page/InputField';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/Navbar/NavBar.js';

import axios from 'axios';
axios.defaults.withCredentials = true;


const  LandingPage = () => {

    const navigate = useNavigate();

  const [signupusername, setSignUpUserName] = useState('');
  const [signupemail, setSignUpEmail] = useState('');
  const [signuppassword, setSignUpPassword] = useState('');
  const [signupconfirmpassword, setSignUpConfirmPassword] = useState('');
  const [loginusername, setLoginUsername] = useState('');
  const [loginpassword, setLoginPassword] = useState('');
  const [showSignupForm, setShowSignupForm] = useState(true);

    const switchToLogin = () => {
        setShowSignupForm(false);
        document.getElementById("signupform").style.borderBottom = "none";
        document.getElementById("loginform").style.borderBottom = "2px solid black";
    };

    const switchToSignup = () => {
        setShowSignupForm(true);
        document.getElementById("loginform").style.borderBottom = "none";
        document.getElementById("signupform").style.borderBottom = "2px solid black";
    };




    //
    // const handleSignUp = async () => {
    //     console.log("Signup attempt landing page");
    //     try {
    //         const response = await axios.post('/signup', {
    //             username: signupusername,
    //             email: signupemail,
    //             password: signuppassword,
    //             confirmPassword: signupconfirmpassword
    //         });
    //         if(response.status===201) {
    //             return true;
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //         if (error.response) {
    //             alert(error.response.data.error);
    //         } else {
    //             alert('Internal server error');
    //         }
    //     }
    // };


    const handleRequest = async (requestType, event) => {
        event.preventDefault();
        if (requestType === "signup") {
            if (!signupusername || !signupemail || signuppassword.length < 8 || !/\d/.test(signuppassword) || signuppassword !== signupconfirmpassword) {
                alert("Please check your inputs and try again.");
                return;
            }
            try {
                const response = await axios.post('/signup', {
                    username: signupusername,
                    email: signupemail,
                    password: signuppassword
                });
                if (response.status === 201) {
                    navigate('/LeagueCreateJoin');
                }
            } catch (error) {
                console.error('Signup Error:', error);
                alert(error.response.data.error || 'Internal server error');
            }
        } else { // Login
            if (!loginusername || !loginpassword) {
                alert("Please fill in all fields.");
                return;
            }
            try {
                const response = await axios.post('/login', {
                    username: loginusername,
                    password: loginpassword
                });
                if (response.status === 200) {
                    navigate('/LeagueCreateJoin');
                }
            } catch (error) {
                console.error('Login Error:', error);
                alert(error.response.data.error || 'Internal server error');
            }
        }
    };



    return (
        <div id="landing">
            <div>
                
                <div id="text1">
                    <p>RPI</p>
                    <p>FANTASY LEAGUE</p>
                </div>
            </div>
            <div className="parallax">
                <p id="tagline">Join RPI's exclusive Fantasy Sports League - Sign up/Log in below!</p>
            </div>
            <div className="shadow p-3 mb-5 bg-body rounded" id="description">
                <p><em> Rensselaer Polytechnic League </em> gives students the fun experience of managing sports leagues and curating their very own roster for RPI and using our very own RPI athletes.
                    The goal is to promote interest in RPI athletics amongst the students, bring fantasy leagues to the college sphere, and have fun with friends!</p>
            </div>
            <div className="accCreate">
                <form id="moveleft">
                    <span id="signupform" onClick={switchToSignup}>Sign Up</span> &emsp; <span id="loginform" onClick={switchToLogin}>Log In</span>
                    <br />
                    <br />
                    <div id="homepageform">
                        {showSignupForm ? (
                            <div>
                                <div class="form-group">
                                    <label for="exampleInputUsername"> Username </label>
                                    <input type="username" class="form-control" id="exampleInputUsername"
                                           placeholder="Username" value={signupusername}
                                           onChange={(e) => setSignUpUserName(e.target.value)}/>
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Email address</label>
                                    <input type="email" class="form-control" id="exampleInputEmail1"
                                           aria-describedby="emailHelp" placeholder="Enter email" value={signupemail}
                                           onChange={(e) => setSignUpEmail(e.target.value)}/>
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">Password</label>
                                    <input type="password" class="form-control" id="exampleInputPassword1"
                                           placeholder="Password" value={signuppassword}
                                           onChange={(e) => setSignUpPassword(e.target.value)}/>
                                    <small id="passwordHelp" class="form-text text-muted">Your password must be greater
                                        than 8 characters and contain at least 1 number.</small>
                                </div>
                                <div class="form-group">
                                    <label for="exampleConfirmPassword1">Confirm Password</label>
                                    <input type="password" class="form-control" id="exampleConfirmPassword1"
                                           placeholder="Confirm Password" value={signupconfirmpassword}
                                           onChange={(e) => setSignUpConfirmPassword(e.target.value)}/>
                                </div>
                                <button className="btn btn-primary" id="signupbutton"
                                        onClick={(event) => handleRequest('signup', event)}>Sign Up
                                </button>
                            </div>


                        ) : (


                            <div>
                                <div class="form-group">
                                    <label HTMLfor="realInputUsername"> Username </label>
                                    <input type="username" class="form-control" id="realInputUsername"
                                           placeholder="Username" value={loginusername}
                                           onChange={(e) => setLoginUsername(e.target.value)}/>
                                </div>
                                <div class="form-group">
                                    <label HTMLfor="realInputPassword1">Password</label>
                                    <input type="password" class="form-control" id="realInputPassword1"
                                           placeholder="Password" value={loginpassword}
                                           onChange={(e) => setLoginPassword(e.target.value)}/>
                                    <small id="passwordHelp2">Your password must be greater than 8 characters and
                                        contain at least 1 number.</small>
                                </div>
                                <button className="btn btn-primary" id="loginbutton"
                                        onClick={(event) => handleRequest('login', event)}>Log in
                                </button>
                            </div>


                        )}


                    </div>
                </form>
            </div>
        </div>
    )
}



export default LandingPage;



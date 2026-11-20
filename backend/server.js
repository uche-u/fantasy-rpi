const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const e = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const port = 3000;

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

require('dotenv').config();

mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// mongoDBStore for session data
const store = new MongoDBStore({
  uri: process.env.MONGODB,
  collection: 'sessions'
});

store.on('error', function(error) {
  console.log(error);
});


const secret = crypto.randomBytes(64).toString('hex');
console.log(secret);


app.use(session({
  secret: secret,
  cookie: {
    secure: false, // CHANGE TO TRUE FOR HTTPS
    httpOnly: true
  },
  store: store,
  resave: false,
  saveUninitialized: true
}));

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true // for sending and receiving cookies
}));


// app.use(cors());
app.use(express.static('../rpleague/build'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

const leagueSchema = new mongoose.Schema({
    name: String,
    type: String,
    maxplayers: Number,
    draft: Date,
    privacy: String,
    code: String,
    owner: String,
    players: Object,
    points: Object,
    drafters: Array,
    currentdraft: Number
  }, { versionKey: false });
  const League = mongoose.model('League', leagueSchema);

const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;


const usersSchema = new mongoose.Schema({
  "username": {
    "type" :"String"
  },
  "email": {
    "type" :"String"
  },
  "password": {
    "type" :"String"
  },
  "credits": {
    "type": "Number",
    "default": 0
  },
  "leagues": {
    "type": "Object",
    "default": {"created": [], "joined": []}
  }
}, { versionKey: false });

// Pre-save hook to hash password before saving
usersSchema.pre('save', function(next) {
  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

const Users = mongoose.model('Users', usersSchema);

app.post('/signup', async (req, res) => {
    try {
        let { username, email, password } = req.body;
        username = username.toUpperCase();
        email = email.toUpperCase();

        let existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with that email already exists' });
        }
        existingUser = await Users.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'User with that username already exists' });
        }

        const newUser = new Users({ username, email, password });
        await newUser.save(); // auto-hashes the pw

        // Start new session directly
        req.session.user = { id: newUser._id, username: newUser.username };

        res.status(201).json({ message: 'User created successfully', user: { username: newUser.username, email: newUser.email } });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/login', async (req, res) => {
  try {
    let { username, password } = req.body;
    username = username.toUpperCase();
    let user = await Users.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'No user found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    req.session.user = { id: user._id, username: user.username };
    res.status(200).json({ success: 'Logged in successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// destory session
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to log out' });
    }
    res.clearCookie('connect.sid'); // clear cookie
    res.json({ message: 'Logged out successfully' });
  });
});


// dynamic display profile
app.get('/profile', async (req, res) => {
  if (!req.session.user || !req.session.user.id) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    const user = await Users.findById(req.session.user.id).select('-password'); // uh uh no see password
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      username: user.username,
      email: user.email,
      credits: user.credits,
      leagues: user.leagues
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/league/:code/leaderboard', async (req, res) => {
    const leagueCode = req.params.code.toUpperCase(); // Normalize the league code to uppercase

    try {
        const league = await League.findOne({ code: leagueCode });
        if (!league) {
            return res.status(404).json({ message: "League not found" });
        }

        // Prepare the data for the leaderboard
        const leaderboard = Object.keys(league.points).map(username => ({
            username,
            points: league.points[username]
        })).sort((a, b) => b.points - a.points).slice(0, 5); // Top 5 players

        res.json(leaderboard);
    } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});



app.get('/getusers', async (req, res) => {
  try {
    let users = await Users.find();
    users.sort((a, b) => b.credits - a.credits);
    console.log(users);
    console.log(users[0].credits);
    res.json({users: users});
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Endpoint to check if a league exists. returns true if the league does not exist and false otherwise
app.get('/createleague/:number', async (req, res) => {
    let code = req.params.number;
    const theLeague = await League.find({code: code});
    if (theLeague.length === 0) {
        res.json({response: "true"});
    }
    else {
        res.json({response: "false"});
    }
});


// Endpoint to create a league
app.post('/createleague/:number', async (req, res) => {

    // Add check for username; can only create one league

    let thebody = req.body;
    let thename = thebody.thename;
    let type = thebody.type;
    let players = thebody.players;
    let draft = thebody.draft;
    let privacy = thebody.privacy;
    let code = req.params.number;
    if (code.length < 6) {
        code = "000000";
    }
    
    let currentuser = req.session.user.username;
    try {
        const newLeague = new League({ name: thename, type: type, maxplayers: players, draft: draft, privacy: privacy, code: code, owner: currentuser, players: {currentuser: []}, points: {currentuser: 0}, drafters: [currentuser], currentdraft: -1});
        await newLeague.save();
        res.json({success: "League Created"});
    }
    catch (error) {
        res.json({error: error});
    }
    let user = await Users.find({username: currentuser});
    console.log(user);
    let newarray = [];
    newarray.push(code);
    try {
      let joined = user[0].leagues.joined;
      await Users.updateOne({username: currentuser}, {$set: {leagues: {created: newarray, joined: joined}}})
    }
    catch (error) {
      await Users.updateOne({username: currentuser}, {$set: {leagues: {created: newarray, joined: []}}})
    }
});

app.put('/addDraft/:number', async (req, res) => {
    const idNum = req.params.number;
    const filter = { code: idNum };
    const update = req.body;
    try {
    const leagueData = await League.findOneAndUpdate(filter, update);
    console.log(leagueData);
    res.json(leagueData);
    } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/league/:number/:player', async (req, res) =>{
    let code = req.params.number;
    let player = req.params.player;
    const theLeague = await League.find({code: code});
    console.log(theLeague);
    const playerResult = theLeague[0].players[player];
    res.json(playerResult);
    //res.json({ code, player });
});


// Endpoint to add current user to a league
app.get('/getleague/:number', async (req, res) => {

    // Add check for username; can only join one league

    console.log("inhere");
    let code = req.params.number;
    const theLeague = await League.find({code: code});
    if (theLeague.length === 0) {
        res.json({error: "Invalid League Code"});
        return;
    }
    let count = 0;
    for (const player in theLeague[0].players) {
        count = count + 1;
    }
    if (count === theLeague[0].maxplayers) {
        res.json({error: "League is Full"});
        return;
    }
    let currentuser = req.session.user.username;
    let newplayers = theLeague[0].players;
    newplayers[currentuser] = [];
    let newpoints = theLeague[0].points;
    newpoints[currentuser] = 0;
    let newdrafters = theLeague[0].drafters;
    newdrafters.push(currentuser);
    await League.updateOne({ code: code }, { $set: { players: newplayers, drafters: newdrafters, points: newpoints} });
    let user = await Users.find({username: currentuser});
    console.log(user);
    let newarray = [];
    newarray.push(code);
    try {
      console.log(user[0].leagues);
      console.log(user[0].leagues.created);
      console.log(user[0].leagues.created[0]);
      let created = user[0].leagues.created;
      await Users.updateOne({username: currentuser}, {$set: {leagues: {created: created, joined: newarray}}})
    }
    catch (error) {
      await Users.updateOne({username: currentuser}, {$set: {leagues: {created: [], joined: newarray}}})
    }

    res.json({success: "Successfully joined League"});
    console.log("success!");
});


// Endpoint to return the information about the first four public leagues
app.get('/publicleagues', async (req, res) => {
    const theLeagues = await League.find({privacy: "public"});
    let ret = [];
    for (let i = 0; i < theLeagues.length && i < 4; i += 1) {
        if (theLeagues[i].currentdraft < 0) {
            ret.push(theLeagues[i]);
        }
    }
    console.log(ret);
    res.json({success: ret});
});

const playerSchema = new mongoose.Schema({
    "softball": {
      "batting": {
        "AVG": {
          "type": "Number",
          "default": 0
        },
        "OPS": {
          "type": "Number",
          "default": 0
        },
        "GP-GS": {
          "type": "String",
          "default": "0-0"
        },
        "AB": {
          "type": "Number",
          "default": 0
        },
        "R": {
          "type": "Number",
          "default": 0
        },
        "H": {
          "type": "Number",
          "default": 0
        },
        "2B": {
          "type": "Number",
          "default": 0
        },
        "3B": {
          "type": "Number",
          "default": 0
        },
        "HR": {
          "type": "Number",
          "default": 0
        },
        "RBI": {
          "type": "Number",
          "default": 0
        },
        "TB": {
          "type": "Number",
          "default": 0
        },
        "SLG%": {
          "type": "Number",
          "default": 0
        },
        "BB": {
          "type": "Number",
          "default": 0
        },
        "HBP": {
          "type": "Number",
          "default": 0
        },
        "SO": {
          "type": "Number",
          "default": 0
        },
        "GDP": {
          "type": "Number",
          "default": 0
        },
        "OB%": {
          "type": "Number",
          "default": 0
        },
        "SF": {
          "type": "Number",
          "default": 0
        },
        "SH": {
          "type": "Number",
          "default": 0
        },
        "SB-ATT": {
          "type": "String",
          "default": "0-0"
        }
      },
      "pitching": {
        "ERA": {
          "type": "Number",
          "default": 0
        },
        "WHIP": {
          "type": "Number",
          "default": 0
        },
        "W-L": {
          "type": "String",
          "default": "0-0"
        },
        "APP-GS": {
          "type": "String",
          "default": "0-0"
        },
        "CG": {
          "type": "Number",
          "default": 0
        },
        "SHO": {
          "type": "Number",
          "default": 0
        },
        "SV": {
          "type": "Number",
          "default": 0
        },
        "IP": {
          "type": "Number",
          "default": 0
        },
        "H": {
          "type": "Number",
          "default": 0
        },
        "R": {
          "type": "Number",
          "default": 0
        },
        "ER": {
          "type": "Number",
          "default": 0
        },
        "BB": {
          "type": "Number",
          "default": 0
        },
        "SO": {
          "type": "Number",
          "default": 0
        },
        "2B": {
          "type": "Number",
          "default": 0
        },
        "3B": {
          "type": "Number",
          "default": 0
        },
        "HR": {
          "type": "Number",
          "default": 0
        },
        "AB": {
          "type": "Number",
          "default": 0
        },
        "B/AVG": {
          "type": "Number",
          "default": 0
        },
        "WP": {
          "type": "Number",
          "default": 0
        },
        "HBP": {
          "type": "Number",
          "default": 0
        },
        "BK": {
          "type": "Number",
          "default": 0
        },
        "SFA": {
          "type": "Number",
          "default": 0
        },
        "SHA": {
          "type": "Number",
          "default": 0
        }
      },
      "fielding": {
        "C": {
          "type": "Number",
          "default": 0
        },
        "PO": {
          "type": "Number",
          "default": 0
        },
        "A": {
          "type": "Number",
          "default": 0
        },
        "E": {
          "type": "Number",
          "default": 0
        },
        "FLD%": {
          "type": "Number",
          "default": 0
        },
        "DP": {
          "type": "Number",
          "default": 0
        },
        "SBA": {
          "type": "Number",
          "default": 0
        },
        "CSB": {
          "type": "Number",
          "default": 0
        },
        "PB": {
          "type": "Number",
          "default": 0
        },
        "CI": {
          "type": "Number",
          "default": 0
        }
      },
      "Bio Link": {
        "type": "String",
        "default": "null"
      }
    },
    "football": {
      "rushing": {
        "GP": {
          "type": "Number",
          "default": 0
        },
        "ATT": {
          "type": "Number",
          "default": 0
        },
        "Gain": {
          "type": "Number",
          "default": 0
        },
        "Loss": {
          "type": "Number",
          "default": 0
        },
        "Net": {
          "type": "Number",
          "default": 0
        },
        "AVG": {
          "type": "Number",
          "default": 0
        },
        "TD": {
          "type": "Number",
          "default": 0
        },
        "Long": {
          "type": "Number",
          "default": 0
        },
        "AVG/G": {
          "type": "Number",
          "default": 0
        }
      },
      "passing": {
        "GP": {
          "type": "Number",
          "default": 0
        },
        "Rating": {
          "type": "Number",
          "default": 0
        },
        "COMP": {
          "type": "Number",
          "default": 0
        },
        "ATT": {
          "type": "Number",
          "default": 0
        },
        "INT": {
          "type": "Number",
          "default": 0
        },
        "%": {
          "type": "String",
          "default": "0%"
        },
        "YDS": {
          "type": "Number",
          "default": 0
        },
        "TD": {
          "type": "Number",
          "default": 0
        },
        "Long": {
          "type": "Number",
          "default": 0
        },
        "AVG/G": {
          "type": "Number",
          "default": 0
        }
      },
      "receiving": {
        "GP": {
          "type": "Number",
          "default": 0
        },
        "NO": {
          "type": "Number",
          "default": 0
        },
        "YDS": {
          "type": "Number",
          "default": 0
        },
        "AVG": {
          "type": "Number",
          "default": 0
        },
        "TD": {
          "type": "Number",
          "default": 0
        },
        "Long": {
          "type": "Number",
          "default": 0
        },
        "AVG/G": {
          "type": "Number",
          "default": 0
        }
      },
      "defensive": {
        "GP": {
          "type": "Number",
          "default": 0
        },
        "Solo": {
          "type": "Number",
          "default": 0
        },
        "ASST": {
          "type": "Number",
          "default": 0
        },
        "TOT": {
          "type": "Number",
          "default": 0
        },
        "TFL-YDS": {
          "type": "String",
          "default": "0-0"
        },
        "Sacks-YDS": {
          "type": "Number",
          "default": "0-0"
        },
        "INT": {
          "type": "Number",
          "default": 0
        },
        "BU": {
          "type": "Number",
          "default": 0
        },
        "QBH": {
          "type": "Number",
          "default": 0
        },
        "FR": {
          "type": "Number",
          "default": 0
        },
        "FF": {
          "type": "Number",
          "default": 0
        },
        "KICK": {
          "type": "Number",
          "default": 0
        },
        "SAF": {
          "type": "Number",
          "default": 0
        }
      },
      "punting": {
        "NO": {
          "type": "Number",
          "default": 0
        },
        "YDS": {
          "type": "Number",
          "default": 0
        },
        "AVG": {
          "type": "Number",
          "default": 0
        },
        "Long": {
          "type": "Number",
          "default": 0
        },
        "TB": {
          "type": "Number",
          "default": 0
        },
        "FC": {
          "type": "Number",
          "default": 0
        },
        "I20": {
          "type": "Number",
          "default": 0
        },
        "50+": {
          "type": "Number",
          "default": 0
        },
        "BLK": {
          "type": "Number",
          "default": 0
        }
      },
      "field_goals": {
        "FGM-FGA": {
          "type": "String",
          "default": "0-0"
        },
        "%": {
          "type": "String",
          "default": "0"
        },
        "I20": {
          "type": "String",
          "default": "0-0"
        },
        "20-29": {
          "type": "String",
          "default": "0-0"
        },
        "30-39": {
          "type": "String",
          "default": "0-0"
        },
        "40-49": {
          "type": "String",
          "default": "0-0"
        },
        "50+": {
          "type": "String",
          "default": "0-0"
        },
        "Long": {
          "type": "Number",
          "default": 0
        },
        "BLK": {
          "type": "Number",
          "default": 0
        }
      },
      "kickoffs": {
        "NO": {
          "type": "Number",
          "default": 0
        },
        "YDS": {
          "type": "Number",
          "default": 0
        },
        "AVG": {
          "type": "Number",
          "default": 0
        },
        "TB": {
          "type": "Number",
          "default": 0
        },
        "OB": {
          "type": "Number",
          "default": 0
        }
      },
      "punt_return": {
        "NO": {
          "type": "Number",
          "default": 0
        },
        "YDS": {
          "type": "Number",
          "default": 0
        },
        "AVG": {
          "type": "Number",
          "default": 0
        },
        "TD": {
          "type": "Number",
          "default": 0
        },
        "Long": {
          "type": "Number",
          "default": 0
        }
      },
      "kickoff_return": {
        "NO": {
          "type": "Number",
          "default": 0
        },
        "YDS": {
          "type": "Number",
          "default": 0
        },
        "AVG": {
          "type": "Number",
          "default": 0
        },
        "TD": {
          "type": "Number",
          "default": 0
        },
        "Long": {
          "type": "Number",
          "default": 0
        }
      }
    },
    "baseball": {
      "pitching": {
        "ERA": {
          "type": "Number",
          "default": 0
        },
        "WHIP": {
          "type": "Number",
          "default": 0
        },
        "W-L": {
          "type": "String",
          "default": "0-0"
        },
        "APP-GS": {
          "type": "String",
          "default": "0-0"
        },
        "CG": {
          "type": "Number",
          "default": 0
        },
        "SHO": {
          "type": "Number",
          "default": 0
        },
        "SV": {
          "type": "Number",
          "default": 0
        },
        "IP": {
          "type": "Number",
          "default": 0
        },
        "H": {
          "type": "Number",
          "default": 0
        },
        "R": {
          "type": "Number",
          "default": 0
        },
        "ER": {
          "type": "Number",
          "default": 0
        },
        "BB": {
          "type": "Number",
          "default": 0
        },
        "SO": {
          "type": "Number",
          "default": 0
        },
        "2B": {
          "type": "Number",
          "default": 0
        },
        "3B": {
          "type": "Number",
          "default": 0
        },
        "HR": {
          "type": "Number",
          "default": 0
        },
        "AB": {
          "type": "Number",
          "default": 0
        },
        "B/AVG": {
          "type": "Number",
          "default": 0
        },
        "WP": {
          "type": "Number",
          "default": 0
        },
        "HBP": {
          "type": "Number",
          "default": 0
        },
        "BK": {
          "type": "Number",
          "default": 0
        },
        "SFA": {
          "type": "Number",
          "default": 0
        },
        "SHA": {
          "type": "Number",
          "default": 0
        }
      },
      "fielding": {
        "C": {
          "type": "Number",
          "default": 0
        },
        "PO": {
          "type": "Number",
          "default": 0
        },
        "A": {
          "type": "Number",
          "default": 0
        },
        "E": {
          "type": "Number",
          "default": 0
        },
        "FLD%": {
          "type": "Number",
          "default": 0
        },
        "DP": {
          "type": "Number",
          "default": 0
        },
        "SBA": {
          "type": "Number",
          "default": 0
        },
        "CSB": {
          "type": "Number",
          "default": 0
        },
        "PB": {
          "type": "Number",
          "default": 0
        },
        "CI": {
          "type": "Number",
          "default": 0
        }
      },
      "batting": {
        "AVG": {
          "type": "Number",
          "default": 0
        },
        "OPS": {
          "type": "Number",
          "default": 0
        },
        "GP-GS": {
          "type": "String",
          "default": "0-0"
        },
        "AB": {
          "type": "Number",
          "default": 0
        },
        "R": {
          "type": "Number",
          "default": 0
        },
        "H": {
          "type": "Number",
          "default": 0
        },
        "2B": {
          "type": "Number",
          "default": 0
        },
        "3B": {
          "type": "Number",
          "default": 0
        },
        "HR": {
          "type": "Number",
          "default": 0
        },
        "RBI": {
          "type": "Number",
          "default": 0
        },
        "TB": {
          "type": "Number",
          "default": 0
        },
        "SLG%": {
          "type": "Number",
          "default": 0
        },
        "BB": {
          "type": "Number",
          "default": 0
        },
        "HBP": {
          "type": "Number",
          "default": 0
        },
        "SO": {
          "type": "Number",
          "default": 0
        },
        "GDP": {
          "type": "Number",
          "default": 0
        },
        "OB%": {
          "type": "Number",
          "default": 0
        },
        "SF": {
          "type": "Number",
          "default": 0
        },
        "SH": {
          "type": "Number",
          "default": 0
        },
        "SB-ATT": {
          "type": "String",
          "default": "0-0"
        }
      }
    },
    "id": {
      "type": "Number"
    },
    "#": {
      "type": "Number",
      "default": 0
    },
    "Name": {
      "type": "String",
      "required": [true, 'Player Must Have a Name']
    }
  });
  
  //Compile into a player model
  const Player = mongoose.model('Player', playerSchema);
  
  app.get('/player/', async function(req, res) {
      try {
        const playerData = await Player.find();
        console.log(playerData);
        const idList = playerData.map(item => item.id);
        res.json(idList);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
  });
  
  app.get('/player/:idNum', async function(req, res) {
      const idNum = req.params.idNum;
      try {
        const playerData = await Player.findOne({ id: idNum });
        console.log(playerData);
        res.json(playerData);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
  });
  
  app.post('/player/', async function(req, res) {
      try {
          const maxId = await Player.findOne().sort('-id');
          console.log('Highest id value:', maxId.id);
          req.body["id"] = maxId.id+1;
          const playerData = await Player.create(req.body);
          console.log(playerData);
          res.json(playerData);
      } catch (error) {
          console.error("Error posting data:", error);
          res.status(500).json({ error: "Internal Server Error" });
      }
  });
    
  app.post('/player/:idNum', async function(req, res) {
      let idTaken = await Player.exists({id: req.params.idNum}); 
      console.log(idTaken);
      if(idTaken){
          res.status(403).json({ error: "Document with id already exists" });
      }
      else{
          const idNum = req.params.idNum;
          obj = req.body;
          obj['id'] = idNum;
          try {
          const playerData = await Player.create(req.body);
          console.log(playerData);
          res.json(playerData);
          } catch (error) {
          console.error("Error posting data:", error);
          res.status(500).json({ error: "Internal Server Error" });
          }
      }
  });
  
  app.delete('/player/', function(req, res) {
    Player.deleteMany({});
  });
    
  app.delete('/player/:idNum', async function(req, res) {
      const idNum = req.params.idNum;
      try {
        const playerData = await Player.deleteOne({ id: idNum });
        console.log(playerData);
        res.json(playerData);
      } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
  });
  
  app.put('/player/', async function(req, res) {
      const filter = { };
      const update = req.body;
      try {
        const playerData = await Player.updateMany(filter, update);
        console.log(playerData);
        res.json(playerData);
      } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
  });
    
  app.put('/player/:idNum', async function(req, res) {
      const idNum = req.params.idNum;
      const filter = { id: idNum };
      const update = req.body;
      try {
        const playerData = await Player.findOneAndUpdate(filter, update);
        console.log(playerData);
        res.json(playerData);
      } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
  });




app.listen(port, async () => {
    // await mongoose.connect(process.env.MONGODB);
    console.log('Listening on *:3000');
});
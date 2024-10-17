const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const session = require('express-session');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(session({
    secret: 'your-secret-key', // Replace with your own secret key
    resave: false,
    saveUninitialized: true
}));



let profiles = {};
let histories = {};

// Route to check session status
app.get('/session', (req, res) => {
    res.json({ loggedIn: !!req.session.user });
});

// Route to handle profile data
app.post('/profile', (req, res) => {
    if (!req.session.user) {
        return res.status(403).json({ success: false, message: 'Not logged in' });
    }

    const userId = req.session.user.id;
    profiles[userId] = req.body;

    // Save profiles to file
    fs.writeFileSync('profiles.json', JSON.stringify(profiles));

    res.json({ success: true });
});

app.get('/profile-data', (req, res) => {
    if (!req.session.user) {
        return res.status(403).json({ success: false, message: 'Not logged in' });
    }

    const userId = req.session.user.id;
    res.json({ success: true, profile: profiles[userId] || {} });
});

// Route to handle connection history
app.post('/history', (req, res) => {
    if (!req.session.user) {
        return res.status(403).json({ success: false, message: 'Not logged in' });
    }

    const userId = req.session.user.id;
    if (!histories[userId]) {
        histories[userId] = [];
    }

    // Add new entry to history
    histories[userId].push({
        port: req.body.port,
        time: new Date().toLocaleString()
    });

    // Save histories to file
    fs.writeFileSync('histories.json', JSON.stringify(histories));

    res.json({ success: true });
});

// Load profiles and histories from file
if (fs.existsSync('profiles.json')) {
    profiles = JSON.parse(fs.readFileSync('profiles.json'));
}

if (fs.existsSync('histories.json')) {
    histories = JSON.parse(fs.readFileSync('histories.json'));
}

// Database setup
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, email TEXT, phone TEXT)");
});

// Helper function to check if user is logged in
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/');
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/profile', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});

app.get('/connect', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'connect.html'));
});

app.get('/report.pdf', (req, res) => {
    const filePath = path.join(__dirname, 'report.pdf');
    res.download(filePath);
});

app.post('/signup', (req, res) => {
    const { username, password, email, phone } = req.body;
    db.run(`INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)`, [username, password, email, phone], function(err) {
        if (err) {
            return res.status(500).send("Error occurred while signing up");
        }
        req.session.user = { id: this.lastID, username, email, phone };
        res.redirect('/profile');
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) {
            return res.status(500).send("Error occurred while logging in");
        }
        if (!row) {
            return res.status(400).send("Invalid username or password");
        }
        req.session.user = row;
        res.redirect('/profile');
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Error occurred while logging out");
        }
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


app.get('/admin', (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
            return res.status(500).send("Error occurred while retrieving users");
        }
        res.json(rows);
    });
});



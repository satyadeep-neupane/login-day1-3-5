const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const session = require('express-session');
app.use(session({
    secret: 'random',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

app.get('/set', (req, res) => {
    res.cookie('name', 'express', {
        maxAge: 1000 * 60 * 60 * 24,
        secure: false,
        httpOnly: true,
    });
    res.cookie('lang', 'np', {
        // expires
        expires: new Date(Date.now() + 2000 * 60 * 60 * 24),
    })
    res.send('cookie set');
});

app.get('/get', (req, res) => {
    res.send(req.cookies);
})

app.get('/set-session', (req, res) => {
    const { name = "express" } = req.query;
    console.log(name);
    req.session.name = name;
    res.send("Session set");
});

app.get('/get-session', (req, res) => {
    res.send(req.session);
})


app.listen(3000, () => {
    console.log('Server started on port 3000');
});
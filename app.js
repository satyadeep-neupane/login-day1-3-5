const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt  = require('bcrypt');

const session = require('express-session');
app.use(session({
    secret: "XEYR-UURW_DHWY",
    resave: false,
    saveUninitialized: true,
}));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/login');

const User = require('./model.user');

app.get('/', (req, res) => {
    res.render('login');
})

app.get('/user', async(req, res) => {
    const users = await User.find();
    res.send(users);
})

app.post('/user', async(req, res) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });
    
    user.password = await bcrypt.hash(user.password, 10);

    await user.save();
    res.send(user);
});

app.post('/login', async(req, res) => {
    try{
        const { email, password} = req.body;
        if(!email || !password)
            return res.send("Provide Email and Password");
    
        const user = await User.findOne({ email });
    
        if(user == null)
        {
            return res.send("Invalid Username or Password");
        }else{
            const validPassword = await bcrypt.compare(password, user.password);
    
            if(!validPassword)
                return res.send("Invalid Username or Password");
        
            req.session.user = user;
        
            res.redirect('/home');
        }
    }catch(err)
    {
        return res.send(err.message);
    }
});

function auth (req, res, next){
    if(req.session.user)
        next();
    else
        res.redirect('/');
} 

app.use(auth);

app.get('/home', (req, res) => {
    res.render('home');
})

app.get('/about', (req, res) => {
    res.render('about');
})


app.listen(5000);
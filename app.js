const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const User = require('./models/user'); 
const ejs=require('ejs')


// Database Connection
mongoose.connect('mongodb://localhost:27017/task3')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'yourSecretKey', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user; 
    next();
});


const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; 
        return res.redirect('/login');
    }
    next();
};

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})


app.get('/', (req, res) => {
    
    res.render('home');
});



app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            res.redirect('/');
        });
    } catch (e) {
        res.redirect('register');
    }
});

app.get('/login',(req, res) => {
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login'
}), (req, res) => {
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});


// Logout Route
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});


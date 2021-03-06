const express = require('express');
const app = express();

const env = require('./config/environment');
const logger = require('morgan');
require('./config/view-helpers')(app);
const port = 8000;
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
// Cookie Parser not needed now in newer versions of express-session since 1.5.0
// const cookieParser = require('cookie-parser');

const db = require('./config/mongoose');

// used for session cookie
// Using cookie-parser may result in issues if the secret is not the same between express-session and cookie-parser
const session = require('express-session');
// For passport, require both passport and passport-local config module
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy'); // runs this code to define all the functions in passport
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

// MongoStore for persistent sessions, to maintain sessions even when server is restarted
const MongoStore = require('connect-mongo')(session);

// Require node-sass-middleware
const sassMiddleware = require('node-sass-middleware');

// Require connect-flash , library for notifications
const flash = require('connect-flash');
const customMware = require('./config/middleware');

// Setting up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Socket.io Setup
// const chatServer = require('http').Server(app);
// const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
// chatServer.listen(5000);
// console.log("Chat Server is listening on port 5000");

// Middle for sass
if(env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug: false,
        outputStyle: 'extended',
        prefix: '/css'
    }));
}

// Middleware to set up Static File Access
app.use(express.static(env.asset_path));

// Make uploads path available to browser
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Middleware to parse the requests body of post requests
app.use(express.urlencoded({extended: true}));

// Middleware for cookie parser
// app.use(cookieParser());

// Middleware to set up Layouts
app.use(expressLayouts);

// Extract styles and scripts from the subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Logger Middleware
app.use(logger(env.morgan.mode, env.morgan.options));

// Session middleware
// mongo store is used to store the session cookie in MongoDB
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'
    }, function(err){
        console.log(err || 'connect-mongo setup ok');
    })
}));

// Passportjs middlewares
app.use(passport.initialize()); // Initializes passportjs
app.use(passport.session()); // Used to get the true deserialized object from cookie

// Middleware to set the authenticated user in req.locals for the views
app.use(passport.setAuthenticatedUser);

// Middleware for connect-flash, just below session
app.use(flash());
app.use(customMware.setFlash);
app.use(customMware.setFriendRequestUsers);

// use express router
app.use('/', require('./routes'));

const chatServer = app.listen(port, function(err){
    if(err){
        console.log(err);
        return;
    }

    console.log(`Server is running on port : ${port}`);
});

const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
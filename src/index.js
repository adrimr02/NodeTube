const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const multer = require('multer');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

//Initializations
const app = express();
require('./database');
const routes = require('./routes/index');

//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./helpers/handlebars')
  }));
app.set('view engine', '.hbs');
const SESS_NAME = 'user_sid';

//Middlewares
app.use(session({
    name: SESS_NAME,
    cookie: {
        maxAge: 1000*60*60*24,
        sameSite: true,
        secure: false
    },
    secret: 'nodetubesession',
    resave: false,
    saveUninitialized: false
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer({ dest: path.join(__dirname, 'public/tempfiles') }).fields([
    { name: 'video' },
    { name: 'thumbnail' }
]));

//Routes
require('./routes/index');
app.use(routes);

//Static files
app.use(express.static(path.join(__dirname, 'public')));

//Starting server
app.listen(app.get('port'), () => console.log(`Server running in port ${app.get('port')}`));
const User = require('../models/User');
const users = require('../helpers/users');
const Channel = require('../models/Channel')
const SESS_NAME = require('../index').SESS_NAME;
ctrl = {}

ctrl.settings = (req, res) => {
    if (!req.session.userId) {
        res.redirect('/signin');
    } else {
        res.render('settings', {
            title: 'NodeTube',
            channel_test: true,
            settings: false,
            logged: req.session.logged,
            user: req.session.user,
            channel: req.session.channel
        });
    }
    
}

ctrl.update = (req, res) => {

}

ctrl.signup = (req, res) => {
    if (req.session.userId) {
        res.redirect('/');
    } else {
        res.render('auth/signup', {
            title: 'NodeTube'
        });
    }
}

ctrl.register = async (req, res) => {
    const { username, email, channelname, password, confirm_password } = req.body;
    const errors = []
    const name = await User.findOne({username: username});
    const channel = await User.findOne({channel: channelname});
    const useremail = await User.findOne({email: email});
    if (password != confirm_password) {
        errors.push({text: 'Las contraseñas no coinciden'});
    }
    if (password.length < 4) {
        errors.push({text: 'La contraseña debe de tener al menos 4 caracteres'});
    }
    if (name) {
        errors.push({text: 'Nombre de usuario en uso'});
    }
    if (channel) {
        errors.push({text: 'Canal ya existente'});
    }
    if (useremail) {
        errors.push({text: 'Email en uso'});
    }
    if(errors.length > 0) {
        res.render('auth/signup', {errors, username, channelname, email});
    } else {
        const newuser = new User({username, email, channel: channelname, password});
        const newchannel = new Channel({channel: channelname, username});
        await newchannel.save();
        await newuser.save();
        res.redirect('/signin');
    }
}

ctrl.signin = (req, res) => {
    if (req.session.userId) {
        res.redirect('/');
    } else {
        res.render('auth/signin', {
            title: 'NodeTube'
        });
    }
}

ctrl.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await users.password(email, password);
    if (user === true) {
        const { id, username, channel } = await users.findId(email);
        req.session.userId = id;
        req.session.logged = true
        req.session.user = username;
        req.session.channel = channel;
        res.redirect('/');
    } else {
        const errors = user;
        req.session.logged = false;
        res.render('auth/signin', {errors, email});
    }
}

ctrl.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie(SESS_NAME);
        res.redirect('/')
    });
}

module.exports = ctrl;
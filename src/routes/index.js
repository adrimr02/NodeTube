const router = require('express').Router();

const home = require('../controllers/home');
const channel = require('../controllers/channel');
const users = require('../controllers/users');

//MAIN

router.get('/', home.main);
router.get('/subscriptions');
router.get('/settings', users.settings);
router.get('/video/:id', channel.video);
router.get('/view/:id', channel.view);
router.post('/video/:id/like', channel.like);
router.post('/video/:id/comment', channel.comment);

//CHANNEL
router.get('/channel/:name', channel.channel);
router.get('/channel/:name/videos', channel.channelVideos);
router.get('/channel/:name/info', channel.channelInfo);
router.get('/channel/:name/settings', channel.channelSettings);
router.post('/channekl/:name/subscribe', channel.subscribe);
router.get('/new-video', channel.newVideo);
router.post('/new-video', channel.uploadVideo);
router.delete('/video/delete/:id', channel.deleteVideo);


//USERS
router.get('/signup', users.signup);
router.get('/signin', users.signin);
router.get('/logout', users.logout);
router.post('/signup', users.register);
router.post('/signin', users.login);
router.post('/updateuser', users.update);

module.exports = router;
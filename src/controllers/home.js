ctrl = {}

ctrl.main = (req, res) => {
    res.render('home', {
        title: 'NodeTube',
        channel_test: true,
        setting: true,
        logged: req.session.logged,
        user: req.session.user,
        channel: req.session.channel
    });
}

module.exports = ctrl;
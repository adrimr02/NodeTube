const User = require('../models/User');

const ctrl = {}

ctrl.findId = async (email) => {
    const user = await User.findOne({email});
    const { id, username, channel } = user;
    return {id, username, channel };
}
ctrl.password = async (email, user_password) => {
    const user = await User.findOne({email});
    const errors = []
    if (user) {
        const { password } = user;
        if (password === user_password) {
            return true;
        } else {
            errors.push({text: 'La contraseña es incorrecta'});
            return errors;
        }
    } else {
        errors.push({text: 'El usuario no existe'});
        return errors;
    }
    
}

module.exports = ctrl;
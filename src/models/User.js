const mongoose = require('mongoose')
const { Schema } = mongoose;

const LinkSchema = new Schema({
    username: String,
    email: String,
    channel: String,
    password: String,
    registered_at: { type: Date, default: Date.now },
    subscriptions: Array
});

module.exports = mongoose.model('Users', LinkSchema);
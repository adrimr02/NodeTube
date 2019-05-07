const mongoose = require('mongoose')
const { Schema } = mongoose;

const LinkSchema = new Schema({
    channel: String,
    username: String,
    links: Array,
    description: String,
    subscribers: { type: Number, default: 0},
    views: { type: Number, default: 0},
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Channel', LinkSchema);
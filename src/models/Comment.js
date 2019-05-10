const mongoose = require('mongoose')
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId;

const LinkSchema = new Schema({
    user: String,
    video_id: {type: ObjectId},
    comment: String,
    posted_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', LinkSchema);
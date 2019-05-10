const mongoose = require('mongoose')
const { Schema } = mongoose;
const path = require('path');

const LinkSchema = new Schema({
    title: String,
    description: String,
    channel: String,
    views: { type: Number, default: 0},
    likes: { type: Number, default: 0},
    likes_users: Array,
    //dislikes: { type: Number, default: 0},
    created_at: { type: Date, default: Date.now },
    video_filename: String,
    video_path: String,
    thumbnail_filename: String,
    thumbnail_path: String
});

LinkSchema.virtual('uniqueId')
    .get(function() {
        return this.video_filename.replace(path.extname(this.video_filename), '');
    });
    

module.exports = mongoose.model('Video', LinkSchema);
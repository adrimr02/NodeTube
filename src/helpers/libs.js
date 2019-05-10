const uuid = require('uuid/v4');
const { Video, User, Channel, Comment } = require('../models');

ctrl = {}

ctrl.arrayExtracter = (array) => {
    const [first] = array;
    return first;
}

ctrl.validName = async (videoExt, thumbExt) => {
    async function videoName(videoExt) {
        const video_filename = uuid() + videoExt;
        const video_test = await Video.find({video_filename});
        if (video_test > 0) {
            videoName();
        } else {
            return video_filename;
        }
    }
    async function thumbName(thumbExt) {
        const thumbnail_filename = uuid() + thumbExt;
        const thumb_test = await Video.find({thumbnail_filename});
        if (thumb_test > 0) {
            thumbName();
        } else {
            return thumbnail_filename;
        }
    }
    const video_filename = await videoName(videoExt);
    const thumbnail_filename = await thumbName(thumbExt);
    return { video_filename, thumbnail_filename };
}

ctrl.commentMaker = async (comments) => {
    var video_comments = []
    for (var i = 0; i<comments.length; i++) {
        comment = comments[i];
        comment_user = await User.findOne({username: comment.user});
        video_comments.push({
            comment_id: comment._id,
            video_id: comment.video_id,
            comment: comment.comment,
            posted_at: comment.posted_at,
            username: comment_user.username,
            user_channel: comment_user.channel
        });
    }
    return video_comments;
}
module.exports = ctrl;
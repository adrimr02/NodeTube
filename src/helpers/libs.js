const uuid = require('uuid/v4');
const { Video } = require('../models');

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
    console.log(video_filename);
    console.log(thumbnail_filename);
    return { video_filename, thumbnail_filename };
}

module.exports = ctrl;
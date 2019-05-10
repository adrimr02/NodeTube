const path = require('path');
const fs = require('fs-extra');
const { Channel, Video, Comment } = require('../models');
const libs = require('../helpers/libs');

ctrl = {}

ctrl.video = async (req, res) => {
    const id = req.params.id;
    const video = await Video.findOne({_id: id})
    const comments = await Comment.find({video_id: id}).sort({posted_at: -1});
    const v_comments = await libs.commentMaker(comments);
    var {views} = video;
    const {channel} = video
    const v_channel = await Channel.findOne({channel: channel});
    var c_views = v_channel.views;
    const v_id = v_channel._id;
    var liked = false;
    views++;
    c_views++;
    await Video.findOneAndUpdate({_id: id, views: views});
    await Channel.findOneAndUpdate({_id: v_id, views: c_views});
    if (video.likes_users.includes(req.session.user)) {
        liked = true;
    } else {
        liked = false;
    }
    res.render('channel/video', {
        title: 'NodeTube',
        channel_test: true,
        settings: true,
        logged: req.session.logged,
        user: req.session.user,
        channel: req.session.channel,
        video,
        liked,
        channel: v_channel,
        comments: v_comments,
        id
    })
}

ctrl.comment = async (req, res) => {
    const newComment = new Comment({
        user: req.session.user,
        video_id: req.params.id,
        comment: req.body.comment 
    });
    if (!req.session.user) {
        res.redirect(`/video/${req.params.id}`);
    } else{
        await newComment.save();
        res.redirect(`/video/${req.params.id}`);
    }
}

ctrl.like = async (req, res) => {
    const video = await Video.findOne({_id: req.params.id});
    if (video) {
        if (req.session.user) {
            if (video.likes_users.includes(req.session.user)) {
                res.json({likes: video.likes + ' Ya has dado me gusta a este video'});
            } else {
                video.likes_users.push(req.session.user);
                video.likes++;
                await video.save();
                res.json({likes: video.likes});
            }
        }
    }
}

ctrl.view = async (req, res) => {
    const id = req.params.id;
    const {video_filename} = await Video.findOne({_id: id});
    const path = `src/public/videos/${video_filename}`;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize-1

        const chunksize = (end-start)+1;
        const file = fs.createReadStream(path, {start, end});
        const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
        }

        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
    }
}

ctrl.channel = async (req, res) => {
    const channel = req.params.name;
    const { subscribers } = await Channel.findOne({channel});
    var own_channel = false;
    if (req.session.channel === channel) {
        own_channel = true;
    } else {
        own_channel = false;
    }
    
    res.render('channel/channel', {
        title: 'NodeTube',
        channel_test: false,
        settings: true,
        logged: req.session.logged,
        user: req.session.user,
        channel,
        own_channel,
        subscribers
    });
}

ctrl.channelVideos = async(req, res) => {
    const channel = req.params.name;
    const videos = await Video.find({channel: channel}).sort({created_at: -1});
    var own_channel = false;
    if (req.session.channel === channel) {
        own_channel = true;
    } else {
        own_channel = false;
    }
    res.render('channel/channel-videos', {
        title: 'NodeTube',
        channel_test: false,
        settings: true,
        logged: req.session.logged,
        user: req.session.user,
        channel,
        own_channel,
        videos
    });
}

ctrl.channelInfo = (req, res) => {
    const channel = req.params.name;
    var own_channel = false;
    if (req.session.channel === channel) {
        own_channel = true;
    } else {
        own_channel = false;
    }
    res.render('channel/channel-info', {
        title: 'NodeTube',
        channel_test: false,
        settings: true,
        logged: req.session.logged,
        user: req.session.user,
        channel,
        own_channel
    });
}

ctrl.channelSettings = async (req, res) => {
    const channel = req.params.name;
    if (req.session.logged) {
        if (channel === req.session.channel) {
            const videos = await Video.find({channel: req.params.name}).sort({created_at: -1});
            res.render('channel/settings', {
                title: 'NodeTube',
                logged: req.session.logged,
                settings: true,
                channel_test: false,
                channel: req.session.channel,
                user: req.session.user,
                own_channel: true,
                videos
            });
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/');
    }
}

ctrl.newVideo = async (req, res) => {
    const channel = await Channel.findOne({channel: req.session.channel});
    if (!req.session.userId) {
        res.redirect('/signin');
    } else {
        res.render('channel/new-video', {
            title: 'NodeTube',
            channel_test: false,
            settings: true,
            logged: req.session.logged,
            user: req.session.user,
            channel
        });
    }
}

ctrl.uploadVideo = async (req, res) => {
    const channel = await Channel.findOne({channel: req.session.channel});
    const errors = [];
    const video = libs.arrayExtracter(req.files.video);
    const thumbnail = libs.arrayExtracter(req.files.thumbnail);
    const videoTempPath = video.path;
    const thumbTempPath = thumbnail.path;
    const videoExt = path.extname(video.originalname);
    const thumbExt = path.extname(thumbnail.originalname);
    const { video_filename, thumbnail_filename } = await libs.validName(videoExt, thumbExt);
    const videoTargetPath = path.resolve(`src/public/videos/${video_filename}`);
    const thumbTargetPath = path.resolve(`src/public/thumbnails/${thumbnail_filename}`);
    if (videoExt !== '.mp4' && videoExt !== '.avi' && videoExt !== '.mkv' && videoExt !== '.flv') {
        errors.push({text: 'Formato de video no soportado'});
    }
    if (thumbExt !== '.jpg' && thumbExt !== '.png' && thumbExt !== '.pneg') {
        errors.push({text: 'Formato de imagen no soportado'});
    }
    if (errors.length > 0) {
        await fs.unlink(thumbTempPath);
        await fs.unlink(videoTempPath);
        res.render('channel/new-video', {
            title: 'NodeTube',
            channel_test: false,
            settings: true,
            logged: req.session.logged,
            user: req.session.user,
            channel,
            errors,
            v_title: req.body.title,
            description: req.body.description
        });
    } else {
        await fs.rename(thumbTempPath, thumbTargetPath);
        await fs.rename(videoTempPath, videoTargetPath);
        const newVideo = new Video({
            title: req.body.title,
            description: req.body.description,
            channel: req.session.channel,
            video_filename,
            video_path: videoTargetPath,
            thumbnail_filename,
            thumbnail_path: thumbTargetPath
        });
        await newVideo.save();
        res.redirect(`/channel/${req.session.channel}`);
        }
}

ctrl.deleteVideo = async (req, res) => {
    const video_id = req.params.id;
    const video = await Video.findOne({_id: video_id});
    if (video.channel === req.session.channel) {
        if (video) {
            await fs.unlink(path.resolve('./src/public/videos/' + video.video_filename));
            await fs.unlink(path.resolve('./src/public/thumbnails/' + video.thumbnail_filename));
            await Comment.deleteMany({video_id});
            await Video.findOneAndDelete({_id: video_id});
            res.json({deleted: true});
        } else {
            res.json({deleted: false});
        }
    } else {
        res.json({deleted: false});
    }
}

ctrl.subscribe = (req, res) => {
    
}

module.exports = ctrl;
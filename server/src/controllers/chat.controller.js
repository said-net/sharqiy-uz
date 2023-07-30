const chatModel = require("../models/chat.model");
const messageModel = require("../models/message.model");
const moment = require("moment");
module.exports = {
    newMessage: async (req, res) => {
        const { message } = req.body;
        const $chat = await chatModel.findOne({ from: req.user.id });
        if (!$chat) {
            new chatModel({
                from: req.user.id,
                lastUpdate: moment.now() / 1000
            }).save().then($saved => {
                new messageModel({
                    chat: $saved._id,
                    message,
                    created: moment.now() / 1000,
                    from: 'user'
                }).save().then(($msg) => {
                    res.send({
                        ok: true,
                        data: $msg
                    });
                }).catch(err => {
                    console.log(err);
                    res.send({
                        ok: false,
                        msg: "bir daqiqadan so'ng urunib ko'ring!"
                    })
                });
            }).catch(err => {
                console.log(err);
                res.send({
                    ok: false,
                    msg: "bir daqiqadan so'ng urunib ko'ring!"
                })
            });
        } else {
            $chat.set({ lastUpdate: moment.now() / 1000 }).save().then(() => {
                new messageModel({
                    chat: $saved._id,
                    message,
                    created: moment.now() / 1000,
                    from: 'user'
                }).save().then(($msg) => {
                    res.send({
                        ok: true,
                        data: $msg
                    });
                }).catch(err => {
                    console.log(err);
                    res.send({
                        ok: false,
                        msg: "bir daqiqadan so'ng urunib ko'ring!"
                    })
                });
            })
        }
    },
    getMessages: async (req, res) => {
        const $chat = await chatModel.findOne({ from: req.user.id });
        if (!$chat) {
            res.send({
                ok: false,
                msg: "Sizda habarlar mavjud emas!"
            });
        } else {
            const $messages = await messageModel.find({ chat: $chat._id });
            res.send({
                ok: true,
                data: $messages
            });
        }
    },
    newMessageFromAdmin: async (req, res) => {
        const { message } = req.body;
        const { id } = req.params;
        const $chat = await chatModel.findById(id);
        $chat.set({ lastUpdate: moment.now() / 1000 }).save().then(() => {
            new messageModel({
                chat: $saved._id,
                message,
                created: moment.now() / 1000,
                from: 'boss'
            }).save().then(($msg) => {
                res.send({
                    ok: true,
                    data: $msg
                });
            }).catch(err => {
                console.log(err);
                res.send({
                    ok: false,
                    msg: "bir daqiqadan so'ng urunib ko'ring!"
                })
            });
        })

    },
    getChats: async (req, res) => {
        const $chats = await chatModel.find().populate('from')
        const $modded = $chats.sort((a, b) => { a.lastUpdate - b.lastUpdate });
        res.send({
            ok: true,
            msg: $modded
        });
    },
    selectChat: async (req, res) => {
        const $messages = await messageModel.find({ chat: req.params.id });
        res.send({
            ok: true,
            data: $messages
        });
    }
}
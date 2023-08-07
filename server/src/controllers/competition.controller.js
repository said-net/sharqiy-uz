const moment = require('moment');
const competitionModel = require('../models/competition.model');
const md5 = require('md5');
const shopModel = require('../models/shop.model');
module.exports = {
    createCompetition: async (req, res) => {
        const { title, about, duration } = req.body;
        const image = req?.files?.image;
        const start = moment.now() / 1000;
        const end = (moment.now() / 1000) + (duration * 86400);
        // console.log(`start ${start}`);
        // console.log(`end ${end}`);
        // const date = moment.unix(start).format("d:M:yyyy")
        // console.log(`start ${date}`);

        if (!title || !about || !duration || !image) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring yoki rasm kiriting!"
            });
        } else {
            const filePath = `/public/competitions/${md5(title)}.png`;
            const $concurs = (await competitionModel.find()).reverse()
            if ($concurs[0] && $concurs[0].end > moment.now() / 1000) {
                $concurs[0].set({ end: moment.now() / 1000 }).save();
            }
            new competitionModel({
                title,
                about,
                image: filePath,
                start,
                end
            }).save().then(() => {
                image.mv(`.${filePath}`);
                res.send({
                    ok: true,
                    msg: "Saqlandi!"
                });
            });
        }
    },
    getAll: async (req, res) => {
        const $c = await competitionModel.find();
        const c = [];
        $c.forEach(e => {
            c.push({
                id: e._id,
                title: e.title,
                about: e.about,
                // image: SERVER_LINK + e.image,
                start: moment.unix(e.start).format("DD.MM.YYYY"),
                end: moment.unix(e.end).format("DD.MM.YYYY"),
                ended: e.end < moment.now() / 1000 ? true : false,
            });
        });
        res.send({
            ok: true,
            data: c.reverse()
        })
    },
    getOne: async (req,res)=>{
        const {id} = req.params;
        
    }
}
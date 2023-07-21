const md5 = require("md5");
const categoryModel = require("../models/category.model");
const { SERVER_LINK } = require("../configs/env");

module.exports = {
    create: (req, res) => {
        const { title, background } = req.body;
        const image = req?.files?.image;
        if (!image) {
            res.send({
                ok: false,
                msg: "Rasm tanlang!"
            });
        } else if (!title) {
            res.send({
                ok: false,
                msg: "Nom kiriting!"
            });
        } else {
            const filePath = `/public/categories/${md5(image.name + title)}.png`;
            new categoryModel({
                title,
                image: filePath,
                background
            }).save().then(() => {
                image.mv(`.${filePath}`);
                res.send({
                    ok: true,
                    msg: "Category created!"
                });
            }).catch(() => {
                res.send({
                    ok: false,
                    msg: "Error saving category!"
                });
            });
        }
    },
    getAll: async (req, res) => {
        const $categories = await categoryModel.find();
        const $modded = [];
        $categories.forEach(e => {
            $modded.push({
                id: e._id,
                image: SERVER_LINK + e.image,
                title: e.title,
                background: e.background
            });
        });
        res.send({
            ok: true,
            data: $modded
        });
    },
    edit: async (req,res)=>{
    }
}
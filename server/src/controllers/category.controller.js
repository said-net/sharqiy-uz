const md5 = require("md5");
const categoryModel = require("../models/category.model");
const { SERVER_LINK } = require("../configs/env");
const fs = require("fs");
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
    // 
    getAll: async (req, res) => {
        const $categories = await categoryModel.find();
        const $modded = [];
        $categories.forEach(e => {
            $modded.push({
                id: e._id,
                image: SERVER_LINK + e.image,
                title: e.title,
                background: e.background,
                hidden: e.hidden
            });
        });
        res.send({
            ok: true,
            data: $modded
        });
    },
    // 
    edit: async (req, res) => {
        const { id } = req.params;
        try {
            const $category = await categoryModel.findById(id);
            const { title, background } = req.body;
            const image = req?.files?.image;
            if (!title) {
                res.send({
                    ok: false,
                    msg: "Nom kiriting!"
                });
            } else if (!image) {
                $category.set({ title, background }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Saqlandi!"
                    })
                });
            } else {
                fs.unlink(`.${$category.image}`, () => { });
                const filePath = `/public/categories/${md5(image.name + title)}.png`;
                $category.set({ title, background, image: filePath }).save().then(() => {
                    image.mv(`.${filePath}`);
                    res.send({
                        ok: true,
                        msg: "Saqlandi!"
                    })
                })
            }
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Nimadir hato!"
            })
        }
    },
    // 
    delete: async (req, res) => {
        const { id } = req.params;
        const $category = await categoryModel.findById(id);
        $category.set({ hidden: true }).save().then(() => {
            res.send({
                ok: true,
                msg: "O'chirildi!"
            });
        });
    },
    // 
    recovery: async (req, res) => {
        const { id } = req.params;
        const $category = await categoryModel.findById(id);
        $category.set({ hidden: false }).save().then(() => {
            res.send({
                ok: true,
                msg: "Tiklandi!"
            });
        });
    }
}
const md5 = require("md5");
const mainModel = require("../models/main.model");
const fs = require("fs");
const productModel = require("../models/product.model");
const { SERVER_LINK } = require("../configs/env");
const settingModel = require("../models/setting.model");
const moment = require("moment");
module.exports = {
    getMainMenu: async (req, res) => {
        const $ads = await mainModel.find().populate('product');
        const $products = await productModel.find({ hidden: false });
        const $p = [];
        const $a = [];
        $products?.forEach((p) => {
            $p.push({
                id: p?._id,
                title: p?.title,
            });
        });
        $ads.forEach((a) => {
            $a.push({
                id: a?._id,
                image: SERVER_LINK + a?.image,
                product: a?.product.title
            });
        })
        res.send({
            ok: true,
            data: $a,
            products: $p
        });
    },
    createPost: async (req, res) => {
        const image = req?.files?.image;
        const { product } = req.body;
        if (!image || !product) {
            res.send({
                ok: false,
                msg: "Rasm yoki mahsulotni tanlang!"
            });
        } else {
            const filePath = `/public/main/${md5(product)}.png`;
            new mainModel({
                image: filePath,
                product,
            }).save().then(() => {
                image.mv(`.${filePath}`);
                res.send({
                    ok: true,
                    msg: "Saqlandi!"
                })
            }).catch(() => {
                res.send({
                    ok: false,
                    msg: "Nimadir Hato!"
                });
            });
        }
    },
    deletePost: async (req, res) => {
        const { id } = req.params;
        const $post = await mainModel.findById(id);
        fs.unlink(`.${$post.image}`, () => { });
        $post.deleteOne().then(() => {
            res.send({
                ok: true,
                msg: "O'chirildi!"
            });
        }).catch((err) => {
            console.log(err);
            res.send({
                ok: false,
                msg: "Nimadir xato!"
            });
        });
    },
    getMainForClient: async (req, res) => {
        const $main = await mainModel.find();
        const main = []
        const $products = await productModel.find({ hidden: false });
        const $settings = await settingModel.find();
        const videos = [];
        const products = [];
        $products.forEach(p => {
            products.push({
                ...p._doc,
                id: p._id,
                image: SERVER_LINK + p.images[0],
                original_price: 0,
                price: p?.price + p?.for_admins + $settings[0].for_operators,
                value: p.value - p.solded,
                old_price: p?.old_price ? p?.old_price + p?.for_admins + $settings[0].for_operators : null,
                bonus: p.bonus && p.bonus_duration > moment.now() / 1000,
                // bonus_duration: p.bonus ? moment.unix(p.bonus_duration).format('DD.MM.YYYY HH:mm') : 0,
                category: {
                    id: p.category._id,
                    title: p.category.title,
                    image: SERVER_LINK + p.category.image
                }
            });
            videos.push({
                id: p._id,
                product: p.title,
                video: p.video
            });
        });
        $main.forEach(m => {
            main.push({
                id: m.product,
                image: SERVER_LINK + m?.image
            })
        })
        res.send({
            ok: true,
            data: {
                products,
                main,
                videos
            }
        });
    }
}
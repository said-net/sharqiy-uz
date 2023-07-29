const md5 = require("md5");
const productModel = require("../models/product.model");
const moment = require("moment/moment");
const { SERVER_LINK } = require("../configs/env");
const valuehistoryModel = require("../models/valuehistory.model");

module.exports = {
    create: (req, res) => {
        const { title, about, price, original_price, video, category, value } = req.body;
        const images = req?.files?.images[0] ? [...req?.files?.images] : [req?.files?.images];
        if (!title || !about || !price || !video || !category || !original_price || !value) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else if (!images) {
            res.send({
                ok: false,
                msg: "Rasm yuklang min: 1, max: 5"
            });
        } else if (images?.length > 5) {
            res.send({
                ok: false,
                msg: "Rasm max: 5 ta"
            });
        } else {
            const imgs = [];
            images?.forEach((img, i) => {
                const filePath = `/public/products/${md5(img?.name + new Date() + i)}.png`;
                imgs.push(filePath);
                img.mv(`.${filePath}`);
            })
            new productModel({
                title,
                about,
                price,
                original_price,
                video,
                category,
                images: imgs,
                value,
                created: moment.now() / 1000
            }).save().then(($saved) => {
                new valuehistoryModel({
                    product: $saved._id,
                    value,
                    created: moment.now() / 1000
                }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Saqlandi!"
                    });
                });
            });
        }
    },
    addValue: (req, res) => {
        const { value } = req.body;
        const { id } = req.params;
        if (!value || value < 1) {
            res.send({
                ok: false,
                msg: "Miqdor kiriting!"
            });
        } else {
            try {
                new valuehistoryModel({
                    product: id,
                    value,
                    created: moment.now() / 1000
                }).save().then(async () => {
                    const $product = await productModel.findById(id);
                    $product.set({ value: $product.value + value }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "Miqdor kiritildi!"
                        });
                    });
                }).catch(() => {
                    res.send({
                        ok: false,
                        msg: "Nimadir hato!"
                    })
                })
            } catch (error) {
                res.send({
                    ok: false,
                    msg: "Nimadir hato!"
                })
            }
        }
    },
    //
    edit: async (req, res) => {
        const { id } = req.params;
        console.log(req.body);
        try {
            const $product = await productModel.findById(id);
            $product.set(req.body).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Saqlandi!"
                })
            })
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Nimadir hato!"
            })
        }
    },
    getAllProductsToAdmin: async (req, res) => {
        const $products = await productModel.find()
        const $modlist = [];
        $products.forEach(p => {
            $modlist.push({
                ...p._doc,
                id: p._id,
                image: SERVER_LINK+p?.images[0],
                created: moment.unix(p.created).format('YYYY-MM-DD'),
                value: p.value - p.solded,
                bonus: p.bonus && p.bonus_duration > moment.now() / 1000,
                bonus_duration: p.bonus ? moment.unix(p.bonus_duration).format('DD.MM.YYYY HH:mm') : 0,
                bonus_count: p.bonus ? p.bonus_count : 0,
                bonus_given: p.bonus ? p.bonus_given : 0,
                category:p?.category
            });
        });
        res.send({
            ok: true,
            data: $modlist
        });
    },
    // 
    getOneToAdmin: async (req, res) => {
        const { id } = req.params;
        try {
            const $product = await productModel.findById(id).populate('category', 'title background image');
            const product = {
                ...$product._doc,
                id: $product._id,
                images: [...$product.images.map(e => {
                    return SERVER_LINK + e
                })],
                value: $product.value - $product.solded,
                bonus: $product.bonus && $product.bonus_duration > moment.now() / 1000,
                bonus_duration: $product.bonus ? moment.unix($product.bonus_duration).format('DD.MM.YYYY HH:mm') : 0,
                category: {
                    id: $product.category._id,
                    title: $product.category.title,
                    background: $product.category.background,
                    image: SERVER_LINK + $product.category.image
                }
            }
            res.send({
                ok: true,
                data: product
            });
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Nimadur hato!"
            })
        }
    },
    delete: async (req, res) => {
        const { id } = req.params;
        const $product = await productModel.findById(id);
        $product.set({ hidden: true }).save().then(() => {
            res.send({
                ok: true,
                msg: "O'chirildi!"
            });
        });
    },
    // 
    recovery: async (req, res) => {
        const { id } = req.params;
        const $product = await productModel.findById(id);
        $product.set({ hidden: false }).save().then(() => {
            res.send({
                ok: true,
                msg: "Tiklandi!"
            });
        });
    },
    // 
    setBonus: async (req, res) => {
        const { id } = req.params;
        const { bonus_duration, bonus_about, bonus_count, bonus_given } = req.body;
        if (!bonus_about || !bonus_count || !bonus_duration || !bonus_given) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            try {
                const $product = await productModel.findById(id);
                $product.set({ bonus: true, bonus_duration: moment.now() / 1000 + (bonus_duration * 86400), bonus_about, bonus_count, bonus_given }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Bonus tizimi kiritildi!"
                    })
                })
            } catch (error) {
                console.log(error);
                res.send({
                    ok: false,
                    msg: "Nimadur hato!"
                })
            }
        }
    },
    // 
    removeBonus: async (req, res) => {
        const { id } = req.params;
        try {
            const $product = await productModel.findById(id);
            $product.set({ bonus: false, bonus_duration: 0, bonus_about: '', bonus_count: 0, bonus_given: 0 }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Bonus tizimi olib tashlandi!"
                })
            })
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Nimadur hato!"
            })
        }
    },
    setNewPrices: async (req, res) => {
        const { id } = req.params;
        const { price, new_price } = req.body;
        if (!price || !new_price) {
            res.send({
                ok: false,
                msg: "Yangi narxni va eski narxni kiriting!"
            });
        } else {
            const $product = await productModel.findById(id);
            $product.set({ old_price: price, price: new_price }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Sqalandi!"
                });
            })
        }
    },
    // 
    getOne: async (req, res) => {
        const { id } = req.params;
        try {
            const $product = await productModel.findById(id).populate('category', 'title background image');
            const product = {
                ...$product._doc,
                id: $product._id,
                images: [...$product.images.map(e => {
                    return SERVER_LINK + e
                })],
                original_price: 0,
                value: $product.value - $product.solded,
                bonus: $product.bonus && $product.bonus_duration > moment.now() / 1000,
                bonus_duration: $product.bonus ? moment.unix($product.bonus_duration).format('DD.MM.YYYY HH:mm') : 0,
                bonus_count: $product.bonus ? $product.bonus_count : 0,
                bonus_given: $product.bonus ? $product.bonus_given : 0,
                // category: {
                //     id: $product.category._id,
                //     title: $product.category.title,
                //     background: $product.category.background,
                //     image: SERVER_LINK + $product.category.image
                // }
            }
            res.send({
                ok: true,
                data: product
            });
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Nimadur hato!"
            });
        }
    },
    // 
    getSearch: async (req, res) => {
        const { prefix } = req.params;
        const $products = await productModel.find().populate();
        const $modlist = [];
        $products.forEach(p => {
            if (p?.title?.toLowerCase()?.includes(prefix?.toLowerCase()) || p?.about?.toLowerCase()?.includes(prefix?.toLowerCase())) {
                $modlist.push({
                    ...p._doc,
                    id: p._id,
                    image: SERVER_LINK + p.images[0],
                    original_price: 0,
                    value: p.value - p.solded,
                    bonus: p.bonus && p.bonus_duration > moment.now() / 1000,
                    bonus_duration: p.bonus ? moment.unix(p.bonus_duration).format('DD.MM.YYYY HH:mm') : 0,
                    category: {
                        id: p.category._id,
                        title: p.category.title,
                        image: SERVER_LINK + p.category.image
                    }
                });
            }
        });
        res.send({
            ok: true,
            data: $modlist
        });
    },
    getProductsByCategory: async (req, res) => {
        const { id } = req.params;
        if (!id || id.length !== 24) {
            res.send({
                ok: false,
                msg: "LINK O'zgartirildi!"
            })
        } else {
            const $products = await productModel.find({ category: id }).populate('category');
            const $modlist = [];
            $products.forEach(p => {
                $modlist.push({
                    ...p._doc,
                    id: p._id,
                    // images: [...p.images.map(e => {
                    //     return SERVER_LINK + e
                    // })],
                    image: SERVER_LINK + p.images[0],
                    original_price: 0,
                    // created: moment.unix(p.created).format('YYYY-MM-DD'),
                    value: p.value - p.solded,
                    bonus: p.bonus && p.bonus_duration > moment.now() / 1000,
                    bonus_duration: p.bonus ? moment.unix(p.bonus_duration).format('DD.MM.YYYY HH:mm') : 0,
                    category: {
                        id: p.category._id,
                        title: p.category.title,
                        // background: p.category.background,
                        image: SERVER_LINK + p.category.image
                    }
                });
            });
            res.send({
                ok: true,
                data: $modlist
            });
        }
    },
    // 
    getVideos: async (req, res) => {
        const $videos = await productModel.find();
        const $modded = [];
        $videos.forEach(p => {
            $modded.push({
                id: p?._id,
                video: p?.video,
                title: p?.title
            })
        })
        res.send({
            ok: true,
            data: $videos
        })
    }
}
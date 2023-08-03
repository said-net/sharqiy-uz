const md5 = require("md5");
const adminModel = require("../models/boss.model");
const JWT = require('jsonwebtoken');
const { BOSS_SECRET, SERVER_LINK } = require("../configs/env");
const categoryModel = require("../models/category.model");
const productModel = require("../models/product.model");
const shopModel = require("../models/shop.model");
const userModel = require("../models/user.model");
const operatorModel = require("../models/operator.model");
const settingModel = require("../models/setting.model");
const chequeMaker = require("../middlewares/cheque.maker");
const path = require('path')
module.exports = {
    default: async () => {
        const $admin = await adminModel.find();
        if (!$admin[0]) {
            new adminModel({
                name: "Saidislom",
                phone: "+998931042255",
                password: md5('555555')
            }).save();
        }
    },
    signin: async (req, res) => {
        const { phone, password } = req.body;
        if (!phone || !password) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            const $admin = await adminModel.findOne({ phone, password: md5(password) });
            if (!$admin) {
                res.send({
                    ok: false,
                    msg: "Raqam yoki parol hato!"
                });
            } else {
                const access = JWT.sign({ id: $admin._id }, BOSS_SECRET);
                $admin.set({ access }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Kuting...",
                        access
                    });
                });
            }
        }
    },
    verify: (req, res) => {
        res.send({
            ok: true,
            data: req.admin
        })
    },
    getDashboard: async (req, res) => {
        const { date } = req.params;
        if (date === 'all') {
            const categories = await categoryModel.find().countDocuments();
            const products = await productModel.find();
            // 
            let shopHistory = 0;
            let delivered = 0;
            let rejected = 0;
            let sales = 0;
            let profit = 0;
            const shp = await shopModel.find();
            shp.forEach(e => {
                if (e.status === 'delivered') {
                    delivered++;
                    sales += e?.price;
                    shopHistory++;
                    profit += e?.price - (e?.for_admin + e?.for_operator + e?.for_ref)
                } else if (e?.status === 'pending' || e?.status === 'success' || e?.status === 'wait') {
                    shopHistory++
                } else if (e?.status === 'reject') {
                    rejected++;
                }
            })
            const waiting = shopHistory - delivered;
            // 

            const users = await userModel.find();
            const operators = await operatorModel.find();
            // 
            let deposit = 0;
            // 
            products?.forEach(e => {
                deposit += e.value * e?.original_price
            });

            let adminsBalance = 0;
            users?.forEach(e => {
                adminsBalance += e?.balance ? e?.balance : 0;
            })
            let operatorsBalance = 0;
            operators?.forEach(o => {
                operatorsBalance += o?.balance
            })
            res.send({
                ok: true,
                data: {
                    categories,
                    products: products?.length,
                    shops: shopHistory,
                    delivered,
                    waiting,
                    users: users.length,
                    operators: operators.length,
                    deposit,
                    profit,
                    sales,
                    rejected,
                    adminsBalance,
                    operatorsBalance
                }
            });
        }
    },
    getNewOrders: async (req, res) => {
        const $orders = await shopModel.find({ status: 'success' }).populate('product operator');
        const $modded = [];
        $orders?.forEach(o => {
            $modded?.push({
                _id: o?._id,
                id: o?.id,
                title: o?.product?.title,
                count: o?.count,
                price: o?.price,
                bonus: o?.bonus,
                image: SERVER_LINK + o?.product?.images[0]
            });
        });
        res.send({
            ok: true,
            data: $modded
        });

    },
    getOrder: async (req, res) => {
        const { id } = req.params;
        const $settings = await settingModel.find();
        try {
            const o = await shopModel.findById(id).populate('product operator');
            const f = await userModel.findOne({ phone: o?.phone });
            const data = {
                _id: o?._id,
                id: o?.id,
                title: o?.product?.title,
                bonus: o?.bonus,
                flow: o?.flow,
                count: o?.count,
                price: o?.price,
                // image: SERVER_LINK + o?.product?.images[0],
                region: o?.region,
                city: o?.city,
                name: o?.name,
                phone: o?.phone,
                about: o?.about,
                date: `${(o?.day < 10 ? '0' + o?.day : o?.day) + '-' + ((o?.month + 1) < 10 ? '0' + (o?.month + 1) : (o?.month + 1)) + '-' + o?.year}`,
                for_admin: o?.flow ? o?.product?.for_admin : 0,
                for_operator: $settings[0]?.for_operators,
                for_ref: !f || !f?.ref_id ? 0 : $settings[0]?.for_ref
            }
            res.send({
                ok: true,
                data
            });
        } catch (error) {
            res.send({
                ok: false,
                msg: "Nimadur xato!"
            })
        }
    },
    getChequeOrder: async (req, res) => {
        const { id } = req.params;
        const o = await shopModel.findById(id).populate('product operator');
        const data = {
            _id: o?._id,
            id: o?.id,
            title: o?.product?.title,
            bonus: o?.bonus,
            about: o?.about,
            count: o?.count,
            price: o?.price,
            region: o?.region,
            city: o?.city,
            operator_name: o?.operator?.name,
            operator_phone: o?.operator?.phone,
            name: o?.name,
            phone: o?.phone,
            date: `${(o?.day < 10 ? '0' + o?.day : o?.day) + '-' + ((o?.month + 1) < 10 ? '0' + (o?.month + 1) : (o?.month + 1)) + '-' + o?.year}`,
        }
        chequeMaker(data).then(() => {
            res.send({
                ok: true,
                data: SERVER_LINK + '/public/cheques/' + o?.id + '.pdf'
            })
        }).catch((err) => {
            console.log(err);
            res.send({
                ok: false,
                msg: "Nimadir hato"
            });
        });
    },
    setStatusOrder: async (req, res) => {
        const { id } = req.params;
        const o = await shopModel.findById(id).populate('product operator');
        const { status } = req.body;
        if (status === 'reject') {
            o.set({ status: 'reject' }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Buyurtma bekor qilindi!"
                });
            });
        } else if (status === 'sended') {
            o.set({ status: 'sended' }).save().then(() => {
                const data = {
                    _id: o?._id,
                    id: o?.id,
                    title: o?.product?.title,
                    bonus: o?.bonus,
                    about: o?.about,
                    count: o?.count,
                    price: o?.price,
                    region: o?.region,
                    city: o?.city,
                    operator_name: o?.operator?.name,
                    operator_phone: o?.operator?.phone,
                    name: o?.name,
                    phone: o?.phone,
                    date: `${(o?.day < 10 ? '0' + o?.day : o?.day) + '-' + ((o?.month + 1) < 10 ? '0' + (o?.month + 1) : (o?.month + 1)) + '-' + o?.year}`,
                }
                chequeMaker(data).then(() => {
                    res.send({
                        ok: true,
                        msg: "Buyurtma yuborildi!",
                        data: SERVER_LINK + '/public/cheques/' + o?.id + '.pdf'
                    })
                }).catch((err) => {
                    console.log(err);
                    res.send({
                        ok: false,
                        msg: "Nimadir hato"
                    });
                });
            });
        } else if (status === 'delivered') {
            const $operator = await operatorModel.findById(o?.operator?._id);
            const s = await settingModel.find();
            if (o?.flow) {
                const $admin = await userModel.findOne({ id: o?.flow });
                if ($admin?.ref_id) {
                    const $ref = await userModel?.findOne({ id: $admin.ref_id });
                    // 
                    $operator?.set({ balance: $operator?.balance + s[0]?.for_operators }).save();
                    // 
                    $admin.set({ balance: $admin?.balance + o?.product?.for_admins }).save();
                    // 
                    $ref.set({ balance: $ref?.balance + s[0]?.for_ref }).save();
                    // 
                    o?.set({ status: 'delivered', for_operator: s[0]?.for_operators, for_admin: o?.product?.for_admins, for_ref: s[0]?.for_ref }).save();
                    // 
                    res.send({
                        ok: true,
                        msg: "Tasdiqlandi!"
                    });
                } else {
                    $operator?.set({ balance: $operator?.balance + s[0]?.for_operators }).save();
                    $admin.set({ balance: $admin?.balance + o?.product?.for_admins }).save();
                    o?.set({ status: 'delivered', for_operator: s[0]?.for_operators, for_admin: o?.product?.for_admins }).save();
                    res.send({
                        ok: true,
                        msg: "Tasdiqlandi!"
                    });
                }
            } else {
                $operator?.set({ balance: $operator?.balance + s[0]?.for_operators }).save();
                o?.set({ status: 'delivered', for_operator: s[0]?.for_operators }).save();
                res.send({
                    ok: true,
                    msg: "Tasdiqlandi!"
                });
            }
        }
    },
    getSendedOrders: async (req, res) => {
        const $orders = await shopModel.find({ status: 'sended' }).populate('product');
        const $modded = [];
        $orders?.forEach(o => {
            $modded?.push({
                _id: o?._id,
                id: o?.id,
                title: o?.product?.title,
                count: o?.count,
                price: o?.price,
                bonus: o?.bonus,
                image: SERVER_LINK + o?.product?.images[0],
            });
        });
        res.send({
            ok: true,
            data: $modded
        })
    },
    getSearchedSendedOrders: async (req, res) => {
        const { search } = req.params;
        const $orders = await shopModel.find({ status: 'sended' }).populate('product');
        const $modded = [];
        $orders?.forEach(o => {
            if (String(o?.id)?.startsWith(search)) {
                $modded?.push({
                    _id: o?._id,
                    id: o?.id,
                    title: o?.product?.title,
                    count: o?.count,
                    price: o?.price,
                    bonus: o?.bonus,
                    image: SERVER_LINK + o?.product?.images[0],
                });
            }
        });
        res.send({
            ok: true,
            data: $modded
        });
    }
}
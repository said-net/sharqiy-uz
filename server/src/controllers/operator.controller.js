const md5 = require("md5");
const operatorModel = require("../models/operator.model");
const { phone: pv } = require('phone');
const { OPERATOR_SECRET, SERVER_LINK } = require("../configs/env");
const shopModel = require("../models/shop.model");
const settingModel = require("../models/setting.model");
const moment = require("moment");
const userModel = require("../models/user.model");
const bot = require("../bot/app");
const payOperatorModel = require("../models/pay.operator.model");
module.exports = {
    create: async (req, res) => {
        const { name, phone, password } = req.body;
        console.log(req.body);
        if (!name || !phone || !password) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else if (!pv(phone, { country: 'uz' }).isValid) {
            res.send({
                ok: false,
                msg: "Raqamni to'g'ri kiriting!"
            })
        } else if (!/[A-z0-9]{6,}$/.test(password)) {
            res.send({
                ok: false,
                msg: "Parol min: 6 ta ishoradan va [A-z0-9] dan tashkil topgan bo'ladi!"
            })
        } else {
            const $opers = await operatorModel.find().countDocuments();
            new operatorModel({
                id: $opers + 1,
                name, phone: pv(phone, { country: 'uz' }).phoneNumber, password: md5(password),
            }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Operator qo'shildi!"
                });
            }).catch(() => {
                res.send({
                    ok: false,
                    msg: "Ushbu raqam avval ishlatilgan!"
                })
            })
        }
    },
    edit: async (req, res) => {
        const { id } = req.params;
        const { name, phone, password } = req.body;
        if (!name || !phone || !password) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else if (!pv(phone, { country: 'uz' }).isValid) {
            res.send({
                ok: false,
                msg: "Raqamni to'g'ri kiriting!"
            })
        } else {
            const $operator = await operatorModel.findById(id);
            if (!password) {
                $operator.set({ name: name, phone: pv(phone, { country: 'uz' }) }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Saqlandi!"
                    })
                })
            } else {
                if (!/[A-z0-9]{6}&/.test(password)) {
                    res.send({
                        ok: false,
                        msg: "Parol min: 6 ta ishoradan va [A-z0-9] dan tashkil topgan bo'ladi!"
                    })
                } else {
                    $operator.set({ name: name, phone: pv(phone, { country: 'uz' }), password: md5(password) }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "Saqlandi!"
                        });
                    });
                }
            }
        }
    },
    getAll: async (req, res) => {
        const $operators = await operatorModel.find();
        const $modded = [];
        $operators.forEach(o => {
            $modded.push({
                name: o.name,
                phone: o.phone,
                success: 321,
                reject: 37,
                pending: 45,
                balance: 2_300_000
            });
        })
        res.send({
            ok: true,
            data: $operators
        })
    },
    setBan: async (req, res) => {
        const { id } = req.params;
        const $operator = await operatorModel.findById(id);
        $operator.set({ banned: true }).save().then(() => {
            res.send({
                ok: true,
                msg: "Operator bloklandi!"
            });
        });
    },
    removeBan: async (req, res) => {
        const { id } = req.params;
        const $operator = await operatorModel.findById(id);
        $operator.set({ banned: true }).save().then(() => {
            res.send({
                ok: true,
                msg: "Operator blokdan olindi!"
            });
        });
    },
    signIn: async (req, res) => {
        const { phone, password } = req.body;
        if (!phone || !password) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            const $operator = await operatorModel.findOne({ phone: phone, password: md5(password) });
            if (!$operator) {
                res.send({
                    ok: false,
                    msg: "Raqam yoki parol hato kiritildi!"
                });
            } else {
                const token = require('jsonwebtoken').sign({ id: $operator._id }, OPERATOR_SECRET);
                $operator.set({ access: token }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Kuting...",
                        token
                    });
                });
            }
        }
    },
    verifySession: (req, res) => {
        res.send({
            ok: true,
            data: req.operator
        })
    },
    setInfo: async (req, res) => {
        const $operator = await operatorModel.findById(req.operator.id);
        console.log(req.body);
        $operator.set(req.body).save().then(() => {
            res.send({
                ok: true,
                msg: "Saqlandi!"
            })
        })
    },
    getNewOrders: async (req, res) => {
        const $orders = await shopModel.find({ status: 'pending' }).populate('product')
        const $modded = [];
        const $settings = await settingModel.find();
        $orders.forEach((order) => {
            if (order.status === 'pending' && !order.operator) {
                $modded.push({
                    ...order._doc,
                    id: order._id,
                    oid: order.id,
                    image: SERVER_LINK + order.product.images[0],
                    comming_pay: $settings[0]?.for_operators
                });
            }
        });
        res.send({
            ok: true,
            data: $modded
        });
    },
    takeOrder: async (req, res) => {
        const { id } = req?.params;
        const $order = await shopModel.findById(id);
        if ($order?.operator) {
            res.send({
                ok: false,
                msg: "Ushbu buyurtma boshqa operator tomonidan qabul qilingan!"
            });
        } else {
            const $myOrder = await shopModel.findOne({
                operator: req.operator.id, status: 'pending'
            });
            if ($myOrder) {
                res.send({
                    ok: false,
                    msg: "Sizda hali aloqaga chiqilmagan buyurtma mavjud!"
                });
            } else {
                $order.set({ operator: req.operator.id }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Buyurtma egallanganlar bo'limiga o'tkazildi!"
                    });
                });
            }
        }
    },
    getMyOrders: async (req, res) => {
        const $orders = await shopModel.find({ operator: req.operator.id }).populate('product')
        const myOrders = [];
        const $settings = await settingModel.find();
        $orders.forEach(e => {
            if (e?.status !== 'wait') {
                myOrders.push({
                    _id: e?._id,
                    ...e?._doc,
                    image: SERVER_LINK + e?.product?.images[0],
                    comming_pay: $settings[0]?.for_operators
                });
            }
        });
        res.send({
            ok: true,
            data: myOrders.reverse()
        })
    },
    getInfoOrder: async (req, res) => {
        const { id } = req.params;
        console.log(id);
        try {
            const $order = await shopModel.findById(id).populate('product');
            const $settings = await settingModel.find();
            const order = {
                ...$order._doc,
                image: SERVER_LINK + $order?.product?.images[0],
                for_operators: $settings[0].for_operators,
                bonus: $order?.product?.bonus && $order?.product?.bonus_duration > moment.now() / 1000,
                bonus_duration: $order?.product?.bonus ? moment.unix($order?.product?.bonus_duration).format('DD.MM.YYYY HH:mm') : 0,
                bonus_count: $order?.product?.bonus ? $order?.product?.bonus_count : 0,
                bonus_given: $order?.product?.bonus ? $order?.product?.bonus_given : 0,
            }
            res.send({
                ok: true,
                data: order
            });
        } catch {
            res.send({
                ok: false,
                msg: "Nimadir xato 2 daqiqdan so'ng urunib ko'ring!"
            })
        }
    },
    setStatus: async (req, res) => {
        const { id } = req.params;
        const { bonus_gived: bonus, about, city, region, status, count, phone, name, price } = req.body;
        console.log(status);
        const $order = await shopModel.findById(id);
        if (status === 'reject' && ($order?.status === 'pending' || $order?.status === 'wait')) {
            $order.set({
                status: 'archive',
                about, city, region, bonus, count: 0, phone, name, price: 0
            }).save().then(async () => {
                res.send({
                    ok: true,
                    msg: "Arxivlandi qilindi!"
                });
                // if ($order?.flow) {
                //     const $flower = await userModel.findOne({ id: $order?.flow });
                //     if ($flower && $flower?.telegram) {
                //         bot.telegram.sendMessage($flower?.telegram, `sharqiy.uz\n❌Buyurtma bekor qilindi!\n🆔Buyurtma uchun id: #${$order?.id}`).catch(err => {
                //             console.log(err);
                //         });
                //     }
                // }
            });
        } else if (status === 'wait' && ($order?.status === 'pending' || $order?.status === 'wait')) {
            $order.set({
                status: 'wait',
                about, city, region, bonus, count: 0, phone, name, price: 0
            }).save().then(async () => {
                res.send({
                    ok: true,
                    msg: "Keyinroqqa qoldirildi!"
                });
                // if ($order?.flow) {
                //     const $flower = await userModel.findOne({ id: $order?.flow });
                //     if ($flower && $flower?.telegram) {
                //         bot.telegram.sendMessage($flower?.telegram, `sharqiy.uz\n🔃Buyurtma uchun qayta aloqa!\n🆔Buyurtma uchun id: #${$order?.id}`).catch(err => {
                //             console.log(err);
                //         });
                //     }
                // }
            });
        } else if (status === 'success' && ($order?.status === 'pending' || $order?.status === 'wait' || $order?.status === 'success')) {
            $order.set({
                status: 'success',
                about, city, region, bonus, count, phone, name, price
            }).save().then(async () => {
                if ($order.status === 'success') {
                    res.send({
                        ok: true,
                        msg: "Taxrirlandi"
                    });
                } else {
                    res.send({
                        ok: true,
                        msg: "Yetkazish bo'limiga yuborildi!"
                    });
                    if ($order?.flow) {
                        const $flower = await userModel.findOne({ id: $order?.flow });
                        if ($flower && $flower?.telegram) {
                            bot.telegram.sendMessage($flower?.telegram, `sharqiy.uz\n📦Buyurtma dostavkaga tayyor!\n🆔Buyurtma uchun id: #${$order?.id}`).catch(err => {
                                console.log(err);
                            });
                        }
                    }
                }

            });
        }
    },
    editOrder: async (req, res) => {
        try {
            const { id } = req.params;
            const { about, city, region, count, phone, name, price } = req.body;
            const $order = await shopModel.findById(id);
            $order.set({ about, city, region, bonus, count, phone, name, price }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Taxrirlandi!"
                });
            });
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    },
    getWaitOrders: async (req, res) => {
        const $orders = await shopModel.find({ operator: req.operator.id }).populate('product')
        const myOrders = [];
        const $settings = await settingModel.find();
        $orders.forEach(e => {
            if (e?.status === 'wait') {
                myOrders.push({
                    _id: e?._id,
                    ...e?._doc,
                    image: SERVER_LINK + e?.product?.images[0],
                    comming_pay: $settings[0]?.for_operators
                });
            }
        });
        res.send({
            ok: true,
            data: myOrders.reverse()
        });
    },
    createPay: async (req, res) => {
        const $lastPay = await payOperatorModel.findOne({ from: req.operator.id, status: 'pending' });
        if ($lastPay) {
            res.send({
                ok: false,
                msg: "Sizda tekshuruvga yuborilgan " + $lastPay.count + " so'm miqdordagi to'lov mavjud iltimos tekshiruvni kuting!"
            });
        } else {
            const { card, amount } = req.body;
            if (!card || !amount) {
                res.send({
                    ok: false,
                    msg: "Qatorlarni to'ldiring!"
                });
            } else if (card?.length < 16) {
                res.send({
                    ok: false,
                    msg: "Karta raqamini to'g'ri kiriting!"
                });
            } else if (amount < 1000) {
                res.send({
                    ok: false,
                    msg: "Kamida 1 000 so'm to'lov bo'ladi!"
                });
            } else if (amount > req?.operator?.balance) {
                res.send({
                    ok: false,
                    msg: "Ko'pi bilan " + req?.operator?.balance + " so'm to'lov bo'ladi!"
                });
            } else {
                new payOperatorModel({
                    from: req.operator.id,
                    count: amount,
                    created: moment.now() / 1000,
                    card
                }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Qabul qilindi!"
                    });
                });
            }
        }
    },
    getHistoryPay: async (req, res) => {
        const $pays = await payOperatorModel.find({ from: req.operator.id });
        res.send({
            ok: true,
            data: $pays.reverse()
        })
    },
    searchBase: async (req, res) => {
        const { search } = req.params;
        const $orders = await shopModel.find().populate('product');
        const orders = [];
        const $settings = await settingModel.find();
        $orders.filter(o => o?.id === Number(search) || o?.phone?.includes(search)).forEach(e => {
            if (e?.status !== 'delivered') {
                orders.push({
                    _id: e?._id,
                    ...e?._doc,
                    image: SERVER_LINK + e?.product?.images[0],
                    comming_pay: $settings[0]?.for_operators
                });
            }
        });
        res.send({
            ok: true,
            data: orders.reverse()
        })
    }
}
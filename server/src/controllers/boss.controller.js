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
const bot = require("../bot/app");
const payOperatorModel = require("../models/pay.operator.model");
const payModel = require("../models/pay.model");
const moment = require('moment')
module.exports = {
    default: async () => {
        const $admin = await adminModel.find();
        if (!$admin[0]) {
            new adminModel({
                name: "Otabek",
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
            let archived = 0;
            let rejected = 0;
            // let sales = 0;
            // let profit = 0;
            const shp = await shopModel.find();
            shp.forEach(e => {
                if (e.status === 'delivered') {
                    delivered++;
                    // sales += e?.price;
                    shopHistory++;
                    // profit += e?.price - (e?.for_admin + e?.for_operator + e?.for_ref)
                } else if (e?.status === 'sended' || e?.status === 'success') {
                    shopHistory++
                } else if (e?.status === 'reject') {
                    rejected++;
                } else if (e?.status === 'archive') {
                    archived++
                }
            })
            const waiting = shopHistory - delivered;
            // 

            const users = await userModel.find();
            const operators = await operatorModel.find();
            // 
            // let deposit = 0;
            // 
            // products?.forEach(e => {
            //     deposit += e.value * e?.original_price
            // });
            let p_his = 0;
            let sh_his = 0;
            let r_his = 0;
            let adminsBalance = 0;
            for (let $user of users) {
                const $histpory = await payModel.find({ from: $user._id, status: 'success' });
                const $shoph = await shopModel.find({ flow: $user.id });
                const $refs = await userModel.find({ ref_id: $user.id });
                for (let ref of $refs) {
                    const $rflows = await shopModel.find({ flow: ref.id });
                    $rflows.forEach(rf => {
                        r_his += rf.for_ref
                        adminsBalance += rf.for_ref
                    });
                };
                $histpory.forEach(h => {
                    p_his -= h.count;
                    adminsBalance -= h.count;
                });
                $shoph.forEach(s => {
                    sh_his += s.for_admin;
                    adminsBalance += s.for_admin
                });
            }
            // adminsBalance += (sh_his + r_his) - p_his
            let operatorsBalance = 0;
            for (let o of operators) {
                const $shops = await shopModel.find({ operator: o?._id, status: 'delivered' });
                const $pays = await payOperatorModel.find({ from: o?._id, status: 'success' });
                $shops?.forEach($sh => {
                    operatorsBalance += $sh?.for_operator;
                });
                $pays?.forEach($p => {
                    operatorsBalance -= $p?.count;
                });
            }

            res.send({
                ok: true,
                data: {
                    categories,
                    products: products?.length,
                    shops: shopHistory,
                    delivered,
                    archived,
                    waiting,
                    users: users.length,
                    operators: operators.length,
                    // deposit,
                    // profit,
                    // sales,
                    rejected,
                    adminsBalance,
                    operatorsBalance
                }
            });
        } else {
            const year = +date?.split('-')[0];
            const month = +date?.split('-')[1];
            // 
            let shopHistory = 0;
            let delivered = 0;
            let rejected = 0;
            // let sales = 0;
            let archived = 0
            // let profit = 0;
            const shp = await shopModel.find({ year, month: month - 1 });
            shp.forEach(e => {
                if (e.status === 'delivered') {
                    delivered++;
                    // sales += e?.price;
                    shopHistory++;
                    // profit += e?.price - (e?.for_admin + e?.for_operator + e?.for_ref)
                } else if (e?.status === 'sended' || e?.status === 'success') {
                    shopHistory++
                } else if (e?.status === 'reject') {
                    rejected++;
                } else if (e?.status === 'archive') {
                    archived++
                }
            })
            const waiting = shopHistory - delivered;
            res.send({
                ok: true,
                data: {
                    shops: shopHistory,
                    delivered,
                    waiting,
                    // profit,
                    archived,
                    // sales,
                    rejected,
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
                region: o?.region,
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
            const a = await userModel.findOne({ id: o?.flow }) || null;
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
                for_admin: o?.flow ? o?.product?.for_admins : 0,
                for_operator: $settings[0]?.for_operators,
                for_ref: !a ? 0 : $settings[0]?.for_ref
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
            o.set({ status: 'reject' }).save().then(async () => {
                res.send({
                    ok: true,
                    msg: "Buyurtma bekor qilindi!"
                });
                // if (o?.flow) {
                //     const $flower = await userModel.findOne({ id: o?.flow });
                //     if ($flower && $flower?.telegram) {
                //         bot.telegram.sendMessage($flower?.telegram, `sharqiy.uz\n❌Buyurtma bekor qilindi!\n🆔Buyurtma uchun id: #${o?.id}`).catch(err => {
                //             console.log(err);
                //         });
                //     }
                // }
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
                chequeMaker(data).then(async () => {
                    res.send({
                        ok: true,
                        msg: "Buyurtma yuborildi!",
                        data: SERVER_LINK + '/public/cheques/' + o?.id + '.pdf'
                    });
                    // if (o?.flow) {
                    //     const $flower = await userModel.findOne({ id: o?.flow });
                    //     if ($flower && $flower?.telegram) {
                    //         bot.telegram.sendMessage($flower?.telegram, `sharqiy.uz\n🚚Buyurtma buyurtmachiga yuborildi!\n🆔Buyurtma uchun id: #${o?.id}`).catch(err => {
                    //             console.log(err);
                    //         });
                    //     }
                    // }
                }).catch((err) => {
                    console.log(err);
                    res.send({
                        ok: false,
                        msg: "Nimadir hato"
                    });
                });
            });
        } else if (status === 'delivered') {
            const p = await productModel.findById(o?.product?._id);
            const s = await settingModel.find();
            if (o?.flow) {
                const $admin = await userModel.findOne({ id: o?.flow });
                if ($admin?.ref_id && $admin.ref_id !== $admin.id) {
                    const $ref = await userModel?.findOne({ id: $admin.ref_id });
                    // 
                    bot.telegram.sendMessage($ref?.telegram, `sharqiy.uz\n👥Hisobga +${Number(s[0]?.for_ref).toLocaleString()} so'm referaldan qo'shildi`).catch(err => {
                        console.log(err);
                    });
                    o?.set({ status: 'delivered', for_operator: s[0]?.for_operators, for_admin: o?.product?.for_admins, for_ref: s[0]?.for_ref, ref_id: $admin.ref_id }).save().then(() => {
                        p.set({ solded: o?.product?.solded + o?.count }).save().then(() => {
                            res.send({
                                ok: true,
                                msg: "Tasdiqlandi!"
                            });
                        })
                    })
                } else {
                    o?.set({ status: 'delivered', for_operator: s[0]?.for_operators, for_admin: o?.product?.for_admins }).save().then(() => {
                        p.set({ solded: o?.product?.solded + o?.count }).save().then(() => {
                            res.send({
                                ok: true,
                                msg: "Tasdiqlandi!"
                            });
                        })
                    })
                }
                if ($admin && $admin?.telegram) {
                    bot.telegram.sendMessage($admin?.telegram, `sharqiy.uz\n🚚Buyurtma buyurtmachiga yetkazildi!\n🆔Buyurtma uchun id: #${o?.id}\n💳Hisobga +${Number(o?.for_admin).toLocaleString()} so'm qo'shildi`).catch(err => {
                        console.log(err);
                    });
                }
            } else {
                o?.set({ status: 'delivered', for_operator: s[0]?.for_operators }).save();
                p.set({ solded: p?.solded + o?.count }).save();
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
    },
    getHistoryOrders: async (req, res) => {
        const $orders = await shopModel.find().populate('product operator')
        const $modded = [];
        $orders?.forEach(o => {
            if (o?.status !== 'pending' && o?.status !== 'wait' && o?.status !== 'success') {
                $modded.push({
                    _id: o?._id,
                    id: o?.id,
                    title: o?.product?.title,
                    count: o?.count,
                    price: o?.price,
                    bonus: o?.bonus,
                    status: o?.status,
                    image: SERVER_LINK + o?.product?.images[0],
                    cheque: SERVER_LINK + '/public/cheques/' + o?.id + '.pdf',
                    operator_name: o?.operator?.name,
                    operator_phone: o?.operator?.phone
                });
            }
        });
        res.send({
            ok: true,
            data: $modded.reverse()
        });
    },
    setStatusByDate: async (req, res) => {
        const { date } = req.body;
        const month = +date.split('-')[1] - 1;
        const year = +date.split('-')[0];
        const $orders = await shopModel.find({ month, year, status: 'sended' }).populate('product operator');
        const s = await settingModel.find();
        for (let o of $orders) {
            const $operator = await operatorModel.findById(o?.operator?._id);
            const p = await productModel.findById(o?.product?._id);
            if (o?.flow) {
                const $admin = await userModel.findOne({ id: o?.flow });
                if ($admin?.ref_id) {
                    const $ref = await userModel?.findOne({ id: $admin.ref_id });
                    // 
                    // 
                    bot.telegram.sendMessage($ref?.telegram, `sharqiy.uz\n👥Hisobga +${Number(s[0]?.for_ref).toLocaleString()} so'm referaldan qo'shildi`).catch(err => {
                        console.log(err);
                    });
                    // 
                    o?.set({ status: 'delivered', for_operator: s[0]?.for_operators, for_admin: o?.product?.for_admins, for_ref: s[0]?.for_ref, ref_id: $admin.ref_id }).save();
                    // 
                    p.set({ solded: o?.product?.solded + o?.count }).save();
                } else {
                    $operator?.set({ balance: Number($operator?.balance + s[0]?.for_operators) }).save();
                    $admin.set({ balance: $admin?.balance + o?.product?.for_admins }).save();
                    o?.set({ status: 'delivered', for_operator: s[0]?.for_operators, for_admin: o?.product?.for_admins }).save();

                    p.set({ solded: o?.product?.solded + o?.count }).save();
                }
                bot.telegram.sendMessage($admin?.telegram, `sharqiy.uz\n🚚Buyurtma buyurtmachiga yetkazildi!\n🆔Buyurtma uchun id: #${o?.id}\n💳Hisobga +${Number(o?.for_admin).toLocaleString()} so'm qo'shildi`).catch(err => {
                    console.log(err);
                });
            } else {
                $operator?.set({ balance: Number($operator?.balance + s[0]?.for_operators) }).save();
                o?.set({ status: 'delivered', for_operator: s[0]?.for_operators }).save();
                p.set({ solded: p?.solded + o?.count }).save();
            }
        }
        res.send({
            ok: true,
            msg: "Saqlandi!"
        })
    },
    getWaitOrders: async (req, res) => {
        const $orders = await shopModel.find({ status: 'wait' }).populate('product')
        const myOrders = [];
        $orders.forEach(e => {
            myOrders.push({
                _id: e?._id,
                ...e?._doc,
                image: SERVER_LINK + e?.product?.images[0],
            });
        });
        res.send({
            ok: true,
            data: myOrders.reverse()
        });
    },
    setStatusToNew: async (req, res) => {
        await shopModel.updateMany({ status: 'wait' }, { status: 'pending', operator: null }).then(() => {
            res.send({
                ok: true,
                msg: "O'tkazildi!"
            })
        }).catch(err => {
            console.log(err);
            res.send({
                ok: false,
                msg: "nimadir xato!"
            })
        })
    },
    getOperatorPays: async (req, res) => {
        const $pays = await payOperatorModel.find({ status: 'pending' }).populate('from');
        res.send({
            ok: true,
            data: $pays
        });
    },
    setStatusOperatorPay: async (req, res) => {
        const { id, status } = req.body;
        if (!id || !status) {
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        } else {
            try {
                const $pay = await payOperatorModel.findById(id);
                if (status === 'success') {
                    const $operator = await operatorModel.findById($pay.from);
                    $pay.set({ status: 'success' }).save().then(() => {
                        $operator.set({ balance: $operator.balance - $pay.count }).save().then(() => {
                            res.send({
                                ok: true,
                                msg: "Saqlandi!"
                            });
                        })
                    })
                } else if (status === 'reject') {
                    $pay.set({ status: 'reject' }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "Rad etildi!"
                        });
                    })
                }
            } catch (error) {
                res.send({
                    ok: false,
                    msg: "Xatolik!"
                })
            }
        }
    },
    getOperatorStats: async (req, res) => {
        const { date } = req.params;
        const d = new Date();
        try {
            const $operator = await operatorModel.findById(req.params.id);
            const $shops = await (
                date === 'all' ?
                    shopModel.find({ operator: $operator._id })
                    : date === 'month' ?
                        shopModel.find({ operator: $operator._id, year: d.getFullYear(), month: d.getMonth() })
                        : date === 'last_mont' ?
                            shopModel.find({ operator: $operator._id, year: d.getFullYear(), month: d.getMonth() - 1 })
                            : date === 'today' ?
                                shopModel.find({ operator: $operator._id, year: d.getFullYear(), month: d.getMonth(), day: d.getDate() })
                                : date === 'yesterday' ?
                                    shopModel.find({ operator: $operator._id, year: d.getFullYear(), month: d.getMonth(), day: d.getDate() - 1 }) : null

            );
            const mod = {
                id: $operator?.id,
                name: $operator.name,
                phone: $operator.phone,
                success: 0,
                reject: 0,
                wait: 0,
                sended: 0,
                delivered: 0,
                // 
                profit: 0,
                company_profit: 0
            };
            $shops?.forEach(s => {
                if (s.status === 'reject') {
                    mod.reject += 1;
                } else if (s.status === 'wait') {
                    mod.wait += 1;
                } else if (s.status === 'success') {
                    mod.success += 1;
                } else if (s.status === 'sended') {
                    mod.sended += 1;
                } else if (s.status === 'delivered') {
                    mod.delivered += 1;
                    mod.profit += s?.for_operator ? s?.for_operator : 0;
                    mod.company_profit += s?.price;
                }
            });
            res.send({
                ok: true,
                data: mod
            });
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    },
    searchBase: async (req, res) => {
        const { search } = req.params;
        const $orders = await shopModel.find().populate('product');
        const orders = [];
        const $settings = await settingModel.find();
        $orders.filter(o => o?.id === Number(search) || o?.phone?.includes(search)).forEach(e => {
            orders.push({
                _id: e?._id,
                ...e?._doc,
                image: SERVER_LINK + e?.product?.images[0],
                comming_pay: $settings[0]?.for_operators
            });
        });
        res.send({
            ok: true,
            data: orders.reverse()
        })
    },
    getInfoOrder: async (req, res) => {
        const { id } = req.params;
        console.log(id);
        try {
            const $order = await shopModel.findById(id).populate('product operator');
            const $settings = await settingModel.find();
            if ($order?.flow > 0) {
                const $admin = await userModel.findOne({ id: $order.flow });
                const order = {
                    ...$order._doc,
                    admin: {
                        ...$admin._doc
                    },
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
            } else {
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
            }
        } catch {
            res.send({
                ok: false,
                msg: "Nimadir xato 2 daqiqdan so'ng urunib ko'ring!"
            })
        }
    },
    setInfoOrder: async (req, res) => {
        const { id } = req.params;
        try {
            const { name, count, price, bonus_gived, phone, region, city, about } = req.body;
            const $order = await shopModel.findById(id);
            $order.set({
                name, count, price, bonus: bonus_gived, phone, region, city, about
            }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Saqlandi!"
                })
            })
        } catch {
            res.send({
                ok: false,
                msg: "Saqlashda xatolik!"
            })
        }
    },
    getAllUsers: async (req, res) => {
        const $users = await userModel.find();
        res.send({
            ok: true,
            data: $users
        });
    },
    setTargetlolog: async (req, res) => {
        const $user = await userModel.findById(req.params.id);
        $user.set({ targetolog: true }).save().then(() => {
            res.send({
                ok: true,
                msg: "Targetolog deb belgilandi!"
            });
        });
    },
    removeTargetolog: async (req, res) => {
        const $user = await userModel.findById(req.params.id);
        $user.set({ targetolog: false }).save().then(() => {
            res.send({
                ok: true,
                msg: "Targetolog safidan olindi!"
            });
        });
    },
    addMoneyToOperator: async (req, res) => {
        const { id } = req.params;
        try {
            const $operator = await operatorModel.findById(id);
            if (!$operator) {
                res.send({
                    ok: false,
                    msg: "Operator topilmadi!"
                });
            } else {
                const { value, comment } = req.body;
                new payOperatorModel({
                    from: id,
                    count: value > 0 ? -value : Number(value.slice(1)),
                    comment,
                    status: 'success',
                    created: moment.now() / 1000
                }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Qabul qilindi",
                    })
                })
            }
        } catch (error) {
            res.send({
                ok: false,
                msg: "Xatolik",
                data: error
            })
        }
    }
}
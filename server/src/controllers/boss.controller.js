const md5 = require("md5");
const adminModel = require("../models/boss.model");
const JWT = require('jsonwebtoken');
const { BOSS_SECRET } = require("../configs/env");
const categoryModel = require("../models/category.model");
const productModel = require("../models/product.model");
const valuehistoryModel = require("../models/valuehistory.model");
const shopModel = require("../models/shop.model");
const userModel = require("../models/user.model");
const operatorModel = require("../models/operator.model");
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
            const categories = await categoryModel.find().countDocuments()
            const products = await productModel.find()
            // 
            let shopHistory = 0;
            let delivered = 0;
            let rejected = 0;
            let sales = 0;
            let profit = 0;
            const shp = await shopModel.find();
            shp.forEach(e => {
                if (e.status == 'delivered') {
                    delivered++;
                    sales+=(e?.count * e?.price);
                    shopHistory++;
                    profit += (e?.count * e?.price) - (e?.for_admin + e?.for_operator + e?.for_ref)
                }
            })
            const waiting = shopHistory - delivered;
            // 
            const users = await userModel.find().countDocuments();
            const operators = await operatorModel.find().countDocuments();
            // 
            let deposit = 0;
            // 
            products?.forEach(e => {
                deposit += e.value * e?.original_price
            })
            const adminsBalance = 12_000_000;
            const operatorsBalance = 7_500_000
            res.send({
                ok: true,
                data: {
                    categories,
                    products: products?.length,
                    shops: shopHistory,
                    delivered,
                    waiting,
                    users,
                    operators,
                    deposit,
                    profit,
                    sales,
                    rejected,
                    adminsBalance,
                    operatorsBalance
                }
            });
        }
    }
}
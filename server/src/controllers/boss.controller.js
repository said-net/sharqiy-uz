const md5 = require("md5");
const adminModel = require("../models/boss.model");
const JWT = require('jsonwebtoken');
const { BOSS_SECRET } = require("../configs/env");
const categoryModel = require("../models/category.model");
const productModel = require("../models/product.model");
const valuehistoryModel = require("../models/valuehistory.model");
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
            const products = await productModel.find().countDocuments()
            const valueHistory = await valuehistoryModel.find();
            const shopHistory = 1690;
            const delivered = 1250;
            const waiting = shopHistory - delivered;
            const users = 3000
            const admins = 1250
            const operators = 5;
            const deposit = 127_000_000;
            const sales = 257_000_000;
            const profit = sales - deposit;
            const flows = 95_000;
            const rejected = 65;
            const adminsBalance = 12_000_000;
            const operatorsBalance = 7_500_000
            let commodity = 0;
            valueHistory.forEach(v => {
                commodity += v.value;
            })
            res.send({
                ok: true,
                data: {
                    categories,
                    products,
                    commodity,
                    shops: shopHistory,
                    delivered,
                    waiting,
                    users,
                    admins,
                    operators,
                    deposit,
                    profit,
                    flows,
                    sales,
                    rejected,
                    adminsBalance,
                    operatorsBalance
                }
            });
        }
    }
}
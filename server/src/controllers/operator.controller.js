const md5 = require("md5");
const operatorModel = require("../models/operator.model");
const { phone: pv } = require('phone');
module.exports = {
    create: (req, res) => {
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
            new operatorModel({
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
    }
}
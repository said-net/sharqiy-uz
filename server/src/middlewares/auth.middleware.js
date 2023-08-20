const JWT = require('jsonwebtoken');
const { BOSS_SECRET, SERVER_LINK, USER_SECRET, OPERATOR_SECRET } = require('../configs/env');
const adminModel = require('../models/boss.model');
const userModel = require('../models/user.model');
const moment = require('moment/moment');
const operatorModel = require('../models/operator.model');
const payOperatorModel = require('../models/pay.operator.model');
const shopModel = require('../models/shop.model');
const payModel = require('../models/pay.model');
module.exports = {
    boss: (req, res, next) => {
        const token = req.headers['x-auth-token'];
        if (!token || !token.startsWith('Bearer ')) {
            res.send({
                ok: false,
                msg: "Avtorizatsiya qiling!"
            });
        } else {
            const signature = token.replace('Bearer ', '');
            JWT.verify(signature, BOSS_SECRET, async (err, data) => {
                if (err) {
                    res.send({
                        ok: false,
                        msg: "Signatura hato yoki avtorizatsiya vaqti tugagan!"
                    });
                } else {
                    const { id } = data;
                    const $admin = await adminModel.findById(id);
                    if (!$admin) {
                        res.send({
                            ok: false,
                            msg: "Admin topilmadi!"
                        });
                    }
                    // else if ($admin.access !== signature) {
                    //     res.send({
                    //         ok: false,
                    //         msg: "Ushbu qurulmada avtorizatsiya vaqti tugagan!"
                    //     });
                    // }
                    else {
                        const { name, phone, image } = $admin;
                        req.admin = { id, name, phone, image: image ? SERVER_LINK + image : '' };
                        next();
                    }
                }
            });
        }
    },
    user: (req, res, next) => {
        const token = req.headers['x-user-token'];
        if (!token || !token.startsWith('Bearer ')) {
            res.send({
                ok: false,
                msg: "Avtorizatsiya qiling!"
            });
        } else {
            const signature = token.replace('Bearer ', '');
            JWT.verify(signature, USER_SECRET, async (err, data) => {
                if (err) {
                    res.send({
                        ok: false,
                        msg: "Signatura hato yoki avtorizatsiya vaqti tugagan!"
                    });
                } else {
                    const { id } = data;
                    const $user = await userModel.findById(id);
                    if (!$user) {
                        res.send({
                            ok: false,
                            msg: "Foydalanuvchi topilmadi!"
                        });
                    }
                    //  else if ($user.access !== signature) {
                    //     res.send({
                    //         ok: false,
                    //         msg: "Ushbu qurulmada avtorizatsiya vaqti tugagan!"
                    //     });
                    // }
                    else {
                        const { id: uId, name, phone, created, location, telegram } = $user;
                        //
                        let p_his = 0;
                        let sh_his = 0;
                        let r_his = 0;
                        const $histpory = await payModel.find({ from: id });
                        const $shoph = await shopModel.find({ flow: $user.id });

                        const $refs = await userModel.find({ ref_id: $user.id });
                        for (let ref of $refs) {
                            const $rflows = await shopModel.find({ flow: ref.id });
                            $rflows.forEach(rf => {
                                r_his += rf.for_ref
                            });
                        }
                        $histpory.forEach(h => {
                            p_his += h.count;
                        });
                        $shoph.forEach(s => {
                            sh_his += s.for_admin;
                        });
                        //
                        req.user = { uId, id, name, phone, created: moment.unix(created).format('DD.MM.YYYY HH:MM'), balance: (sh_his + r_his) - p_his, location, telegram };
                        next();
                    }
                }
            });
        }
    },
    operator: (req, res, next) => {
        const token = req.headers['x-auth-token'];
        if (!token || !token.startsWith('Bearer ')) {
            res.send({
                ok: false,
                msg: "Avtorizatsiya qiling!"
            });
        } else {
            const signature = token.replace('Bearer ', '');
            JWT.verify(signature, OPERATOR_SECRET, async (err, data) => {
                if (err) {
                    res.send({
                        ok: false,
                        msg: "Signatura hato yoki avtorizatsiya vaqti tugagan!"
                    });
                } else {
                    const { id } = data;
                    const $operator = await operatorModel.findById(id);
                    if (!$operator) {
                        res.send({
                            ok: false,
                            msg: "Operator topilmadi!"
                        });
                    } else if ($operator.access !== signature) {
                        res.send({
                            ok: false,
                            msg: "Ushbu qurulmada avtorizatsiya vaqti tugagan!"
                        });
                    } else {
                        let p_his = 0;
                        let sh_his = 0;
                        const $histpory = await payOperatorModel.find({ from: id });
                        const $shoph = await shopModel.find({ operator: id });
                        $histpory.forEach(h => {
                            p_his += h.count;
                        });
                        $shoph.forEach(s => {
                            sh_his += s.for_operator
                        });
                        $operator.set({ balance: sh_his - p_his }).save();
                        const { name, phone, telegram } = $operator;
                        req.operator = { id, name, phone, balance: sh_his - p_his, telegram };
                        next();
                    }
                }
            });
        }
    }
}
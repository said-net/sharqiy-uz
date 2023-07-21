const JWT = require('jsonwebtoken');
const { BOSS_SECRET, SERVER_LINK } = require('../configs/env');
const adminModel = require('../models/boss.model');
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
                    } else if ($admin.access !== signature) {
                        res.send({
                            ok: false,
                            msg: "Ushbu qurulmada avtorizatsiya vaqti tugagan!"
                        });
                    } else {
                        const { name, phone, image } = $admin;
                        req.admin = { id, name, phone, image: image ? SERVER_LINK + image : '' };
                        next();
                    }
                }
            });
        }
    }
}
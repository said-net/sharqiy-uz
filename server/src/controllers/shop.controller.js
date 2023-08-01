const moment = require("moment");
const productModel = require("../models/product.model");
const shopModel = require("../models/shop.model");
const userModel = require("../models/user.model");

module.exports = {
    create: async (req, res) => {
        const { id, name, phone, region, flow } = req.body;
        if (!id) {
            res.send({
                ok: false,
                msg: "Nimadir xato!"
            });
        } else if (!name || !phone || !region) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            try {
                const $product = await productModel.findById(id);
                const $orders = await shopModel.find();
                if (!$product || $product.hidden) {
                    res.send({
                        ok: false,
                        msg: "Ushbu mahsulot mavjud emas!"
                    });
                } else {
                    const $user = await userModel.findOne({ phone });
                    new shopModel({
                        product: id,
                        from: $user ? $user?._id : '',
                        name,
                        id: $orders?.length + 1,
                        phone,
                        flow: flow ? flow : '',
                        region,
                        month: new Date().getMonth(),
                        day: new Date().getDate(),
                        year: new Date().getFullYear()
                    }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "Qabul qilindi! Tez orada operatorlar aloqaga chiqishadi!"
                        });
                    });
                }
            } catch {
                res.send({
                    ok: false,
                    msg: "Nimadir xato!"
                })
            }
        }
    }
}

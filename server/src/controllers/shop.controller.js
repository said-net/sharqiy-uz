const moment = require("moment");
const productModel = require("../models/product.model");
const shopModel = require("../models/shop.model");
const userModel = require("../models/user.model");
const bot = require("../bot/app");

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
                    }).save().then(async () => {
                        res.send({
                            ok: true,
                            msg: "Qabul qilindi! Tez orada operatorlar aloqaga chiqishadi!"
                        })
                        if (flow) {
                            const $flower = await userModel.findOne({ id: flow });
                            if ($flower && $flower?.telegram) {
                                bot.telegram.sendMessage($flower?.telegram,`sharqiy.uz\n🆕Yangi buyurtma\n🆔Buyurtma uchun id: #${$orders?.length + 1}`).catch(err => {
                                    console.log(err);
                                })
                            }
                        }

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

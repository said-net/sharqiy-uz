const md5 = require("md5");
const productModel = require("../models/product.model");
const moment = require("moment/moment");

module.exports = {
    create: (req, res) => {
        const { title, about, price, original_price, video, category } = req.body;
        const images = req?.body?.images[0] ? [...req?.body?.images] : [req?.body?.images];
        if(!title || !about || !price || !video || !category || !original_price){
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        }else if(!images){
            res.send({
                ok: false,
                msg: "Rasm yuklang min: 1, max: 5"
            });
        }else if(images?.length<5){
            res.send({
                ok: false,
                msg: "Rasm max: 5 ta"
            });
        }else {
            const imgs = [];
            images?.forEach((img, i)=>{
                const filePath = `/public/products/${md5(img?.name + new Date()+i)}.png`;
                imgs.push(filePath);
                imgs.mv(`.${filePath}`);
            })
            new productModel({
                title,
                about,
                price,
                original_price,
                video,
                category,
                images: imgs,
                created: moment.now()/1000
            }).save().then(()=>{
                res.send({
                    ok: true,
                    msg: "Saqlandi!"
                });
            });
        }
    }
}
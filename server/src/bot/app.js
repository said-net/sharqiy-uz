const { Telegraf } = require('telegraf');
const { BOT_TOKEN } = require('../configs/env');
const userModel = require('../models/user.model');
const btn = require('./btn');
const shopModel = require('../models/shop.model');
const payModel = require('../models/pay.model');
// const payMaker = require('../middlewares/pay.maker');
// const payModel = require('../models/pay.model');
const bot = new Telegraf(BOT_TOKEN)
bot.start(async msg => {
    const { id } = msg.from;
    const $user = await userModel.findOne({ telegram: id });
    if (!$user) {
        msg.replyWithHTML(`<b>❗Avval botni aktivlashtisrishingiz kerak!</b>\n<code>${id}</code> <a href='https://sharqiy.uz'>Sahrqiy.uz</a> sayti orqali aktivlashtiring!`)
    } else {
        const command = msg.startPayload;
        if (!command) {
            msg.replyWithHTML(`<b>📋Bosh sahifa</b>`, { ...btn.menu });
        } else {
            if (command === 'pay') {
                if (!$user?.balance || $user?.balance < 1000) {
                    msg.replyWithHTML(`❗Pulni chiqarib olish <b>1 000</b> so'mdan boshlanadi!`)
                } else {
                    $user.set({ step: 'request_card' }).save();
                    msg.replyWithHTML("💳Karta raqamingizni kiriting\n📋Namuna: <b>9860160147090205</b>", { ...btn.back })
                }
            } else if (command === 'pay_history') {
                const $pays = await payModel.find({ from: $user._id });
                if (!$pays[0]) {
                    msg.replyWithHTML("❗Siz pul yechmagansiz!")
                } else {
                    let tx = `<b>📋To'lovlar tarixi</b>\n\n`;
                    $pays?.forEach((p, i) => {
                        txt += `${(i + 1)} - to'lov: ${Number(p.count).toLocaleString} so'm\n`
                    });
                    msg.replyWithHTML(tx)
                }
            }
        }
    }
});

bot.on('text', async msg => {
    const { id } = msg.from;
    const tx = msg.message.text
    try {
        const $user = await userModel.findOne({ telegram: id });
        if (tx === '🔙Ortga') {
            $user.set({ step: '' }).save();
            msg.replyWithHTML("📋Bosh sahifa", { ...btn.menu });
        } else if (tx === '💳Hisobim') {
            msg.replyWithHTML(`💳Hisobingiz: <b>${Number($user?.balance || 0).toLocaleString()}</b> so'm`, { ...btn.balance })
        } else if (tx === '📈Statistika') {
            const $news = await shopModel.find({ flow: $user?.id, status: 'pending' }).countDocuments();
            const $success = await shopModel.find({ flow: $user?.id, status: 'success' }).countDocuments();
            const $sended = await shopModel.find({ flow: $user?.id, status: 'sended' }).countDocuments();
            const $wait = await shopModel.find({ flow: $user?.id, status: 'wait' }).countDocuments();
            const $delivered = await shopModel.find({ flow: $user?.id, status: 'delivered' }).countDocuments();
            const $reject = await shopModel.find({ flow: $user?.id, status: 'reject' }).countDocuments();
            const $refs = await userModel.find({ ref_id: $user.id });

            const $deliver = await shopModel.find({ flow: $user?.id, status: 'delivered' })
            let $total = 0;

            $deliver?.forEach(d => {
                $total += d?.for_admin;
            });
            let $tref = 0;
            for (let ref of $refs) {
                const $rflows = await shopModel.find({ flow: ref.id });
                $rflows.forEach(rf => {
                    $tref += rf.for_ref
                })
            }

            msg.replyWithHTML(`<b>📈Umumiy hisobot</b>\n\n🛒Yangi: <b>${$news}</b> ta\n📦Dostavkaga tayyor: <b>${$success}</b> ta\n🔎Yetkazilmoqda: <b>${$sended}</b> ta\n🔃Qayta aloqa: <b>${$wait}</b> ta\n✅Yetkazilgan: <b>${$delivered}</b> ta\n❌Bekor qilingan: <b>${$reject}</b> ta\n👥Referallar:<b> ${$refs?.length}</b> ta\n💰Referallardan: <b>${Number($tref).toLocaleString()}</b> so'm\n\n💳Umumiy foyda: <b>${($total + $tref).toLocaleString()}</b> so'm`, { ...btn.statistics });
        } else if (tx === '⚙Sozlamalar') {
            msg.replyWithHTML(`🆔TelegramID: <b>${id}</b>`)
        } else if (tx === '📞Bog\'lanish') {
            msg.replyWithHTML("<b>👀Biz bilan aloqaga chiqish uchun pastdagi tugmachaga bosing!</b>", { ...btn.contacts })
        }else{
            if($user.step === 'request_card'){
                
            }
        }
    } catch (error) {
        console.log(error);
    }
});

bot.on('callback_query', async msg => {
    const { id } = msg.from;
    const { data } = msg.callbackQuery;
    try {
        const $user = await userModel.findOne({ telegram: id });
        if (data === 'stat_today') {
            const day = new Date().getDate();
            const month = new Date().getMonth();
            const year = new Date().getFullYear()
            const $news = await shopModel.find({ flow: $user?.id, status: 'pending', month, day, year }).countDocuments();
            const $success = await shopModel.find({ flow: $user?.id, status: 'success', month, day, year }).countDocuments();
            const $sended = await shopModel.find({ flow: $user?.id, status: 'sended', month, day, year }).countDocuments();
            const $wait = await shopModel.find({ flow: $user?.id, status: 'wait', month, day, year }).countDocuments();
            const $delivered = await shopModel.find({ flow: $user?.id, status: 'delivered', month, day, year }).countDocuments();
            const $reject = await shopModel.find({ flow: $user?.id, status: 'reject', month, day, year }).countDocuments();

            const $deliver = await shopModel.find({ flow: $user?.id, status: 'delivered', month, day, year })
            let $total = 0;

            $deliver?.forEach(d => {
                $total += d?.price;
            })

            msg.replyWithHTML(`<b>📈Bugunlik hisobot</b>\n\n🛒Yangi: <b>${$news}</b> ta\n📦Dostavkaga tayyor: <b>${$success}</b> ta\n🔎Yetkazilmoqda: <b>${$sended}</b> ta\n🔃Qayta aloqa: <b>${$wait}</b> ta\n✅Yetkazilgan: <b>${$delivered}</b> ta\n❌Bekor qilingan: <b>${$reject}</b> ta\n\n💳Umumiy foyda: <b>${$total.toLocaleString()}</b> so'm`, { ...btn.statistics });
        } else if (data === 'stat_yesterday') {
            const day = new Date().getDate() - 1;
            const month = new Date().getMonth();
            const year = new Date().getFullYear()
            console.log(month);
            const $news = await shopModel.find({ flow: $user?.id, status: 'pending', month, day, year }).countDocuments();
            const $success = await shopModel.find({ flow: $user?.id, status: 'success', month, day, year }).countDocuments();
            const $sended = await shopModel.find({ flow: $user?.id, status: 'sended', month, day, year }).countDocuments();
            const $wait = await shopModel.find({ flow: $user?.id, status: 'wait', month, day, year }).countDocuments();
            const $delivered = await shopModel.find({ flow: $user?.id, status: 'delivered', month, day, year }).countDocuments();
            const $reject = await shopModel.find({ flow: $user?.id, status: 'reject', month, day, year }).countDocuments();

            const $deliver = await shopModel.find({ flow: $user?.id, status: 'delivered', month, day, year })
            let $total = 0;

            $deliver?.forEach(d => {
                $total += d?.price;
            })

            msg.replyWithHTML(`<b>📈Kechagi hisobot</b>\n\n🛒Yangi: <b>${$news}</b> ta\n📦Dostavkaga tayyor: <b>${$success}</b> ta\n🔎Yetkazilmoqda: <b>${$sended}</b> ta\n🔃Qayta aloqa: <b>${$wait}</b> ta\n✅Yetkazilgan: <b>${$delivered}</b> ta\n❌Bekor qilingan: <b>${$reject}</b> ta\n\n💳Umumiy foyda: <b>${$total.toLocaleString()}</b> so'm`, { ...btn.statistics });
        } else if (data === 'stat_month') {
            const month = new Date().getMonth();
            const year = new Date().getFullYear()
            console.log(month);
            const $news = await shopModel.find({ flow: $user?.id, status: 'pending', month, year }).countDocuments();
            const $success = await shopModel.find({ flow: $user?.id, status: 'success', month, year }).countDocuments();
            const $sended = await shopModel.find({ flow: $user?.id, status: 'sended', month, year }).countDocuments();
            const $wait = await shopModel.find({ flow: $user?.id, status: 'wait', month, year }).countDocuments();
            const $delivered = await shopModel.find({ flow: $user?.id, status: 'delivered', month, year }).countDocuments();
            const $reject = await shopModel.find({ flow: $user?.id, status: 'reject', month, year }).countDocuments();

            const $deliver = await shopModel.find({ flow: $user?.id, status: 'delivered', month, year })
            let $total = 0;

            $deliver?.forEach(d => {
                $total += d?.price;
            })

            msg.replyWithHTML(`<b>📈Oylik hisobot</b>\n\n🛒Yangi: <b>${$news}</b> ta\n📦Dostavkaga tayyor: <b>${$success}</b> ta\n🔎Yetkazilmoqda: <b>${$sended}</b> ta\n🔃Qayta aloqa: <b>${$wait}</b> ta\n✅Yetkazilgan: <b>${$delivered}</b> ta\n❌Bekor qilingan: <b>${$reject}</b> ta\n\n💳Umumiy foyda: <b>${$total.toLocaleString()}</b> so'm`, { ...btn.statistics });
        } else if (data === 'stat_all') {
            const $news = await shopModel.find({ flow: $user?.id, status: 'pending' }).countDocuments();
            const $success = await shopModel.find({ flow: $user?.id, status: 'success' }).countDocuments();
            const $sended = await shopModel.find({ flow: $user?.id, status: 'sended' }).countDocuments();
            const $wait = await shopModel.find({ flow: $user?.id, status: 'wait' }).countDocuments();
            const $delivered = await shopModel.find({ flow: $user?.id, status: 'delivered' }).countDocuments();
            const $reject = await shopModel.find({ flow: $user?.id, status: 'reject' }).countDocuments();
            const $refs = await userModel.find({ ref_id: $user.id });

            const $deliver = await shopModel.find({ flow: $user?.id, status: 'delivered' })
            let $total = 0;

            $deliver?.forEach(d => {
                $total += d?.for_admin;
            });
            let $tref = 0;
            for (let ref of $refs) {
                const $rflows = await shopModel.find({ flow: ref.id });
                $rflows.forEach(rf => {
                    $tref += rf.for_ref
                })
            }

            msg.replyWithHTML(`<b>📈Umumiy hisobot</b>\n\n🛒Yangi: <b>${$news}</b> ta\n📦Dostavkaga tayyor: <b>${$success}</b> ta\n🔎Yetkazilmoqda: <b>${$sended}</b> ta\n🔃Qayta aloqa: <b>${$wait}</b> ta\n✅Yetkazilgan: <b>${$delivered}</b> ta\n❌Bekor qilingan: <b>${$reject}</b> ta\n👥Referallar:<b> ${$refs?.length}</b> ta\n💰Referallardan: <b>${Number($tref).toLocaleString()}</b> so'm\n\n💳Umumiy foyda: <b>${($total + $tref).toLocaleString()}</b> so'm`, { ...btn.statistics });
        }
        // 
        else if (data === 'request_pay') {
            if (!$user?.balance || $user?.balance < 1000) {
                msg.replyWithHTML(`❗Pulni chiqarib olish <b>1 000</b> so'mdan boshlanadi!`)
            } else {
                $user.set({ step: 'request_card' }).save();
                msg.replyWithHTML("💳Karta raqamingizni kiriting\n📋Namuna: <b>9860160147090205</b>", { ...btn.back })
            }
        } else if (data === 'payment_history') {
            const $pays = await payModel.find({ from: $user._id });
            if (!$pays[0]) {
                msg.replyWithHTML("❗Siz pul yechmagansiz!")
            } else {
                let tx = `<b>📋To'lovlar tarixi</b>\n\n`;
                $pays?.forEach((p, i) => {
                    txt += `${(i + 1)} - to'lov: ${Number(p.count).toLocaleString} so'm\n`
                });
                msg.replyWithHTML(tx)
            }
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = bot
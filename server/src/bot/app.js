const { Telegraf, Markup } = require('telegraf');
const { BOT_TOKEN } = require('../configs/env');
const userModel = require('../models/user.model');
const btn = require('./btn');
const shopModel = require('../models/shop.model');
const payModel = require('../models/pay.model');
const { inlineKeyboard } = require('telegraf').Markup;
const moment = require('moment/moment');
const tguserModel = require('../models/tguser.model');
const channel = "-1001938875129";
const bot = new Telegraf('5801148232:AAEWScQZ45I0XacFYDmjJaJvLD3Wtxq8ihA')
bot.start(async msg => {
    const { id } = msg.from;
    const $user = await userModel.findOne({ telegram: id });
    new tguserModel({
        id: id
    }).save().catch(() => { });
    if (!$user) {
        msg.replyWithHTML(`<b>❗Avval botni aktivlashtisrishingiz kerak!</b>\n<code>${id}</code> <a href='https://sharqiy.uz'>Sharqiy.uz</a> sayti orqali aktivlashtiring!`)
    } else {
        const command = msg.startPayload;
        if (!command) {
            msg.replyWithHTML(`<b>📋Bosh sahifa</b>`, { ...btn.menu });
        } else {
            if (command === 'pay') {
                if (!$user?.balance || $user?.balance < 1000) {
                    msg.replyWithHTML(`❗Pulni chiqarib olish <b>1 000</b> so'mdan boshlanadi!`)
                } else {
                    const $pays = await payModel.findOne({ from: $user._id, status: 'pending' });
                    if ($pays) {
                        msg.replyWithHTML(`❗Sizda tekshiruvdagi <b>${$pays.count}</b> so'm lik to'lov mavjud!\n✉Iltimos tekshiruv tugashini kuting!`);
                    } else {
                        $user.set({ step: 'request_card' }).save();
                        msg.replyWithHTML("💳Karta raqamingizni kiriting\n📋Namuna: <b>9860160147090205</b>", { ...btn.back })
                    }
                }
            } else if (command === 'pay_history') {
                const $pays = await payModel.find({ from: $user._id });
                if (!$pays[0]) {
                    msg.replyWithHTML("❗Siz pul yechmagansiz!")
                } else {
                    let tx = `<b>📋To'lovlar tarixi</b>\n\n`;
                    $pays?.forEach((p, i) => {
                        tx += `${(i + 1)} - ${Number(p.count).toLocaleString()} so'm - ${p?.status === 'pending' ? '🕓' : p?.status === 'reject' ? '❌' : '✅'}\n`
                    });
                    msg.replyWithHTML(tx)
                }
            }
        }
    }
});

bot.on('text', async msg => {
    const { id } = msg.from;
    const tx = msg.message.text;
    try {
        if (id == 1527583880 || id == 1084614519 || id == 5991285234) {
            if (tx == 'Send') {
                msg.replyWithHTML("Yuborilishi kerak bo'lgan habar va linklarni quyidagi tartibda jo'nating!\n\n/send TEXT || knopka || knopka-linki");
            } else if (tx?.startsWith('/send')) {
                try {
                    let text = tx.replace('/send', '');
                    const txt = text.split('||')[0];
                    const knopka = text.split('||')[1];
                    const link = text.split('||')[2];
                    const $tgusers = await tguserModel.find();
                    $tgusers.forEach((user) => {
                        bot.telegram.sendMessage(user.id, txt, {
                            ...Markup.inlineKeyboard([
                                { text: knopka, url: link }
                            ])
                        }).catch(() => { })
                    });
                    msg.replyWithHTML("<i>✅Yuborildi!</i>")
                } catch {
                    msg.replyWithHTML("<b>❗Iltimos to'g'ri kiriting!</b>")
                }
            }
        } else {
            const $user = await userModel.findOne({ telegram: id });
            if (!$user) {
                msg.replyWithHTML(`<b>❗Avval botni aktivlashtisrishingiz kerak!</b>\n<code>${id}</code> <a href='https://sharqiy.uz'>Sharqiy.uz</a> sayti orqali aktivlashtiring!`)
            } else {
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
                        });
                    }
                    msg.replyWithHTML(`<b>📈Umumiy hisobot</b>\n\n🛒Yangi: <b>${$news}</b> ta\n📦Dostavkaga tayyor: <b>${$success}</b> ta\n🔎Yetkazilmoqda: <b>${$sended}</b> ta\n🔃Qayta aloqa: <b>${$wait}</b> ta\n✅Yetkazilgan: <b>${$delivered}</b> ta\n❌Bekor qilingan: <b>${$reject}</b> ta\n👥Referallar:<b> ${$refs?.length}</b> ta\n💰Referallardan: <b>${Number($tref).toLocaleString()}</b> so'm\n\n💳Umumiy foyda: <b>${($total + $tref).toLocaleString()}</b> so'm`, { ...btn.statistics });
                } else if (tx === '⚙Sozlamalar') {
                    msg.replyWithHTML(`🆔TelegramID: <b>${id}</b>`)
                } else if (tx === '📞Bog\'lanish') {
                    msg.replyWithHTML("<b>👀Biz bilan aloqaga chiqish uchun pastdagi tugmachaga bosing!</b>", { ...btn.contacts })
                } else {
                    if ($user.step === 'request_card') {
                        if (tx.length < 16) {
                            msg.replyWithHTML("<b>❗Karta raqamini to'g'ri kiriting!</b>")
                        } else {
                            let txt = `<b>💳Pul chiqarish uchun yangi so'rov!</b>\n\n👤Sotuvchi: <b>${$user.name}</b>\n🆔Sharqiy.uz: ${$user.id}\n📞Raqami: ${$user.phone}\n💳Karta: <code>${tx}</code>\n💰Miqdor: <code>${Number($user.balance).toLocaleString()}</code> so'm\n\n👀To'lov qilgach <b>✅To'landi</b> tugmasini\n❗Bekor qilingan bo'lsa <b>❌Bekor qilindi</b> tugmasini bosing!`
                            bot.telegram.sendMessage(channel, txt, {
                                ...inlineKeyboard([
                                    [{ text: "✅To'landi", callback_data: `success_pay_${tx}_${$user.balance}_${$user._id}` }],
                                    [{ text: "❌Bekor qilindi", callback_data: `reject_pay_${tx}_${$user.balance}_${$user._id}` }]
                                ]),
                                parse_mode: "HTML"
                            }).then(() => {
                                new payModel({
                                    from: $user._id,
                                    count: $user.balance,
                                    created: moment.now() / 1000
                                }).save().then(() => {
                                    msg.replyWithHTML("<i>✅So'rovingiz tekshiruvga yuborildi!</i>\n📋Holat haqida o'zimiz sizga habar beramiz!")
                                })
                            }).catch(err => {
                                console.log(err);
                                msg.replyWithHTML("<b>❗Nimadir xato</b>")
                            })
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
});

bot.on('callback_query', async msg => {
    const { id } = msg.from;
    const { data } = msg.callbackQuery;
    console.log(data);
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
                const $pays = await payModel.findOne({ from: $user._id, status: 'pending' });
                if ($pays) {
                    msg.replyWithHTML(`❗Sizda tekshiruvdagi <b>${$pays.count}</b> so'm lik to'lov mavjud!\n✉Iltimos tekshiruv tugashini kuting!`);
                } else {
                    $user.set({ step: 'request_card' }).save();
                    msg.replyWithHTML("💳Karta raqamingizni kiriting\n📋Namuna: <b>9860160147090205</b>", { ...btn.back })
                }
            }
        } else if (data === 'payment_history') {
            const $pays = await payModel.find({ from: $user._id });
            if (!$pays[0]) {
                msg.replyWithHTML("❗Siz pul yechmagansiz!")
            } else {
                let tx = `<b>📋To'lovlar tarixi</b>\n\n`;
                $pays?.forEach((p, i) => {
                    tx += `${(i + 1)} - ${Number(p.count).toLocaleString()} so'm - ${p?.status === 'pending' ? '🕓' : p?.status === 'reject' ? '❌' : '✅'}\n`
                });
                msg.replyWithHTML(tx)
            }
        } else if (data?.includes('success_pay_')) {
            try {
                const card = data.split('_')[2]
                const amount = +data.split('_')[3]
                const uId = data.split('_')[4]
                const $user = await userModel.findById(uId);
                const $pay = await payModel.findOne({ from: uId, status: 'pending' });
                $pay.set({ status: 'success', card }).save();
                $user.set({ balance: $user.balance - amount }).save();
                let txt = `<b>💳Pul chiqarish uchun yangi so'rov!</b>\n\n👤Sotuvchi: <b>${$user.name}</b>\n🆔Sharqiy.uz: ${$user.id}\n📞Raqami: ${$user.phone}\n💳Karta: <code>${card}</code>\n💰Miqdor: <code>${Number(amount).toLocaleString()}</code> so'm\n\n✅To'landi!`
                msg.editMessageReplyMarkup().catch(() => { });
                msg.editMessageText(txt, { 'parse_mode': 'HTML' }).then(() => {
                    bot.telegram.sendMessage($user.telegram, `✅${amount} so'm ${card} karta raqamiga o'tkazildi!`);
                }).catch(err => {
                    console.log(err);
                })
            } catch (err) {
                console.log(err);
            }

        } else if (data?.includes('reject_pay_')) {
            try {
                const card = data.split('_')[2]
                const amount = +data.split('_')[3]
                const uId = data.split('_')[4]
                const $user = await userModel.findById(uId);
                const $pay = await payModel.findOne({ from: uId, status: 'pending' });
                $pay.set({ status: 'reject', card }).save();
                // $user.set({ balance: $user.balance - amount }).save();
                let txt = `<b>💳Pul chiqarish uchun yangi so'rov!</b>\n\n👤Sotuvchi: <b>${$user.name}</b>\n🆔Sharqiy.uz: ${$user.id}\n📞Raqami: ${$user.phone}\n💳Karta: <code>${card}</code>\n💰Miqdor: <code>${Number(amount).toLocaleString()}</code> so'm\n\n❌Bekor qilindi!`
                msg.editMessageReplyMarkup().catch(() => { });
                msg.editMessageText(txt, { 'parse_mode': 'HTML' }).then(() => {
                    bot.telegram.sendMessage($user.telegram, `❌${amount} so'm ${card} karta raqamiga o'tkazish bekor qilindi!`);
                }).catch(err => {
                    console.log(err);
                })
            } catch (err) {
                console.log(err);
            }

        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = bot
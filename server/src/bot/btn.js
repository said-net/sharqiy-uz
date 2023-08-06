const { keyboard, inlineKeyboard } = require('telegraf').Markup;

module.exports = {
    menu: keyboard([
        ['💳Hisobim', '📈Statistika'],
        ['⚙Sozlamalar', '📞Bog\'lanish']
    ]).resize(true),
    // 
    balance: inlineKeyboard([
        [{ text: '🕐Tolovlar tarixi', callback_data: 'payment_history' }]
    ]),
    // 
    statistics: inlineKeyboard([
        [{ text: 'Bugunlik', callback_data: 'stat_today' }],
        [{ text: 'Kechagi', callback_data: 'stat_yesterday' }],
        [{ text: 'Oylik', callback_data: 'stat_month' }],
        [{ text: 'Umumiy', callback_data: 'stat_all' }],
    ]),
}
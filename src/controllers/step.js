const UserValidator = require("../validators/users");
const Users = require("../models/Users");

const phoneButton = {
    one_time_keyboard: true,
    resize_keyboard: true,
    keyboard: [
        [{
            text: "Send Phone",
            request_contact: true
        }]
    ]
}

const step1 = async (bot, message) => {
    const chatId = message.from.id;
    try {
        const text = message.text;

        const isValid = UserValidator.user({ username: text });

        if (!isValid) {
            bot.sendMessage(chatId,
                `Ismingizda <b>raqamlar</b> va <b>belgilar</b> qatnashmagan bo'lishi kerak. Iltimos ismingizni to'g'ri kiriting!`,
                {
                    parse_mode: "HTML"
                }
            );
        } else {
            const { username } = await Users.updateOne(chatId, text, null, null, 2, null);

            bot.sendMessage(chatId, `Barakalla ${username}! Iltimos endi yoshingizni kiriting!`);
        }
    } catch (error) {
        console.log(error);
        bot.sendMessage(chatId, 'Botda nosozlik bo`ldi, Iltimos bot adminlariga murojat qiling!');
    }
}

const step2 = async (bot, message) => {
    const chatId = message.from.id;
    try {
        const text = message.text;
        const isValid = UserValidator.user({ age: +text });

        if (!isValid) {
            bot.sendMessage(chatId, `Iltimos yoshingizni to'g'ri kiriting, yosh oralig'i 8 dan 60 gacha bo'lishi kerak`);
        } else {
            const { username } = await Users.updateOne(chatId, null, null, +text, 3, null);

            bot.sendMessage(chatId, `Barakalla ${username}! Iltimos endi kontaktizni kiriting kiriting!`, {
                reply_markup: phoneButton
            })
        }
    } catch (error) {
        console.log(error);
        bot.sendMessage(chatId, 'Botda nosozlik bo`ldi, Iltimos bot adminlariga murojat qiling!');
    }
}

const step3 = async (bot, message) => {
    const chatId = message.from.id;
    try {
        const contact = message.contact;

        if(!contact) {
            bot.sendMessage(chatId, `Iltimos contactingizni yuboring`, {
                reply_markup: phoneButton
            })
        }else {
            const { username } = await Users.updateOne(chatId, null, contact.phone_number, null, 4, null);

            bot.sendMessage(chatId, `Barakalla ${username}! Biz siz bilan tez orada aloqaga chiqamiz!`);
        }
    } catch(error) {
        console.log(error);
        bot.sendMessage(chatId, 'Botda nosozlik bo`ldi, Iltimos bot adminlariga murojat qiling!');
    }
}

const step4 = (bot, message) => {
    const chatId = message.from.id;

    bot.sendMessage(chatId, `Biz siz bilan tez orada aloqaga chiqamiz!`)
}

module.exports = {
    step1,
    step2,
    step3,
    step4
}
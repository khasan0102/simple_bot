const UserValidator = require("../validators/users");
const Comments = require('../models/Comments');
const Users = require("../models/Users");
const buttons = require('../lib/buttons');

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
                reply_markup: buttons.phoneButton
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

        if (!contact) {
            bot.sendMessage(chatId, `Iltimos contactingizni yuboring`, {
                reply_markup: buttons.phoneButton
            })
        } else {
            const { username } = await Users.updateOne(chatId, null, contact.phone_number, null, 4, null);

            bot.sendMessage(chatId, `Barakalla ${username}! Biz siz bilan tez orada aloqaga chiqamiz!`, {
                reply_markup: buttons.menuButton
            });
        }
    } catch (error) {
        console.log(error)
        bot.sendMessage(chatId, 'Botda nosozlik bo`ldi, Iltimos bot adminlariga murojat qiling!');
    }
}

const step4 = async (bot, message) => {
    const chatId = message.from.id;
    const text = message.text;
    try {
        if (text === `CV jo'natish`) {
            await Users.updateOne(chatId, null, null, null, 5);

            bot.sendMessage(chatId, `Iltimos cv jo'natish turini tanglang`, {
                reply_markup: buttons.cvButton
            });

            return;
        } else if (text === 'Izoh bildirish') {
            await Users.updateOne(chatId, null, null, null, 8);

            bot.sendMessage(chatId, 'Hurmatli foydalanuvchi fikringizni bildiring', {
                reply_markup: buttons.backButton
            });
            return;
        }

        bot.sendMessage(chatId, `Iltimos siz agar fikr bildirmoqchi bo'lsangiz yoki CV jo'natmoqchi bo'lsangiz tanlang!`, {
            reply_markup: buttons.menuButton
        });
    } catch (error) {
        bot.sendMessage(chatId, 'Botda nosozlik bo`ldi, Iltimos bot adminlariga murojat qiling!');
    }
}

const step5 = async (bot, message) => {
    const chatId = message.from.id;
    const text = message.text;
    try {
        if (text === `PDF formatida`) {
            await Users.updateOne(chatId, null, null, null, 6);
            bot.sendMessage(chatId, `Cvyingizni file ko'rinishida jo'nating`, {
                reply_markup: buttons.backButton
            });
        } else if (text === `Text ko'rinishida`) {
            await Users.updateOne(chatId, null, null, null, 7);
            bot.sendMessage(chatId, `Cvtingizni yozma ravishda kiriting. CV yozma ko'rinishing uzunligi kamida 100 belgi bo'lishi kerak`, {
                reply_markup: buttons.backButton
            });
        } else if (text === '⬅️ Orqaga') {
            await Users.updateOne(message.chat.id, null, null, null, 4);
            bot.sendMessage(chatId, `Iltimos siz agar fikr bildirmoqchi bo'lsangiz yoki CV jo'natmoqchi bo'lsangiz tanlang!`, {
                reply_markup: buttons.menuButton
            });
        }
    } catch (error) {
        console.log(error);
        bot.sendMessage(chatId, 'Botda nosozlik bo`ldi, Iltimos bot adminlariga murojat qiling!');
    }
}

const step6 = async (bot, message) => {
    const chatId = message.from.id;
    const text = message.text;
    try {
        if (text === '⬅️ Orqaga') {
            await Users.updateOne(chatId, null, null, null, 5);

            bot.sendMessage(chatId, `Iltimos cv jo'natish turini tanglang`, {
                reply_markup: buttons.cvButton
            });
        } else {
            if (!message.document || message.document.mime_type !== 'application/pdf') {
                bot.sendMessage(chatId, `CVni pdf formatida jo'nating`, {
                    reply_markup: buttons.backButton
                });
            } else {
                await Users.updateOne(
                    chatId, null, null, null, 4, null, message.document.file_id
                );

                bot.sendMessage(chatId, `Sizni CV qabul qilindi. Tez orada aloqaga chiqamiz!`, {
                    reply_markup: buttons.menuButton
                });
            }
        }
    } catch (error) {
        console.log(error);
        bot.sendMessage(chatId, 'Botda nosozlik bo`ldi, Iltimos bot adminlariga murojat qiling!');
    }
}


const step7 = async (bot, message) => {
    const chatId = message.from.id;
    const text = message.text;
    try {
        if (text === '⬅️ Orqaga') {
            await Users.updateOne(chatId, null, null, null, 5);

            bot.sendMessage(chatId, `Iltimos cv jo'natish turini tanglang`, {
                reply_markup: buttons.cvButton
            });
        } else if (!text || text.length < 100) {
            bot.sendMessage(
                chatId, 
                `CV ni yozma ko'rinishini noto'g'ri jo'natdingiz. Iltimos CV to'g'ri kiriting.CVning uzunligi kamida 100ta belgi bo'lishi kerak`
            )
        }else {
            await Users.updateOne(chatId, null, null, null, 4, null, null, text);

            bot.sendMessage(chatId, `Sizni CV qabul qilindi. Tez orada aloqaga chiqamiz!`, {
                reply_markup: buttons.menuButton
            });
        }
    } catch (error) {
        console.log(error);
        bot.sendMessage(chatId, 'Botda nosozlik bo`ldi, Iltimos bot adminlariga murojat qiling!');
    }
}


const step8 = async (bot, message) => {
    const chatId = message.from.id;
    const text = message.text;
    try {
        if (text === '⬅️ Orqaga') {
            await Users.updateOne(chatId, null, null, null, 4);

            bot.sendMessage(chatId, `Iltimos cv jo'natish turini tanglang`, {
                reply_markup: buttons.menuButton
            });
        }else if(!text) {
            bot.sendMessage(chatId, `Iltimos izohingizni yozma ko'rinishda kiriting`);
        }else {
            await Comments.create(text, chatId);
            await Users.updateOne(chatId, null, null, null, 4);
            bot.sendMessage(chatId, `Sizning izohingiz qabul qilindi. izoh uchun rahmat. Biz tez orada aloqaga chiqamiz`, {
                reply_markup: buttons.menuButton
            });
        }
    } catch(error) {
        console.log(error);
        bot.sendMessage(chatId, 'Botda nosozlik bo`ldi, Iltimos bot adminlariga murojat qiling!');
    }
}

const step9 = async (bot, message) => {
    try {
        bot.sendMessage(message.chat.id, `Xurmatli foydalanuvhci siz bot admin tomonlaridan block qilingansiz. Bu borasida adminlarimiz bog'laning`, {
            reply_markup: {
                remove_keyboard: true
            }
        });
    } catch(error) {
        console.log(error);
    }
}

module.exports = {
    step1,
    step2,
    step3,
    step4,
    step5,
    step6,
    step7,
    step8,
    step9
} 
const Users = require("../models/Users");
const buttons = require("../lib/buttons");
const XLSX = require("xlsx");
const path = require('path');
const fs = require("fs");

const usersWithXlsx = async (bot, message) => {
    const chatId = message.from.id
    try {
        const users = await Users.getAll();

        const usersSheet = XLSX.utils.json_to_sheet(users);
        const usersBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(usersBook, usersSheet);

        XLSX.writeFile(usersBook, 'start.xlsx');
        const pathF = path.join(process.cwd(), 'start.xlsx');
        bot.sendDocument(chatId, pathF);
        fs.unlink(pathF, (err) => {
            console.log(err)
        });
    } catch (error) {
        console.log(error);
    }
}

const users = async (bot, message) => {
    try {
        const chatId = message.chat.id;

        const { count } = await Users.allCount();

        const users = await Users.getAll(0, 10);

        let responseText = `<b>Natijalar 1-${users.length} ${count}taning ichidan</b>\n\n`;

        for (let i in users) {
            responseText += `<b>${+i + 1}</b>.${users[i].username} - ${users[i].phone_number}\n`
        }

        bot.sendMessage(chatId, responseText, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: buttons.usersButtons(users, 0, count)
            }
        });
    } catch (error) {
        console.log(error);
    }
}


const usersPagination = async (bot, query, page) => {
    try {
        const chatId = query.message.chat.id;
        const messageId = query.message.message_id;

        const { count } = await Users.allCount();
        const users = await Users.getAll(page * 10, 10);
        const start = page * 10;

        let responseText = `<b>Natijalar ${start + 1}-${start + users.length} ${count}taning ichidan</b>\n\n`;

        for (let i in users) {
            responseText += `<b>${+i + 1}</b>.${users[i].username} - ${users[i].phone_number}\n`
        }

        bot.editMessageText(responseText, {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: buttons.usersButtons(users, page, count)
            }
        })
    } catch (error) {
        console.log(error);
    }
}


const user = async (bot, query, chatId) => {
    try {
        const user = await Users.getOne(chatId);

        console.log(user);
        const responseText = `
            Ism: ${user.username}\nYosh: ${user.age}\nTelefon: ${user.phone_number}\nCV_PDF: ${user.user_cv ? 'Bor' : "Yo'q"}\nCV_TEXT: ${user.user_description ? 'Bor' : "Yo'q"}\nKomenetlar soni: ${user.comment_count}
        `;

        bot.sendMessage(query.message.chat.id, responseText, {
            reply_markup: {
                inline_keyboard: buttons.userButton(user)
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const setAdmin = async (bot, query, userId) => {
    try {
        const chatId = query.message.chat.id;
        const user = await Users.updateOne(userId, null, null, null, 1);

        bot.sendMessage(chatId, `${user.username} muvofaqiyatli admin qilindi!`);
        bot.sendMessage(userId, `Xurmatli siz ushbu botga admin qilindigiz`, {
            reply_markup: {
                remove_keyboard: true
            }
        });
        
    } catch(error) {
        console.log(error)
    }
}


const removeUser = async (bot, query, userId) => {
    try {
        const user = await Users.updateOne(userId, null, null, null, 9, 3);
        
        bot.sendMessage(query.message.chat.id, `${user.username} muvofaqiyatli o'chirildi ;)`);
    } catch(error) {
        console.log(error)
    }
}

module.exports = {
    usersPagination,
    usersWithXlsx,
    removeUser,
    setAdmin,
    users,
    user
}
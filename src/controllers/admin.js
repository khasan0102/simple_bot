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
    } catch(error) {
        console.log(error);
    }
}


const user = async (bot, query, chatId) => {
    try {
        console.log(chatId)
        const user = await Users.getOne(chatId);

        const responseText = `
            Ism: ${user.username}
            Yosh: ${user.age}
            Telefon: ${user.phone_number}
            CV_PDF: ${user.user_cv ? 'Bor': "Yo'q"}
            CV_TEXT: ${user.user_description ? 'Bor': "Yo'q"}
        `;

        bot.sendMessage(query.message.chat.id, responseText, {
            reply_markup: {
                inline_keyboard: buttons.userButton(users)
            }
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    usersPagination,
    usersWithXlsx,
    users,
    user
}
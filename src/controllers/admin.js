const Users = require("../models/Users");
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

        const responseText = `Natijalar 1-10 ${count} ichidan\n`;

        for (let i in users) {
            responseText += `${i + 1}.${users[i].username} - ${users[i].phone_number}\n`
        }

        bot.sendMessage(chatId, responseText);
    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    usersWithXlsx,
    users
}
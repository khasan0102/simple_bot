const Users = require("../models/Users");
const buttons = require("../lib/buttons");
const functions = require("../lib/functions");
const XLSX = require("xlsx");
const path = require('path');
const fs = require("fs");
const userMedia = {};

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
        const user = await Users.updateOne(userId, null, null, null, 0, 1);

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

const userCvPDF = async (bot, query, userId) => {
    try {
        const user = await Users.getOne(userId);
        
        bot.sendDocument(query.message.chat.id, user.user_cv, {
            caption: `<b>${user.username}ning CVsi PDF formatida!</b>`,
            parse_mode: 'HTML'  
        });
    } catch (error) {
        console.log(error);     
    }
}

const userCvText = async (bot, query, userId) => {
    try {
        const user = await Users.getOne(userId);

        bot.sendMessage(query.message.chat.id,
            user.user_description + "\n\n" + `<b>${user.username}ning CVsi text formatida!</b>`,
            {
                parse_mode: "HTML"
            }
        )
    } catch(error) {
        console.log(error);
    }
}


const setMessage = async (bot, message) => {
    try {
        const chatId = message.chat.id;
        Users.updateOne(chatId, null, null, null, 1);

        bot.sendMessage(chatId, `Jo'natmoqchi bo'lga xabaringizni yozing!`, {
            reply_markup: buttons.backButton
        });
    } catch(error) {
        console.log(error);
    }
}

const sendMessage = async (bot, message) => {
    try {
        const chatId = message.chat.id;
        if(message.text == "⬅️ Orqaga") {
            Users.updateOne(chatId, null, null, null, 1);

            bot.sendMessage(chatId, `Xabar bekor qilindi`, {
                reply_markup: {
                    remove_keyboard: true
                }
            });
        }else {
            if(message.media_group_id) {
                if(userMedia[chatId]) {
                    userMedia[chatId] = false;
                }else {
                    userMedia[chatId] = true;
                    bot.sendMessage(chatId, `Userlarga hali media formatida xabar jo'natish imkoniyati qo'shilmagan!`);
                }
                return;
            }else if(message.poll) {
                bot.sendMessage(chatId, `Siz bunday xabar jo'nata olmaysiz`);
            }else {
                const { count } = await Users.allCount();
                const pages = Math.ceil(count / 30);
                
                let timeOut = 0;
                const caption = message.caption ? functions.makeResponse(
                    message.caption, message.caption_entities
                ) : undefined;
                const text = message.text ? functions.makeResponse(
                    message.text, message.entities
                ) : null

                for(let i = 0; i < pages; i++) {
                    const users = await Users.getAll(i * 30, 30);
                    console.log(users)
                    setTimeout(() => {
                        for(let user of users) {
                            if(message.document) {
                                bot.sendDocument(user.chat_id, message.document.file_id, {
                                    caption
                                })
                            }else if(message.photo) {
                                bot.sendPhoto(user.chat_id, 
                                    message.photo[message.photo.length - 1].file_id,{
                                        caption
                                    }
                                );
                            } else if(message.video) {
                                bot.sendVideo(user.chat_id, message.video.file_id, {
                                    caption
                                })
                            } else if(message.audio) {
                                bot.sendAudio(user.chat_id, message.audio.file_id, {
                                    caption
                                })
                            }else if(message.text) {
                                bot.sendMessage(user.chat_id, text);
                            }
                        }
                    }, timeOut);

                    timeOut += 1000;
                }
            }

            await Users.updateOne(chatId, null, null, null, 0);
            bot.sendMessage(chatId, `Sizning barcha xabaringiz barcha userlarga yuborilmoqda ;)`, {
                reply_markup: {
                    remove_keyboard: true
                }
            });
        }
    } catch(error) {
        console.log(error);
    }
}


module.exports = {
    usersPagination,
    usersWithXlsx,
    sendMessage,
    setMessage,
    removeUser,
    userCvText,
    userCvPDF,
    setAdmin,
    users,
    user
}
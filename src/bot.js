const TelegramBot = require('node-telegram-bot-api');   
const Users = require('./models/Users');
const path = require("path");

require('dotenv').config({ path: path.join(__dirname, '..', '.env')});

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, {polling: true});

bot.on('message', async (msg) => {
   const chatId = msg.from.id;
   const text = msg.text;

   const user = await Users.getOne(chatId);

   console.log(user)
});
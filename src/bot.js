const TelegramBot = require('node-telegram-bot-api');
const Users = require('./models/Users');
const StepController = require('./controllers/step');
const AdminController = require("./controllers/admin");
const path = require("path");

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
   const chatId = msg.from.id;
   let user = await Users.getOne(chatId);

   if (!user) {
      user = await Users.create(chatId);
      bot.sendMessage(chatId, 'Assalomu alaykum xurmatli foydalanuvchi, botga xush kelibsiz. Iltimos ismingizni kiriting!')
   } else if (user.role === 1) {
      switch (msg.text) {
         case '/users_xls':
            AdminController.usersWithXlsx(bot, msg);
            break;
         case '/users':
            AdminController.users(bot, msg);
            break;
      }
   } else {
      switch (user.step) {
         case 1:
            StepController.step1(bot, msg);
            break;
         case 2:
            StepController.step2(bot, msg);
            break;
         case 3:
            StepController.step3(bot, msg);
            break;
         case 4:
            StepController.step4(bot, msg);
            break;
         case 5:
            StepController.step5(bot, msg);
            break;
         case 6:
            StepController.step6(bot, msg);
            break;
         case 7:
            StepController.step7(bot, msg);
            break;
         case 8:
            StepController.step8(bot, msg);
            break;
      }
   }
});


bot.on("callback_query", query => {
   if(query.data === "leftEnd") 
     return bot.answerCallbackQuery(query.id, `Siz eng bosh qismdasiz`);
   
   if(query.data === "rightEnd") 
      return bot.answerCallbackQuery(query.id, `Siz eng oxirgi qismdasiz`);
   
   if(query.data === 'delete') 
      return bot.deleteMessage(query.message.chat.id, query.message.message_id);

   if(query.data.search('data')) 
     return AdminController.usersPagination(bot, query, query.data.slice(0, -5))
   
})


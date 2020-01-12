const TelegramBot = require('node-telegram-bot-api');

const Agent = require('socks5-https-client/lib/Agent');

const bot = new TelegramBot('BOT_TOKEN', {
    polling: true,
    request: {
        agentClass: Agent,
        agentOptions: {
            socksHost: 'HOST',
            socksPort: 8080,
            socksUsername: 'USER_NAME',
            socksPassword: 'PASSWORD'
        }
    }
});

//приветсвтие
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
        chatId,
        `
            Добро пожаловать в <b>RunaevaBot</b>
            
            <b>RunaevaBot</b> освободит Вас от необходимости помнить обо всем.
            Поставьте напоминание с помощью комадны /напомни  и не думайте ни о чем. 
        `, {
            parse_mode: 'HTML',
        }
    );
});


//напоминание
var notes = [];

bot.onText(/напомни (.+) в (.+)/, function (msg, match) {
    var userId = msg.from.id;
    var text = match[1];
    var time = match[2];

    notes.push({ 'uid': userId, 'time': time, 'text': text });

    bot.sendMessage(userId, 'Окей, напомню 👌');
});

setInterval(function(){
    for (var i = 0; i < notes.length; i++) {
        const curDate = new Date().getHours() + ':' + new Date().getMinutes();

        if (notes[i]['time'] === curDate) {
            bot.sendMessage(notes[i]['uid'], 'Напоминаю, что вы должны сейчас: '+ notes[i]['text']);
            notes.splice(i, 1);
        }
    }
}, 1000);

//доступ к номеру телефона
const requestPhoneKeyboard = {
    "reply_markup": {
        "one_time_keyboard": true,
        "keyboard": [[{
            text: "Мой номер телефона",
            request_contact: true,
            one_time_keyboard: true
        }], ["Закрыть"]]
    }
};

bot.onText(/\/phone/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Вы хотите получить доступ к своему номеру телефона?', requestPhoneKeyboard);
});

bot.on('contact', async (msg) => {
    const phone = msg.contact.phone_number;
    bot.sendMessage(msg.chat.id, `Телефонный номер сохранен: ${phone}`);
});

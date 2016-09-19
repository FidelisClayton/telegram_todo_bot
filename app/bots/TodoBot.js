(() => {
    "use strict";

    const emoji = require('node-emoji').emoji;
    const TelegramBot = require('node-telegram-bot-api');
    const TodoItemController = require('../controllers/TodoItemController.js')();

    module.exports = () => {
        const token = 'YOUR_TELEGRAM_TOKEN';
        const bot = new TelegramBot(token, {polling: true});


        bot.onText(/\/start/, (msg, match) => {
            console.log('Starting');

            const options = {
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [{ text: 'Listar tarefas' + emoji.heart, callback_data: 'list_todo_items' }],
                        [{ text: 'Nova tarefa', callback_data: 'new_todo_item' }],
                    ]
                }),
                parse_mode: 'Markdown'
            };

            bot.sendMessage(msg.from.id, 'https://media.giphy.com/media/wAVA7WdV2jita/giphy.gif')
                .then(() => {
                    bot.sendMessage(msg.from.id, 'Olá *' + msg.from.first_name + '*, o que deseja fazer?', options);
                })
            ;
        });

        bot.on('callback_query', (msg) => {
            switch(msg.data) {
                case 'new_todo_item':
                    TodoItemController.newTodoItem(bot, msg);
                    break;
                default:
                    const action = msg.data.split(' ')[0];
                    const payload = msg.data.split(' ')[1];

                    switch(action) {
                        case 'view_item':
                           TodoItemController.viewTodoItem(bot, msg, payload);

                            break;
                        case 'delete_item':
                            TodoItemController.deleteTodoItem(bot, msg, payload);

                            break;
                        case 'do_item':
                            TodoItemController.toggleTodoItemDoneStatus(bot, msg, payload);

                            break;
                        case 'undo_item':
                            TodoItemController.toggleTodoItemDoneStatus(bot, msg, payload);

                            break;

                        case 'list_todo_items':
                            TodoItemController.listTodoItems(bot, msg, payload);

                            break;
                    }

                    break;
            }
        });
    };
})();

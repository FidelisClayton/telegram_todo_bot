(() => {
    'use strict';

    const emoji = require('node-emoji');
    const TodoItem = require('../models/TodoItem')();

    module.exports = () => {
        const controller = {};


        const defaultOptions = {
            parse_mode: 'Markdown',
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: 'Listar tarefas ' , callback_data: 'list_todo_items 1' }],
                    [{ text: 'Nova tarefa', callback_data: 'new_todo_item' }],
                ]
            })
        };

        controller.listTodoItems = (bot, msg, page) => {
            page = page || 1;

            const options = {
                reply_markup: JSON.stringify({
                    inline_keyboard: []
                }),
                parse_mode: 'Markdown'
            };

            TodoItem.paginate({userId: msg.from.id}, {page: page, limit: 10})
                .then((result) => {
                    let todoItems = result.docs;

                    let paginas = result.pages;

                    if(todoItems.length > 0) {
                        const todos = [];

                        for(let i = 0; i < todoItems.length; i++) {
                            let icon = todoItems[i].done ? emoji.get('heavy_check_mark') : emoji.get('heavy_exclamation_mark');
                            todos.push([{ text: icon + " " + todoItems[i].title, callback_data: 'view_item ' + todoItems[i]._id }]);
                        }


                        if(paginas > page)
                            todos.push([{ text: 'Próxima página >', callback_data: 'list_todo_items ' + (page + 1)}]);

                        if((page - 1) > 0)
                            todos.push([{ text: '< Página anterior', callback_data: 'list_todo_items ' + (page - 1)}]);

                        if(todoItems.length > 0) {
                            options.reply_markup = JSON.stringify({inline_keyboard: todos});
                            bot.sendMessage(msg.from.id, '*' + msg.from.first_name + '*, essas são suas tarefas', options) ;
                        }

                    } else {
                        bot.sendMessage(msg.from.id, '*Você não possui tarefas* https://media.giphy.com/media/DrRb3w81xxFD2/giphy.gif ', defaultOptions);
                    }
                }, (err) => {
                    bot.sendMessage(msg.from.id, 'Ocorreu um erro ao listar suas tarefas', defaultOptions);       
                })
            ;
        };

        controller.newTodoItem = (bot, msg) => {
            const todoItem = {};

            const options = {
                reply_markup: JSON.stringify({
                    force_reply: true
                })
            };

            bot.sendMessage(msg.from.id, 'Digite o titulo da tarefa', options)
                .then((sended) => {

                    bot.onReplyToMessage(sended.chat.id, sended.message_id, (message) => {
                        todoItem.title = message.text;
                        todoItem.userId = msg.from.id;

                        bot.sendMessage(msg.from.id, 'Digite um descrição para a tarefa', options)
                            .then((sended) => {

                                bot.onReplyToMessage(sended.chat.id, sended.message_id, (message) => {
                                    todoItem.description = message.text;

                                    new TodoItem(todoItem).save()
                                        .then((item) => {
                                            bot.sendMessage(msg.from.id, 'Tarefa cadastrada com sucesso!', defaultOptions);
                                        })
                                    ;
                                });
                            })
                        ;
                    });
                })
            ;
        };

        controller.viewTodoItem = (bot, msg, id) => {
            const options = {
                parse_mode: 'Markdown',
                reply_markup: JSON.stringify({
                    inline_keyboard: []
                })
            };

            const buttons = [ ];


            TodoItem.findOne({_id: id})   
                .then((item) => {
                    buttons.push([{text: "Deletar", callback_data: 'delete_item ' + item._id}]);
                    
                    let message = '';
                    let icon = item.done ? emoji.get('heavy_check_mark') : emoji.get('heavy_exclamation_mark');

                    if(item.done === false) {
                        message = `${icon} _Não feito_ - *${item.title}* - ${item.description}`;
                        buttons.push([{text: icon + ' Marcar como feito', callback_data: 'do_item ' + item._id}]);
                    } else {
                        message = `${icon} _Feito_ - *${item.title}* - ${item.description}`;
                        buttons.push([{text: `${icon} Marcar como não feito.`, callback_data: 'undo_item ' + item._id}]);
                    }

                    options.reply_markup = JSON.stringify({inline_keyboard: buttons});


                    bot.sendMessage(msg.from.id, message, options);
                })
            ;
        };

        controller.toggleTodoItemDoneStatus = (bot, msg, id) => {
            TodoItem.findOne({_id: id})
               .then((item) => {
                    item.done = !item.done;
                    item.save();

                    if(item.done === true)
                        bot.sendMessage(msg.from.id, "Você marcou a tarefa *" + item.title + "* como concluída.", defaultOptions);
                    else
                        bot.sendMessage(msg.from.id, "Você marcou a tarefa *" + item.title + "* como não concluída", defaultOptions);
                })
            ;
        };

        controller.deleteTodoItem = (bot, msg, id) => {
            TodoItem.remove({_id: id})
                .then((data) => {
                    bot.sendMessage(msg.from.id, "Tarefa removida.", defaultOptions);
                })
            ;
        };

        return controller;
    };
})();

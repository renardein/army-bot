const subscriber = require('../../database/models/subscribers'),
    fs = require('fs'),
    answers = require('./gen_answer.js'),
    timer = require('./timer'),
    dateRegEx = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4}$/,
    timeRegEx = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/,
    configFile = require('../../config');

async function run(bot, config) {
    bot.on('text', async msg => {
        let commandData = msg.text.split(' '); //Корявый парсинг аргументов
        switch (commandData[0]) {
            case '/start': {
                await bot.sendAudio(msg.chat.id, 'CQACAgIAAxkBAANqYzxS_P4wP09n5lf8b68i_gQH38UAArIdAAJ2tehJbllN1BK0CtkqBA', {
                    caption: answers.start
                });
                break;
            }

            case '/about': {
                await bot.sendMessage(msg.chat.id, answers.about, { parse_mode: 'markdown', disable_web_page_preview: true });
                break;
            }

            case '/subscribe': {
                try {
                    // Проверка статуса подписки
                    if (!await subscriber.isExists(msg.chat.id)) {
                        //Если нет, то подписываем
                        await subscriber.add(msg.chat.id);
                        await bot.sendMessage(msg.chat.id, answers.userSubscribed);
                    } else {
                        await bot.sendMessage(msg.chat.id, answers.userExists);
                    }
                } catch (err) {
                    console.log('\x1b[41m', `[ERROR] ${err.message}`);
                }
                break;
            }

            case '/unsubscribe': {
                try {
                    // Проверка статуса подписки
                    if (await subscriber.isExists(msg.chat.id)) {
                        //Если есть, то отписываем
                        await subscriber.remove(msg.chat.id);
                        await bot.sendMessage(msg.chat.id, answers.userUnsubscribed);
                    } else {
                        await bot.sendMessage(msg.chat.id, answers.userNotSubscribed);
                    }
                } catch (err) {
                    console.log('\x1b[41m', `[ERROR] ${err.message}`);
                }
                break;
            }

            case '/army': {
                let data = await timer.getServeTime(config.chosenDate, 'command');
                await bot.sendMessage(msg.chat.id,
                    answers.getTemplateString(answers.army,
                        ['%startDate%', '%endDate%', '%totalDays%', '%daysPassed%', '%daysLeft%', '%subscribers%', '%progressGraphical%'],
                        [data.startDate, data.endDate, data.totalDays, data.daysPassed, data.daysLeft, data.subscribers, data.progressGraphical]),
                    { parse_mode: 'markdown' })
                break;
            }

            case '/debug': {
                const uptime = Math.round(process.uptime());
                const usedMem = Math.round(process.memoryUsage().rss / 1024 / 1024);
                const message = answers.getTemplateString(answers.debug, ['%uptime%', '%usedMem%'], [uptime, usedMem]);
                await bot.sendMessage(msg.chat.id, message, { parse_mode: 'markdown' });
                break;
            }

            case '/set': {
                // Проверяем, является ли отправитель сообщения администратором
                if (msg.from.id === config.adminUserId) {
                    switch (commandData[1]) {
                        case 'date': {
                            if (dateRegEx.test(commandData[2])) {
                                // Записываем изменения в файл конфигурации
                                try {
                                    configFile.setDate(commandData[2]);
                                    await bot.sendMessage(
                                        msg.chat.id,
                                        `Начальная дата успешно установлена: ${commandData[2]}`,
                                    );
                                } catch (error) {
                                    console.error(error);
                                }
                            } else {
                                await bot.sendMessage(
                                    msg.chat.id,
                                    `Неверный формат даты: ${commandData[2]}`,
                                );
                            }
                            break;
                        }

                        case 'mailer': {
                            switch (commandData[2]) {
                                case 'cron': {
                                    // Проверяем, соответствует ли введенное время регулярному выражению
                                    if (timeRegEx.test(commandData[3])) {
                                        const time = commandData[2].match(timeRegEx);
                                        config.cronPattern = `${time[2]} ${time[1]} * * *`;
                                        // Записываем изменения в файл конфигурации
                                        fs.writeFileSync("../config.json", JSON.stringify(config), error => console.log(error));
                                        await bot.sendMessage(msg.chat.id, answers.getTemplateString(answers.events[7].answer, ['%time%'], [commandData[2]]));
                                    } else {
                                        await bot.sendMessage(msg.chat.id, answers.getTemplateString(answers.events[8].answer, ['%input%'], [commandData[2]]));
                                    }
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
                break;
            }
        }
    });
    // При получении уведомления о добавлении бота в чат
    bot.on('my_chat_member', async (msg) => {
        // Если ID нового участника равен 5382306522, он является полноправным участником чата и это групповой чат
        if (msg.new_chat_member.user.id === 5382306522 &&
            msg.new_chat_member.status === 'member' &&
            msg.chat.type === 'group') {
            // Если этот чат еще не в списке подписчиков
            if (!subscriber.isExists(msg.chat.id)) {
                // Добавить чат в список подписчиков
                await subscriber.add(msg.chat.id);
                // Отправить приветствие в чат
                await bot.sendMessage(msg.chat.id, answers.getTemplateString(answers.groupChatAdded, ['%chatName%'], [msg.chat.title]));
            }
        } else {
            // В противном случае, удалить чат из списка подписчиков
            subscriber.remove(msg.chat.id);
        }
    });

}

module.exports.run = run;
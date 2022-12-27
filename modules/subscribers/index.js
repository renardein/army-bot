const fs = require('fs');

//Проверка наличия chatId в subscribers.json
function isExists(chatId) {
    let json = JSON.parse(fs.readFileSync('./database/subscribers.json'));
    if (json.includes(chatId))
        return true
    else
        return false
}
//Добавление нового chatId в subscribers.json
function add(chatId) {
    let json = JSON.parse(fs.readFileSync('./database/subscribers.json'));
    json.push(chatId);
    fs.writeFileSync(dataPath, JSON.stringify(json));
    console.log('\x1b[33m', `[Subscriber] ${chatId} subscribed`)
}
//Удаление chatId в subscribers.json
function remove(chatId) {
    let json = JSON.parse(fs.readFileSync('./database/subscribers.json'));
    let filteredJson = json.filter(x => x !== chatId);
    fs.writeFileSync(dataPath, JSON.stringify(filteredJson));
    console.log('\x1b[36m', `[Subscriber] ${chatId} unsubscribed`)
}
//Подсчет количества подписчиков в subscribers.json
function count(chatId) {
    let json = JSON.parse(fs.readFileSync('./database/subscribers.json'));
    return json.length;
}



module.exports = { isExists, add, remove, count }
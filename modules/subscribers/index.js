const fs = require('fs'),
    dataPath = './database/subscribers.json';

//Проверка наличия chatId в subscribers.json
function isExists(chatId) {
    let json = JSON.parse(fs.readFileSync(dataPath));
    if (json.includes(chatId))
        return true
    else
        return false
}
//Добавление нового chatId в subscribers.json
function add(chatId) {
    let json = JSON.parse(fs.readFileSync(dataPath));
    json.push(chatId);
    fs.writeFileSync(dataPath, JSON.stringify(json));
    console.log('\x1b[33m', `[Subscriber] ${chatId} subscribed`)
}
//Удаление chatId в subscribers.json
function remove(chatId) {
    let json = JSON.parse(fs.readFileSync(dataPath));
    let filteredJson = json.filter(x => x !== chatId);
    fs.writeFileSync(dataPath, JSON.stringify(filteredJson));
    console.log('\x1b[36m', `[Subscriber] ${chatId} unsubscribed`)
}
//Подсчет количества подписчиков в subscribers.json
function count(chatId) {
    let json = JSON.parse(fs.readFileSync(dataPath));
    return json.length;
}



module.exports = { isExists, add, remove, count }
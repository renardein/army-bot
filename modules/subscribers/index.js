const filesystem = require('../filesystem'),
    dataPath = './database/subscribers.json';

//Проверка наличия chatId в subscribers.json
function isExists(chatId) {
    let json = filesystem.readJsonFile(dataPath)
    if (json.includes(chatId))
        return true
    else
        return false
}
//Добавление нового chatId в subscribers.json
function add(chatId) {
    let json = filesystem.readJsonFile(dataPath);
    json.push(chatId);
    filesystem.writeJsonFile(dataPath, json);
    console.log('\x1b[33m', `[Subscriber] ${chatId} subscribed`)
}
//Удаление chatId в subscribers.json
function remove(chatId) {
    let json = filesystem.readJsonFile(dataPath)
    let filteredJson = json.filter(x => x !== chatId);
    filesystem.writeJsonFile(dataPath, filteredJson);
    console.log('\x1b[36m', `[Subscriber] ${chatId} unsubscribed`)
}
//Подсчет количества подписчиков в subscribers.json
function count(chatId) {
    let json = filesystem.readJsonFile(dataPath)
    return json.length;
}



module.exports = { isExists, add, remove, count }
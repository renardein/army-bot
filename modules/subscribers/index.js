var filesystem = require('../filesystem'),
    dataPath = './database/subscribers.json';

//Проверка наличия chatId в subscribers.json
function isExists(chatId) {
    var json = filesystem.readJsonFile(dataPath)
    if (json.includes(chatId))
        return true
    else
        return false
}
//Добавление нового chatId в subscribers.json
function add(chatId) {
    var json = filesystem.readJsonFile(dataPath);
    json.push(chatId);
    filesystem.writeJsonFile(dataPath, json);
}
//Удаление chatId в subscribers.json
function remove(chatId) {
    var json = filesystem.readJsonFile(dataPath)
    var filteredJson = json.filter(x => x !== chatId);
    filesystem.writeJsonFile(dataPath, filteredJson);
}
//Подсчет количества подписчиков в subscribers.json
function count(chatId) {
    var json = filesystem.readJsonFile(dataPath)
    return json.length;
}



module.exports = { isExists, add, remove, count }
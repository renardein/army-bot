var filesystem = require('../filesystem')

function isExists(chatId) {
    var json = filesystem.readJsonFile('./database/subscribers.json')
    if (json.includes(chatId))
        return true
    else
        return false
}
function add(chatId) {
    var json = filesystem.readJsonFile('./database/subscribers.json');
    json.push(chatId);
    filesystem.writeJsonFile('./database/subscribers.json',json);
}
function remove(chatId) {
    var json = filesystem.readJsonFile('./database/subscribers.json')
    var filteredJson = json.filter(x => x !== chatId);
    filesystem.writeJsonFile('./database/subscribers.json', filteredJson);
}
function count(chatId) {
    var json = filesystem.readJsonFile()
    return json.length;
}



module.exports.isExists = isExists;
module.exports.add = add;
module.exports.remove = remove;
module.exports.count = count;
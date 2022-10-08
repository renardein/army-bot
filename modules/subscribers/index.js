var filesystem = require('../filesystem'),
dataPath= './database/subscribers.json';

function isExists(chatId) {
    var json = filesystem.readJsonFile(dataPath)
    if (json.includes(chatId))
        return true
    else
        return false
}
function add(chatId) {
    var json = filesystem.readJsonFile(dataPath);
    json.push(chatId);
    filesystem.writeJsonFile(dataPath,json);
}
function remove(chatId) {
    var json = filesystem.readJsonFile(dataPath)
    var filteredJson = json.filter(x => x !== chatId);
    filesystem.writeJsonFile(dataPath, filteredJson);
}
function count(chatId) {
    var json = filesystem.readJsonFile(dataPath)
    return json.length;
}



module.exports.isExists = isExists;
module.exports.add = add;
module.exports.remove = remove;
module.exports.count = count;
var filesystem = require('./filesystem')

function isExists(chatId) {
    var json = filesystem.readSubscribersFile()
    if (json.includes(chatId))
        return true
    else
        return false
}
function add(chatId) {
    var json = filesystem.readSubscribersFile();
    json.push(chatId);
    filesystem.writeSubscribersFile(json);
}
function remove(chatId) {
    var json = filesystem.readSubscribersFile()
    var filteredJson = json.filter(x => x !== chatId);
    filesystem.writeSubscribersFile(filteredJson);
}
function count(chatId) {
    var json = filesystem.readSubscribersFile()
    return json.length;
}



module.exports.isExists = isExists;
module.exports.add = add;
module.exports.remove = remove;
module.exports.count = count;
var filesystem = require('./filesystem')

function isExists(userId) {
    var json = filesystem.readSubscribersFile()
    var filteredJson = json.filter(x => x !== userId);
    if (filteredJson.length !== 0)
        return true
    else
        return false
}
function add(userId) {
    var json = filesystem.readSubscribersFile();
    json.push(userId);
    filesystem.writeSubscribersFile(json);
}
function remove(userId) {
    var json = filesystem.readSubscribersFile()
    var filteredJson = json.filter(x => x !== userId);
    filesystem.writeSubscribersFile(filteredJson);
}

module.exports.isExists = isExists;
module.exports.add = add;
module.exports.remove = remove;

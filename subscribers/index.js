var filesystem = require('./filesystem')

function isSubscriberExists(userId) {

}
function addSubscriber(userId) {

    let getSubList = filesystem.readSubscribersFile();
    getSubList.subscribers.push(userId)
    filesystem.writeSubscribersFile(getSubList)
}
function deleteSubscriber(userId) {


}

module.exports.isSubscriberExists = isSubscriberExists;
module.exports.addSubscriber = addSubscriber;
module.exports.deleteSubscriber = deleteSubscriber;

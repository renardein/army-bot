const { db } = require('../dbAdapter');

// Создаем таблицу subscribers, если она не существует
db.run(`CREATE TABLE IF NOT EXISTS subscribers (
    chat_id INTEGER PRIMARY KEY
  )`, (err) => {
    if (err) {
        console.error(err.message);
    }
});

//Основые операции с таблицей subscribers
async function isExists(chatId) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT chat_id FROM subscribers WHERE chat_id = ?`, [chatId], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row !== undefined);
        });
    });
}
async function add(chatId) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO subscribers (chat_id) VALUES (?)`, [chatId], function (err) {
            if (err) {
                reject(err);
            }
            console.log(`[Subscriber] ${chatId} subscribed`);
            resolve();
        });
    });
}
async function remove(chatId) {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM subscribers WHERE chat_id = ?`, [chatId], function (err) {
            if (err) {
                reject(err);
            }
            console.log(`[Subscriber] ${chatId} unsubscribed`);
            resolve();
        });
    });
}
async function count() {
    return new Promise((resolve, reject) => {
        db.get(`SELECT COUNT(*) as count FROM subscribers`, (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row.count);
        });
    });
}

async function getAll() {
    return new Promise((resolve, reject) => {
        db.all('SELECT chat_id FROM subscribers', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const chatIds = rows.map(row => row.chat_id);
                resolve(chatIds);
            }
        });
    });
}

module.exports = { add, remove, count, isExists, getAll }
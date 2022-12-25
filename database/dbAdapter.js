const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const dbFile = './database/database.db';

// Проверяем, существует ли файл базы данных
if (!fs.existsSync(dbFile)) {
    // Создаем файл базы данных
    fs.closeSync(fs.openSync(dbFile, 'w'));
}
const db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('\x1b[34m', '[Database] Connected to the database');
});



module.exports = { db }
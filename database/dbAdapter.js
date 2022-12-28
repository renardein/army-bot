const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const dbFile = './database/database.db';

// Проверяем, существует ли файл базы данных
if (!fs.existsSync(dbFile)) {
    try {
        fs.closeSync(fs.openSync(dbFile, 'w'));
    }
    catch (err) {
        console.error('\x1b[34m', `[Database] ${err.message}`);
    }

}
const db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('\x1b[34m', `[Database] ${err.message}`);
        process.exit(0)
    }
    console.log('\x1b[34m', '[Database] Connected to the database');
});



module.exports = { db }
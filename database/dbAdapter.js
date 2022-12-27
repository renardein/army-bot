const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();


// Проверяем, существует ли файл базы данных
if (!fs.existsSync(dbFile)) {
    // Создаем файл базы данных
    fs.closeSync(fs.openSync('./database/database.db', 'w'));
}
const db = new sqlite3.Database('./database/database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('\x1b[34m', `[Database] ${err.message}`);
        process.exit(0)
    }
    console.log('\x1b[34m', '[Database] Connected to the database');
});



module.exports = { db }
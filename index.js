var mysql = require('mysql2');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'zero',
    password: '123698745za',
    database: 'todo_list',
});

connection.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL.');
});
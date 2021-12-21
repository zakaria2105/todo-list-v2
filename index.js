var mysql = require('mysql2');
const http = require('http')
const url = require('url')
const port = 8000;

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

let server = http.createServer((req, res) => {
    console.log('server started');
    let request = req.url.split("/")
    switch (req.method) {
        case 'GET':
            if (req.url === '/' || req.url === '/projects') {
                query = `SELECT * FROM project`
                connection.query(query, (err, rows) => {
                    if (err) throw err;
                    res.end(JSON.stringify(rows))
                });
            } else if (req.url === '/tasks') {
                query = `SELECT * FROM tasks`
                connection.query(query, (err, rows) => {
                    if (err) throw err;
                    res.end(JSON.stringify(rows))
                });
            } else {
                let todo = url.parse(req.url, true).query;
                let id = todo.id
                if (request[1] == 'project' && id) {
                    query = `SELECT * FROM project WHERE id = '${id}'`
                    connection.query(query, (err, rows) => {
                        if (err) throw err;
                        res.end(JSON.stringify(rows))
                    });
                } else if (request[1] == 'task' && id) {
                    query = `SELECT * FROM tasks WHERE id = '${id}'`
                    connection.query(query, (err, rows) => {
                        if (err) throw err;
                        res.end(JSON.stringify(rows))
                    });
                } else {
                    res.end('route does not exist')
                }
            }
            break;
        case 'POST':
            if (req.url === '/project' || req.url === '/task') {
                let body = "";
                req.on("data", (chunk) => {
                    body += chunk;
                });
                req.on("end", () => {
                    res.writeHead(200, { "content-type": "application/json" })
                    let project = JSON.parse(body)
                    query = `INSERT INTO project SET ?`
                    connection.query(query, project, (err, res) => {
                        if (err) throw err;
                        res.end('row inserted')
                    })
                });
            }
            break;
        case 'PUT':

            break;
        case 'DELETE':

            break;

        default:
            break;
    }
})

server.listen(port);
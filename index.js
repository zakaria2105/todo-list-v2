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
    let todo = url.parse(req.url, true).query;
    let id = todo.id
    switch (req.method) {
        case 'GET':
            if (req.url === '/' || req.url === '/projects') {
                query = `SELECT * FROM projects`
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
                if (request[1] == 'project' && id) {
                    query = `SELECT * FROM projects WHERE id = '${id}'`
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
            if ((request[1] == 'projects' || request[1] == 'tasks') && !request[2]) {
                let body = "";
                req.on("data", (chunk) => {
                    body += chunk;
                });
                req.on("end", () => {
                    res.writeHead(200, { "content-type": "application/json" })
                    let project = JSON.parse(body)
                    let table = request[1]
                    query = `INSERT INTO ${table} SET ?`
                    connection.query(query, project, (err) => {
                        if (err) throw err;
                        res.end('row inserted')
                    })
                });
            } else {
                res.end('route does not exist')
            }
            break;
        case 'PUT':
            break;
        case 'DELETE':
            if ((request[1] == 'projects' || request[1] == 'tasks') && !request[2]) {
                let table = request[1]
                query = `DELETE FROM ${table}`
                connection.query(query, (err) => {
                    if (err) throw err;
                    res.end('All rows deleted')
                })
            }else if ((request[1] == 'project' || request[1] == 'task') && id) {
                let table = request[1]
                query = `DELETE FROM ${table}s WHERE id = ${id}`
                connection.query(query, (err) => {
                    if (err) throw err;
                    res.end('row deleted')
                })
            }
             else {
                res.end('route does not exist')
            }
            break;

        default:
            break;
    }
})

server.listen(port);
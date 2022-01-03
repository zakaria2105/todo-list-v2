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
    let id = parseInt(todo.id)
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
                if (request[1] == 'project' && Number.isInteger(id)) {
                    query = `SELECT * FROM projects WHERE id = '${id}'`
                    connection.query(query, (err, rows) => {
                        if (err) throw err;
                        res.end(JSON.stringify(rows))
                    });
                } else if (request[1] == 'task' && Number.isInteger(id)) {
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
            if (request[1] === 'task' && Number.isInteger(id)) {
                let body = "";
                req.on("data", (chunk) => {
                    body += chunk;
                });
                req.on("end", () => {
                    let project = JSON.parse(body)
                    query = "UPDATE tasks SET ? WHERE id = ?"
                    connection.query(query, [project, id], (err) => {
                        if (err) throw err;
                        res.end('row updated')
                    })
                });
            } else if (request[1] === 'project' && Number.isInteger(id)) {
                let body = "";
                req.on("data", (chunk) => {
                    body += chunk;
                });
                req.on("end", () => {
                    let project = JSON.parse(body)
                    query = "UPDATE projects SET ? WHERE id = ?"
                    connection.query(query, [project, id], (err) => {
                        if (err) throw err;
                        res.end('row updated')
                    })
                });
            } else {
                res.end('route does not exist')
            }
            break;
        case 'DELETE':
            if ((request[1] == 'projects' || request[1] == 'tasks') && !request[2]) {
                let table = request[1]
                query = `DELETE FROM ${table}`
                connection.query(query, (err) => {
                    if (err) throw err;
                    res.end('All rows deleted')
                })
            } else if ((request[1] == 'project' || request[1] == 'task') && Number.isInteger(id)) {
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
            res.end('route not found')
            break;
    }
})

server.listen(port);
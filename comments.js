// Create a webserver
// Use the webserver to display the comments from the comments.json file
// Use the webserver to add a new comment to the comments.json file

const http = require('http');
const fs = require('fs');
const url = require('url');

http.createServer((req, res) => {
    const q = url.parse(req.url, true);
    const filename = q.pathname.slice(1);
    const method = req.method;

    if (filename === 'comments' && method === 'GET') {
        fs.readFile('comments.json', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                return res.end('404 Not Found');
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(data);
            return res.end();
        });
    } else if (filename === 'comments' && method === 'POST') {
        let body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', () => {
            const newComment = JSON.parse(body);
            fs.readFile('comments.json', (err, data) => {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    return res.end('404 Not Found');
                }
                const comments = JSON.parse(data);
                comments.push(newComment);
                fs.writeFile('comments.json', JSON.stringify(comments), (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/html' });
                        return res.end('500 Internal Server Error');
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.write(JSON.stringify(newComment));
                    return res.end();
                });
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('404 Not Found');
    }
}).listen(8080, () => {
    console.log('Server running at http://localhost:8080/');
});
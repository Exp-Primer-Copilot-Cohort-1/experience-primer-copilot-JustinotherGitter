// Create a webserver
// Create a form
// Create a submit button
// Create a textarea
// Create a list of comments
// Create a comment input
// Create a comment submit button
// Create a comment list
// Add a comment to the list
// Add a comment to the list of comments
// Add a comment to the list of comments

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const comments = [];

http.createServer((req, res) => {
  const uri = url.parse(req.url).pathname;
  const filename = path.join(process.cwd(), uri);

  if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      comments.push(body);
      res.writeHead(302, { 'Location': '/' });
      res.end();
    });
  } else {
    if (uri === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('<form method="post" action="/"><textarea name="comment"></textarea><button type="submit">Submit</button></form>');
      res.write('<ul>');
      for (let comment of comments) {
        res.write(`<li>${comment}</li>`);
      }
      res.write('</ul>');
      res.end();
    } else {
      fs.exists(filename, (exists) => {
        if (!exists) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.write('404 Not Found\n');
          res.end();
          return;
        }

        if (fs.statSync(filename).isDirectory()) {
          filename += '/index.html';
        }

        fs.readFile(filename, 'binary', (err, file) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.write(err + '\n');
            res.end();
            return;
          }

          res.writeHead(200);
          res.write(file, 'binary');
          res.end();
        });
      });
    }
  }
}).listen(1337, '');

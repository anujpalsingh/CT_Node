const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    const { method, url, headers } = req;
    let filePath = path.join(__dirname, url);

    switch (method) {
        case 'GET':
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.end('File not found');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(data);
                }
            });
            break;
            case 'POST':
            let body = [];
            req.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                body = Buffer.concat(body).toString();
                fs.writeFile(filePath, body, (err) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Internal Server Error');
                    } else {
                        res.writeHead(200);
                        res.end('File created successfully');
                    }
                });
            });
            break;
            case 'DELETE':
            fs.unlink(filePath, (err) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200);
                    res.end('File deleted successfully');
                }
            });
            break;
        default:
            res.writeHead(405);
            res.end('Method not allowed');
    }
});
const PORT = process.env.PORT || 6200;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
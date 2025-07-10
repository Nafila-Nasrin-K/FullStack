const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
    console.log("Request URL:", req.url);

   
    if (req.method === 'GET') {
        if (req.url === '/' || req.url === '/index.html') {
            fs.readFile('index.html', (err, data) => {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            });
        } else if (req.url === '/style.css') {
            fs.readFile('style.css', (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.end('CSS file not found');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/css' });
                    res.end(data);
                }
            });
        } else {
            res.writeHead(404);
            res.end('Page not found');
        }
    }

    
    else if (req.method === 'POST' && req.url === '/calculate') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const form = querystring.parse(body);
            const { name, roll, m1, c1, m2, c2, m3, c3 } = form;

            const totalMarks = (m1 * c1) + (m2 * c2) + (m3 * c3);
            const totalCredits = Number(c1) + Number(c2) + Number(c3);
            const cgpa = (totalMarks / (totalCredits * 10)).toFixed(2);

            const result = `
                <html>
                    <head>
                        <title>CGPA Result</title>
                        <link rel="stylesheet" href="style.css">
                    </head>
                    <body class="container">
                        <h2>Student CGPA Result</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Roll No:</strong> ${roll}</p>
                        <p><strong>CGPA (out of 10):</strong> ${cgpa}</p>
                        <a href="/" class="back-button">Back</a>
                    </body>
                </html>
            `;

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(result);
        });
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});

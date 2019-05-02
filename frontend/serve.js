// Dependencies
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const dotenv = require('dotenv').config();

const app = express();

// Certificate
const privateKey = fs.readFileSync(process.env.SSL_PRIVATE_KEY, 'utf8');
const certificate = fs.readFileSync(process.env.SSL_CERTIFICATE, 'utf8');
const ca = fs.readFileSync(process.env.SSL_CA, 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};

app.use(express.static('dist/pwa'));

app.use(function (req, res) {
  res.sendFile('dist/pwa/index.html', { root: __dirname });
});

// Starting both http & https servers
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(443, () => {
  console.log('HTTPS Server running on port 443');
});

// REDIRECT SERVER

let redirectApp = express();

redirectApp.use(function (req, res) {
  var fullUrl = 'https://' + req.get('host') + req.originalUrl;
  res.redirect(fullUrl);
});

const httpServer = http.createServer(redirectApp);

httpServer.listen(80, () => {
  console.log('HTTP Server running on port 80');
});

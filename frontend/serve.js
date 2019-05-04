// Dependencies
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
require('dotenv').config();

const app = express();

const devMode = process.argv[2] === 'dev';

// SSL test

const useSSL = !devMode;
let credentials = {};
let truePort = 80;

if (useSSL) {
  // Certificate
  const privateKey = fs.readFileSync(process.env.SSL_PRIVATE_KEY, 'utf8');
  const certificate = fs.readFileSync(process.env.SSL_CERTIFICATE, 'utf8');
  const ca = fs.readFileSync(process.env.SSL_CA, 'utf8');

  credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };

  truePort = 443;
  // REDIRECT SERVER : CREATES A FAKE PORT 80 SERVER TO REDIRECT TO HTTPS

  let redirectApp = express();

  redirectApp.use(function (req, res) {
    var fullUrl = 'https://' + req.get('host') + req.originalUrl;
    res.redirect(fullUrl);
  });

  const redirectServer = http.createServer(redirectApp);

  redirectServer.listen(80, () => {
    console.log(`Redirect HTTP Server running on port 80`);
  });
}

app.use(express.static('dist/pwa'));

app.use(function (req, res) {
  res.sendFile('dist/pwa/index.html', { root: __dirname });
});

// Starting true server
const trueServer = useSSL ? https.createServer(credentials, app) : http.createServer(app);

trueServer.listen(truePort, () => {
  console.log(`App Server running on port ${truePort}`);
});

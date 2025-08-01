const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const path = require("path");
const cookieParser = require('cookie-parser');
var session = require('express-session')
const { serialize } = require("cookie");
const { initSocket } = require('./app/config/websocket'); // Import the socket service
const http = require('http');
require('./app/config/database');
const app_route = require('./app/routes/index');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(cookieParser());

app.use(session({
  secret: '34SDgsdgspxxxxxxxdfsG', // just a long random string
  resave: false,
  saveUninitialized: true
}));


app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true
}));

app.use("/media", express.static(path.join(__dirname, "uploads")));

app.use(cors({
    origin: ['http://localhost:3003','http://localhost:3001','http://localhost:3002','https://vakeel-db.surge.sh'],
    credentials: true
}));

const port=process.env.PORT||8043

app.post('/api/generateSession', (req, res) => {
  if (req.cookies && req.cookies.secsession && req.cookies.secsession != "none") {
    return res.json({ message: "Session ID" });
  }
  let secretSession = req.sessionID
  let secretSession2 = req.session.id
  // res.cookie('secsession', secretSession ?? secretSession2, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: 'Strict',
  //   path: '/',
  //   //domain: '.printmeup.ai' 
  // });

  const cookieOptions = {
    httpOnly: true,
    maxAge: 86400 * 1000,
    sameSite: 'none',
    secure: true,
    path: '/'
  };

  const serializedCookie = serialize('secsession', req.session.id, cookieOptions);
  res.setHeader('Set-Cookie', serializedCookie);

  return res.json({ message: "Session ID Set" });
});

app.get("/", (req, res) => {
    res.json({ message: "Codename: Project Excellency" });
  });

app.get("/api/checkUpdates", (req, res) => {
  res.json({ message: "Critical Update", status: false });
});
initSocket(server);

app.use("/api",app_route)
server.listen(port, () => {
    console.log(`server is running on ${port}`)
})
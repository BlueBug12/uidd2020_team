const express = require('express');
const bodyParser = require('body-parser');
var https = require('https');
var key = './ssl/private.key';
var crt = './ssl/certificate.crt';
const fs = require("fs");
const SERVER_CONFIG = {
  key:  fs.readFileSync(key),
  cert: fs.readFileSync(crt)
};
const app = express();
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(express.static('../client/public'));
const taskRoute= require('./routes/Tasks');
const userRoute = require('./routes/Users');
app.use('/tasks',taskRoute);
app.use('/users',userRoute);


const port = 4444;
https.createServer(SERVER_CONFIG, app)
     .listen(port,function() { console.log("HTTPS sever started"); }
);

//Connect to Database
const config = require('./config')
const mongoose = require('mongoose')

const url = `mongodb://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.host}/${config.mongodb.database}`

const conn = mongoose.connect(url,{ useNewUrlParser: true ,useUnifiedTopology: true}, (err, res) => {
    console.log('Connect to DB')
  if (err) console.log('fail to connect:', err)
});
mongoose.Promise = global.Promise
require('./models/Floorplans');
require('./routes/Floorplan')(app);


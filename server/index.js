const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('../client/public'));
require('./routes/authRoutes')(app);

const taskRoute= require('./routes/Tasks');
app.use(express.static('../project'));
app.use('/tasks',taskRoute);

const port = 9898;
app.listen(port, () => {
    console.log("server listening on: " + port);
});



//Connect to Database
const config = require('./config')
const mongoose = require('mongoose')

const url = `mongodb://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.host}/${config.mongodb.database}`

const conn = mongoose.connect(url,{ useNewUrlParser: true ,useUnifiedTopology: true}, (err, res) => {
    console.log('Connect to DB')
  if (err) console.log('fail to connect:', err)
});
mongoose.Promise = global.Promise

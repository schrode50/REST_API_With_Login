'use strict';

const app = require('express')();
const mongoose = require('mongoose');
const auth = require('./routes/auth_routes');
const bodyParser = require('body-parser').json();
const jwAuth = require(__dirname + '/lib/jwt_auth');
const morgan = require('morgan');

const dbPort = process.env.MONGODB_URI || 'mongodb://localhost/dev_db';
console.log('dbPort', dbPort);

mongoose.connect(dbPort);

app.use(morgan('dev'));

app.use('/', auth);

app.get('/test', (req, res) => {
  res.send('don\'t need a token');
});

app.post('/test', bodyParser, jwAuth, (req, res) => {
  res.send({ message: 'need a token' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
  next(err);
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Not Found'});
});

app.listen(3000, () => console.log('listening on 3000'));

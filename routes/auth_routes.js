'use strict';

const express = require('express');
const bodyParser = require('body-parser').json();
const User = require(__dirname + '/../model/user');
const basicHTTP = require(__dirname + '/../lib/basic_http');

const router = module.exports = exports = express.Router();

router.post('/signup', bodyParser, (req, res, next) => {
  console.log(req.body, 'little string');
  let newUser = new User(req.body);
  let hashedPassword = newUser.hashPassword();
  newUser.password = hashedPassword;
  req.body.password = null;
  User.findOne({ username: req.body.username }, (err, user) => {
    if(err || user) return next(new Error('CANNOT CREATE USER'));
    newUser.save((err) => {
      if(err) return next(new Error('Cannot Create User'));
      res.json({ token: 'you made it in' });
    });
  });
});

router.get('/signin', basicHTTP, (req, res, next) => {
  console.log(res.body, 'big string');
  User.findOne({ username: req.auth.username }, (err, user) => {
    if(!user || err) return next(new Error('CANNOT SIGN IN'));
    if(!user.comparePassword(req.auth.password)) return next(new Error('CANNOT SIGN IN'));

    res.json({ token: 'you made it in' });
  });
});

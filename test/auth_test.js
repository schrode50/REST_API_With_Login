'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const expect = chai.expect;
const request = require('chai').request;

const mongoose = require('mongoose');
// const basicHTTP = require(__dirname + '/../lib/basic_http');

const dbPort = process.env.MONGOLAB_URI;

process.env.MONGOLAB_URI = 'mongodb://localhost/test_db';
require('../server');

describe('authorization tests', () => {
  after((done) => {
    process.env.MONGOLAB_URI = dbPort;
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });
  it('should sign up a new user', (done) => {
    request('localhost:3000')
    .post('/signup')
    .send({ username: 'larry', password: 'flint' })
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body).to.eql({ token: 'you made it in' });
      // // expect(res.body.username).to.eql('larry');
      // expect(res.body.password).to.eql('flint');
      done();
    });
  });

  it('should sign in user', (done) => {
    request('localhost:3000')
    .get('/signin')
    .auth('larry', 'flint')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body).to.eql({ token: 'you made it in' });
      done();
    });
  });
});

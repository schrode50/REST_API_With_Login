'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const request = chai.request;

const mongoose = require('mongoose');
const basicHTTP = require(__dirname + '/../lib/basic_http');
const jwt = require(__dirname + '/../lib/jwt_auth');

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
      expect(res.body.username).to.eql('larry');
      expect(res.body.password).to.eql('flint');
      done();
    });
  });

  it('should sign in user', (done) => {
    request('localhost:3000')
    .get('/signin')
    .auth('test', 'test')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(Array.isArray(res.body)).to.eql(true);
      expect(res.body.length).to.eql(0);
      done();
    });
  });
});

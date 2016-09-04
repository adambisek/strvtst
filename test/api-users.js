import request from 'supertest'
import should from 'should'  // should is nowhere used, it will produce standardjs warning
import { port } from '../config'

describe('Api', () => {
  var url = `http://localhost:${port}`
  before(() => {
    require('../server')
  })

  describe('#/api/v1/users - create with duplicate email', function () { // function, because arrow function does not preserve context
    this.timeout(5000)
    it('should get correct response', (done) => {
      var credentials = {
        email: 'bobtony@firebase.com',
        password: 'correcthorsebatterystaple'
      }
      request(url).post('/api/v1/users').send(credentials).end((err, res) => {
        if (err) throw err
        res.status.should.equal(409)
        res.headers['content-type'].should.equal('application/json charset=utf-8')
        res.body.status.should.equal(false)
        res.body.err.should.equal('User already exists.')
        done()
      })
    })
  })

  const successfulCredentials = {
    email: `test-new${new Date().getTime()}@firebase.com`, // simplest pseudorandom email address
    password: 'myPassword'
  }

  describe('#/api/v1/users - create successfully', function () {
    this.timeout(5000)
    it('should get correct response', (done) => {
      request(url).post('/api/v1/users').send(successfulCredentials).end((err, res) => {
        if (err) throw err
        res.status.should.equal(200)
        res.headers['content-type'].should.equal('application/json charset=utf-8')
        res.body.status.should.equal(true)
        done()
      })
    })
  })

  describe('#/api/v1/users/login - login successfully', function () {
    this.timeout(5000)
    it('should get correct response', (done) => {
      request(url).post('/api/v1/users/login').send(successfulCredentials).end((err, res) => {
        if (err) throw err
        res.status.should.equal(200)
        res.headers['content-type'].should.equal('application/json charset=utf-8')
        res.body.status.should.equal(true)
        res.body.token.should.be.a.String()
        done()
      })
    })
  })

  describe('#/api/v1/users/login - login with wrong password', function () {
    this.timeout(5000)
    const unsuccessfulCredentials = {
      ...successfulCredentials,
      password: 'wrongPassword13456789'
    }
    it('should get correct response', (done) => {
      request(url).post('/api/v1/users/login').send(unsuccessfulCredentials).end((err, res) => {
        if (err) throw err
        res.status.should.equal(401)
        res.headers['content-type'].should.equal('application/json charset=utf-8')
        res.body.status.should.equal(false)
        res.body.err.should.equal('Password not valid.')
        done()
      })
    })
  })

  describe('#/api/v1/users/login - login with wrong username', function () {
    const unsuccessfulCredentials = {
      ...successfulCredentials,
      email: 'wrongEmail13456789'
    }
    this.timeout(5000)
    it('should get correct response', (done) => {
      request(url).post('/api/v1/users/login').send(unsuccessfulCredentials).end((err, res) => {
        if (err) throw err
        res.status.should.equal(404)
        res.headers['content-type'].should.equal('application/json charset=utf-8')
        res.body.err.should.equal('User not found.')
        done()
      })
    })
  })
})

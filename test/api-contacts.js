import request from 'supertest'
import should from 'should' // should is nowhere used, it will produce standardjs warning
import { port } from '../config'

describe('Api', () => {
  var url = `http://localhost:${port}`
  before(() => {
    require('../server')
  })

  let token = null
  describe('#get token - login successfully', function () { // function, because arrow function does not preserve context
    this.timeout(5000)
    it('should get correct response', (done) => {
      var credentials = {
        email: 'bobtony@firebase.com',
        password: 'correcthorsebatterystaple'
      }
      request(url).post('/api/v1/users/login').send(credentials).end((err, res) => {
        if (err) throw err
        token = res.body.token
        done()
      })
    })
  })

  describe('#/api/v1/contacts - create successfully', function () {
    this.timeout(5000)
    it('should get correct response', (done) => {
      var payload = {
        token,
        contact: {
          email: 'john.doe.test@example.com',
          fullname: 'John Doe Test',
          location: {
            city: 'San Francisco',
            state: 'California',
            zip: 94103
          }
        }
      }
      request(url).post('/api/v1/contacts').send(payload).end((err, res) => {
        if (err) throw err
        res.status.should.equal(200)
        res.headers['content-type'].should.equal('application/json; charset=utf-8')
        res.body.status.should.equal(true)
        done()
      })
    })
  })

  describe('#/api/v1/contacts - bad contact payload', function () {
    this.timeout(5000)
    it('should get correct response', (done) => {
      var payload = {
        token
      }
      request(url).post('/api/v1/contacts').send(payload).end((err, res) => {
        if (err) throw err
        res.status.should.equal(400)
        res.headers['content-type'].should.equal('application/json; charset=utf-8')
        res.body.status.should.equal(false)
        done()
      })
    })
  })

  describe('#/api/v1/contacts - bad token', function () {
    this.timeout(5000)
    it('should get correct response', (done) => {
      var payload = {
        token: 'abcdef',
        contact: {
          foo: 'bar'
        }
      }
      request(url).post('/api/v1/contacts').send(payload).end((err, res) => {
        if (err) throw err
        res.status.should.equal(401)
        res.headers['content-type'].should.equal('application/json; charset=utf-8')
        res.body.status.should.equal(false)
        res.body.err.should.equal('Token not valid.')
        done()
      })
    })
  })
})

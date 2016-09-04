import * as firebase from 'firebase'
import bcrypt from 'bcryptjs'
import emailValidator from 'email-validator'
import jwt from 'jsonwebtoken'
import { api } from '../config'

const API_SECRET = api.secret

// Note: I would extremely like to use directly firebase users
// but firebase maintains only one authentication state

const createHash = ({email, password}) => { // bcrypt is slow, better will async in future (now may block thread for a while)
  return bcrypt.hashSync(email + password, bcrypt.genSaltSync(10))
}

const validatePasswordAndHash = ({email, password}, hash) => {
  return bcrypt.compareSync(email + password, hash)
}

const loadUser = (email, next) => {
  firebase.database().ref('users')
    .orderByChild('email')
    .equalTo(email)
    .once('value', function (snap) {
      if (!snap.exists()) {
        return next(null)
      }
      const users = snap.val()
      for (let uid in users) {
        return next({
          ...users[uid],
          uid
        })
      }
    })
}

/*
 * Example payload:
 * {
 * email: 'bobtony@firebase.com',
 * password: 'correcthorsebatterystaple'
 * }
 */
export const create = (req, res) => {
  const data = req.body
  res.setHeader('Content-Type', 'application/json')
  if (!emailValidator.validate(data.email)) { // Note: we dont validate, if user has truly access to given email address
    res.status(400)
    return res.send(JSON.stringify({ status: false, err: 'Provided e-mail address is not valid.' }))
  }
  loadUser(data.email, function (user) {
    if (user) {
      res.status(409)
      return res.send(JSON.stringify({ status: false, err: 'User already exists.' }))
    }
    // insert user
    const insert = {
      email: data.email,
      password: createHash(data)
    }
    firebase.database().ref().child('users').push(insert, (err) => {
      if (err) {
        res.status(500)
        return res.send(JSON.stringify({status: false, err}))
      }
      res.send(JSON.stringify({ status: true }))
    })
  })
}

/*
 * Example payload:
 * {
 * email: 'bobtony@firebase.com',
 * password: 'correcthorsebatterystaple'
 * }
 */
export const login = (req, res) => {
  const data = req.body
  res.setHeader('Content-Type', 'application/json')
  // there should be some limit for IP address, to eliminate brute-force attack
  loadUser(data.email, function (user) {
    if (!user) {
      res.status(404)
      return res.send(JSON.stringify({ status: false, err: 'User not found.' }))
    }
    if (!validatePasswordAndHash(data, user.password)) {
      res.status(401)
      return res.send(JSON.stringify({ status: false, err: 'Password not valid.' }))
    }
    const token = jwt.sign({
      uid: user.uid,
      exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour expiration
    }, API_SECRET)
    res.send(JSON.stringify({status: true, token}))
  })
}

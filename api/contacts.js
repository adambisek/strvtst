import * as firebase from 'firebase'
import jwt from 'jsonwebtoken'
import { api } from '../config'

const API_SECRET = api.secret

// firebase maintains only one authentication state
// so I cant use for each request different user

// There is no validation of contact payload in firebase at this time

/*
 * Example payload:
 * {
 *  email: 'john.doe@example.com',
 *  fullname: 'John Doe',
 *  location: {
 *     city: 'San Francisco',
 *    state: 'California',
 *    zip: 94103
 *  }
 * }
 */
export const create = (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  try {
    var payload = jwt.verify(req.body.token, API_SECRET)
  } catch (err) {
    res.status(401)
    return res.send(JSON.stringify({ status: false, err: 'Token not valid.' }))
  }
  const { uid } = payload
  if (!req.body.contact) {
    res.status(400)
    return res.send(JSON.stringify({ status: false, err: 'Contact data not provided.' }))
  }
  const data = req.body.contact

  // I know, there may be a problem, with inserting duplicated data
  // unfortunatelly, I didn't find any sufficient firebase rule,
  // even after an hour of "googling": https://www.google.cz/?q=firebase+unique+field
  // this problematic is an adept for serious discussion
  firebase.database().ref().child('contacts').child(uid).push(data, (err) => {
    if (err) {
      res.status(500)
      return res.send(JSON.stringify({status: false, err}))
    }
    res.send(JSON.stringify({ status: true }))
  })
}

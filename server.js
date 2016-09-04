import express from 'express'
import bodyParser from 'body-parser'
import firebase from 'firebase'
import { create as createContact } from './api/contacts'
import { create as createUser, login } from './api/users'
import { firebase as firebaseConfig, port as portConfig } from './config'

firebase.initializeApp({
  databaseURL: 'https://strvtst.firebaseio.com',
  serviceAccount: firebaseConfig
})

// Start the API on express
const app = express()
app.use(bodyParser.json()) // support json encoded bodies

app.get('/', (req, res) => res.send('Hello world'))
app.post('/api/v1/contacts', createContact)
app.post('/api/v1/users', createUser)
app.post('/api/v1/users/login', login) // login is not entity creation, but i mean POST is the right one HTTP method
const port = process.env.PORT || portConfig // heroku dynamically assigns a port, defined in env
app.listen(port)
console.log(`Server running on http://localhost:${port}`)

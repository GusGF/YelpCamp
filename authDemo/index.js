const express = require('express')
const app = express()
const User = require('./models/user')

app.set('view engine', 'ejs')
app.set('views', './views')

app.get('/secret', (req, res) => {
  res.send('This is secret')
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.listen(3001, () => {
  console.log('Serving your app 3001')
})
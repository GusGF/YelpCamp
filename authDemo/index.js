const express = require('express')
const app = express()
const User = require('./models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

mongoose.connect('mongodb://127.0.0.1:27017/authDemo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Mongo open')
}).catch(err => {
  console.log('Mongo error')
  console.log(err)
})

// This parses the request body so express knows what to expect
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs')
app.set('views', './views')

app.get('/', (req, res) => {
  res.send('This is the home page')
})

app.get('/secret', (req, res) => {
  res.send('This is secret')
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', async (req, res) => {
  const { password, username } = req.body;
  const hash = await bcrypt.hash(password, 12)
  const user = User({
    username: username,
    password: hash
  })
  await user.save()
  res.redirect('/')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const theUser = await User.findOne({ username: username })
  // console.log(theUser)
  const validPassword = await bcrypt.compare(password, theUser.password)
  // console.log(validPassword)
  if (validPassword)
    res.send("Match!!")
  else
    res.send("Fail!")
})

app.listen(3001, () => {
  console.log('Serving your app 3001')
})
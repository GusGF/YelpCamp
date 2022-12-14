// On the frontend, the session id is indeed stored and tracked via cookies.
// On the backend, by default, the actual session data can be stored in the memory 
// (but we can indeed store it to the database as well, etc).
const { request } = require('express');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// Flash messages are stored in the session. First enable cookieParser and session middleware. 
// Then, use flash middleware provided by connect-flash.
const flash = require('connect-flash');

const app = express();

app.use(cookieParser('thisIsMySecret'));
// 'secret' is used to encrypt the session cookie so that you can be 
// reasonably sure the cookie isn't a fake one. Cookies can also technically 
// contain sensitive data, so hashing it using a secret key can be helpful to protect 
// that data, and also protect the real session id value itself too. In the backend, 
// we can use the session secret key to verify that a cookie is valid when a new request 
// is sent to our backend, etc.
app.use(session({ secret: 'thisisnotagoodsecret', resave: false, saveUninitialized: false}));
app.use(flash());

app.get('/viewcount', (req, res) => {
  if (req.session.count)
    req.session.count += 1;
  else
    req.session.count = 1;
  res.send(`You have viewed this page ${req.session.count} time(s)`);
});

app.get('/register', (req, res)=>{
  const {username = 'Anonymous'} = req.query;
  req.session.username = username;
  res.redirect('/greet');
})

app.get('/greet', (req, res)=>{
  const {username} = req.session;
  res.send(`Hey ${username}`);
})

app.listen(4000, () => {
  console.log("Listening on 4000")
})
// By default, the session is stored in the memory, which is a short-term place to store information, 
// since such information will be lost if the server is restarted, and it does not scale well if your 
// application has a lot of simultaneous connections, that is, it can add a heavy load to the memory 
// which can lead to slowness, and so on, so a better approach is to store the session in a database, 
// and we will end up doing that later in this course when we use the connect-mongo package.
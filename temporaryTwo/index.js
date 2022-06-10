const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser('thisIsMySecret'));


app.get('/greet', (req, res) => {
  // console.log(req.cookies);
  res.send("Press F12 and see all the cookies for this domain")
})

// Cookies are key value pairs
app.get('/sendCookies', (req, res) => {
  // sending cookie to the requesting client
  res.cookie('My First Cookie', 'Bruce Springsteen');
  res.send('Sent a cookie');
})

app.get('/sendSignedCookies', (req, res) => {
  // sending signed cookie to the requesting client
  res.cookie('My Signed Cookie', 'banana', { signed: true });
  res.send('Sent a signed cookie');
})

// The browser will store the cookies above, in the client's browser data 
// and will do so for this site only i.e. http://localhost
// Then these cookies will be sent back to the server in every request the 
// client makes hence we can view them by accessing the 'req' parameter
app.get('/verifyCookies', (req, res) => {
  res.send(req.cookies);
})

// The cookies sent are encrypted, tampering with them will remove the cookie completely
// in the background will no longer be sent with the req object.
app.get('/verifysignedCookies', (req, res) => {
  res.send(req.signedCookies);
})

app.listen(4000, () => {
  console.log("Listening on 4000")
})
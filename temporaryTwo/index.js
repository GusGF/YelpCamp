const express = require('express');
const app = express();

app.get('/greet', (req, res) => {
  res.send("Hey there!")
})

// These will be sent on every request
app.get('/setname', (req, res) => {
  res.cookie('name', 'Stevie-Chicks');
  res.cookie('animal', 'Kitty');
  res.send('Okay sent you a cookie');
})

app.listen(4000, () => {
  console.log("Listening on 4000")
})
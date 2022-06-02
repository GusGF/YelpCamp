const express = require('express');
const app = express();
const shelterRoutes = require('./shelters')

// only requests to /shelters/* will be sent to 'shelterRoutes' 
app.use('/shelters', shelterRoutes)

app.listen(3000, () => {
  console.log('Serving on 3000');
})
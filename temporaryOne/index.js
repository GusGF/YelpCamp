const express = require('express');
const app = express();
const shelterRouter = require('./shelterRouter');
const adminRouter = require('./adminRouter');

// only requests to /shelters/* will be sent to 'shelterRoutes' 
app.use('/shelters', shelterRouter);
app.use('/admin', adminRouter);

app.listen(3000, () => {
  console.log('Serving on 3000');
})
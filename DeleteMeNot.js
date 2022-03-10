const express = require('express');
const app = express();
const path = require('path');
const CampGround = require('./models/campground');
const AppError = require('./other/AppError');

app.use(express.urlencoded({ extended: true }));

// http://localhost:3001/campgrounds?password=pass
// Middleware to check if a password exists in the HTML request e.g.
// app.get('/campgrounds', verify, async (req, res) => {
const verify = ((req, res, next) => {
  const { password } = req.query;
  if (password === 'pass') {
    console.log("Access allowed");
    next();
  }
  else {
    // throw new Error("Help PASSWORD ERROR");
    // throw new AppError("Oops!!!!", 499);
    res.status(409);
    throw new Error('Passord required!!!!!');
  }
});

// Full list
app.get('/campgrounds', verify, async (req, res) => {
  console.log("In app.get campgrounds");
  const campgrounds = await CampGround.find({});
  res.render('campgrounds/index', { campgrounds });
});

// Guaranteed to cause an error
app.get('/error', (req, res) => {
  chicken.fly();
  // res.status(409);
  // throw new Error('Passord required!');
  // throw new AppError();
})

// When a matching route can't be found
app.use((req, res) => {
  res.status(404).send('404 Page does not exist.');
})

// Custom error handling
// app.use((err, req, res, next) => {
//   res.status(531).send("Huh what happened?");
//   next(err + "  @@@@................ I am a custom error handler............@@@@");
//   res.status(999).send('Page might exist');
//   // next(err);
// })

// Custom error handling
// app.use((err, req, res, next) => {
//   const { message = 'Something went wrong', status = 500 } = err;
//   res.status(status).send('Something went');
// })

app.listen(3001, () => {
  console.log('Serving on port 3001')
});



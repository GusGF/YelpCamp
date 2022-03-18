const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const CampGround = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const AppError = require('./other/AppError');

mongoose.connect('mongodb://localhost:27017/yelpCampDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// Allows
app.engine('ejs', ejsMate);

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
    throw new AppError("Oops wrong password!!!!", 499);
    // res.status(409);
    // throw new Error('Passord required!!!!!');
  }
});

// Full list
app.get('/campgrounds', async (req, res) => {
  console.log("*************************** Display all campgrounds *********************")
  const campgrounds = await CampGround.find({});
  // throw new AppError("Nothings found", 400);
  // throw new Error('Passord required!');
  res.render('campgrounds/index', { campgrounds });
});


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                            CONFUSION OVER ROUTES
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// '/campgrounds/new' is being matched to '/campgrounds/:id'
// '/campgrounds/:id' isn't being matched to '/campgrounds/new'
// Form for adding a new campground
app.get('/campgrounds/new', (req, res) => {
  console.log("*************************** Campground Input form *********************")
  // throw new AppError("Not allowed", 401);
  res.render('campgrounds/new');
})

// Display a campground
app.get('/campgrounds/:id', async (req, res, next) => {
  console.log("*************************** Display a campground *********************")
  const campGround = await CampGround.findById(req.params.id)
  if (!campGround) {
    // next(new AppError("Nothing found", 401));
    return next(new AppError("Nothing found", 401));
  }
  res.render('campgrounds/show', { campGround });
})
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Display a campground to edit
app.get('/campgrounds/:id/edit', async (req, res, next) => {
  const campGround = await CampGround.findById(req.params.id)
  if (!campGround) {
    return next(new AppError("Nothing found", 401));
  }
  res.render('campgrounds/edit', { campGround });
})

// Guaranteed to cause an error
app.get('/error', (req, res) => {
  console.log("*************************** Error *********************")
  chicken.fly();
})

// When a matching route can't be found
app.use((req, res) => {
  res.status(404).send('404 Page does not exist.');
})

// Custom error handling
app.use((err, req, res, next) => {
  console.log("In custom error.........................");
  const { message = 'Something went wrong', status = 501 } = err;
  res.status(status).send(message);
  // next(err);
})

app.listen(3001, () => {
  console.log('Serving on port 3001')
});




const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const CG_Yelpcamp = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const AppError = require('./other/AppError');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
// const Joi = require('joi');
const { campgroundSchema, reviewSchema } = require('./schemas');
const Review = require('./models/review');
const morgan = require('morgan');


const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
app.use(cookieParser('thisIsMySecret'));
app.use(session({ secret: 'thisisnotagoodsecret', resave: false, saveUninitialized: false }));
// Flash messages are stored in the session. First enable cookieParser and 
// session middleware. Then, use flash middleware provided by connect-flash.
app.use(flash());
// Here we set up a middleware to add on to the response object in such a way that in every single 
// template and every view will have access to messages via res.locals
app.use((req, res, next) => {
  res.locals.messages = req.flash(success);
  next();
})

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
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
// Allows layouts to be used
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
  else
    // res.send("DENIED!!")
    throw new Error('Passord required!');
  // throw new AppError('Hey ol boy! Password required', 401);
});

app.get('/', (req, res) => {
  res.render('home');
})

// Full list
app.get('/campgrounds', async (req, res) => {
  const campgrounds = await CG_Yelpcamp.find({});
  // res.render('campgrounds/index', { campgrounds, messages: req.flash('success') });
  res.render('campgrounds/index', { campgrounds });
})

// Display form for adding a new campground
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
})

// This uses the JOI validation schema in 'schemas'
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    console.log('Error in validateCampground');
    const msg = error.details.map(elm => elm.message).join(', ');
    throw new ExpressError(msg, 400);
  } else {
    console.log('Campground validated');
    next();
  }
}

// This uses the JOI validation schema in 'schemas'
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(elm => elm.message).join(', ');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

/////////////////////////////////////////////////
// NOW FOLLOWS ALL THE HANDLERS FOR OUR ROUTES //
/////////////////////////////////////////////////
// Add a campground
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
  // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
  // We're using middleware to validate our data before we even attempt to save it with or involve Mongoose
  const campground = new CG_Yelpcamp(req.body.campground);
  await campground.save();
  // Set a flash message by passing the key, followed by the value, to req.flash()
  req.flash('success', 'Congrats you successfully made a farm');
  //redo res.redirect(`/campgrounds/${campground._id}`);
  res.redirect(`/campgrounds`);
}))

// Display a campground
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
  const campGround = await CG_Yelpcamp.findById(req.params.id).populate('reviews');
  console.log(campGround);
  res.render('campgrounds/show', { campGround });
}))

// Display a campground to edit
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
  const campGround = await CG_Yelpcamp.findById(req.params.id)
  res.render('campgrounds/edit', { campGround });
}))

// Update campground
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log(`Updating a row for: ${id}`);
  console.log(req.body);
  const campground = await CG_Yelpcamp.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await CG_Yelpcamp.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}));

// Add a campground review
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
  const campground = await CG_Yelpcamp.findById(req.params.id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`)
}))

// Delete reviews for campgrounds
app.delete('/campgrounds/:id/reviews/:reviewID', catchAsync(async (req, res) => {
  // res.send('Delete Me!');
  const { id, reviewID } = req.params;
  // The $pull mongo operator removes from an array all instances of a value(s) that match a specified condition.
  await CG_Yelpcamp.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
  await Review.findByIdAndDelete(reviewID);
  res.redirect(`/campgrounds/${id}`);
}))

// Will only run if nothing else above matches
// the * represents a 'get', a 'post', etc. 
app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
  console.log('**************************************');
  console.log('*************** ERROR ****************');
  console.log('**************************************');
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, something went wrong!!';
  res.status(statusCode).render('error', { err });
})

app.listen(3001, () => {
  console.log('Serving on port 3001')
});

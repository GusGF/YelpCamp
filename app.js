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
const Joi = require('joi');
const { campgroundSchema, reviewSchema } = require('./schemas');
const Review = require('./models/review');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');


app.use(cookieParser('thisIsMySecret'));
app.use(session({
  secret: 'thisisnotagoodsecret',
  resave: false,
  saveUninitialized: true
}));
/* Flash messages are stored in the session. First enable cookieParser and session middleware. Then, use flash middleware provided by connect-flash. */
// app.use(flash());
/* Here we set up a middleware to add on to the response object in such a way that in every single template and every view will have access to messages via res.locals */
// app.use((req, res, next) => {
//   res.locals.messages = req.flash(success);
//   next();
// })

mongoose.connect('mongodb://127.0.0.1:27017/yelpCampDB', {
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

/* express.Router() likes to keep params separate so the upshot of this is in the reviews route file the ':id' below, won't be passed in!! Routers actually get separate params but we can actually specify an option in the reviews routes file:
const router = express.Router({ mergeParams: true });
Now all of the params from here are also merged with the params in the reviews route file. */
const campgrounds = require('./routes/campgrounds');
app.use('/campgrounds', campgrounds)
const reviews = require('./routes/reviews');
app.use('/campgrounds/:id/reviews', reviews)

/* We are telling express to serve our public directory which contains static assets so that we could have images, custom style sheets and scripts */
// app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')))


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

app.listen(3002, () => {
  console.log('Serving on port 3002')
});

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
app.get('/campgrounds', verify, async (req, res) => {
  const campgrounds = await CampGround.find({});
  res.render('campgrounds/index', { campgrounds });
});

// Form for adding a new campground
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
})

// Add a campground
app.post('/campgrounds', async (req, res) => {
  const campground = new CampGround(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
})

// Display a campground
app.get('/campgrounds/:id', async (req, res) => {
  const campGround = await CampGround.findById(req.params.id)
  res.render('campgrounds/show', { campGround });
})

// Display a campground to edit
app.get('/campgrounds/:id/edit', async (req, res) => {
  const campGround = await CampGround.findById(req.params.id)
  res.render('campgrounds/edit', { campGround });
})

// Update campground
app.put('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findByIdAndDelete(id);
  res.redirect('/campgrounds');
})

// Guaranteed to cause an error
// Why does this not raise the default error handling
app.get('/error', (req, res) => {
  chicken.fly();
  // throw new Error('Passord required!');
  // throw new AppError();
})

// Default error handling only when a matching route can't be found
app.use((req, res) => {
  res.status(404).send('404 Page does not exist.');
})

// app.use((err, req, res, next) => {
//   console.log('*******************************************');
//   console.log('*************** ERROR ********************');
//   console.log('*******************************************');
//   next(err);
// })

// app.use((err, req, res, next) => {
//   next(err + "  @@@@................ I am a custom error handler............@@@@");
// })

app.listen(3001, () => {
  console.log('Serving on port 3001')
});

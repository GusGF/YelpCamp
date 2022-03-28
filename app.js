const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const CampGround = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const AppError = require('./other/AppError');
const catchAsync = require('./utils/catchAsync');

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
  const campgrounds = await CampGround.find({});
  res.render('campgrounds/index', { campgrounds });
});

// Form for adding a new campground
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
})

// Add a campground
app.post('/campgrounds', catchAsync(async (req, res, next) => {
  const campground = new CampGround(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}))

// // Display a campground
// app.get('/campgrounds/:id', catchAsync(async (req, res) => {
//   const campGround = await CampGround.findById(req.params.id)
//   res.render('campgrounds/show', { campGround });
// }))

// Display a campground
app.get('/campgrounds/:id', async (req, res, next) => {
  try {
    const campGround = await CampGround.findById(req.params.id)
    res.render('campgrounds/show', { campGround });
  } catch (e) {
    next();
  }
})

// Display a campground to edit
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
  const campGround = await CampGround.findById(req.params.id)
  res.render('campgrounds/edit', { campGround });
}))

// Update campground
app.put('/campgrounds/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log(`Updating a row for: ${id}`);
  console.log(req.body);
  const campground = await CampGround.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}));

app.use((err, req, res, next) => {
  console.log('*******************************************');
  console.log('*************** ERROR ********************');
  console.log('*******************************************');
  res.send("Oops not good");
})

app.listen(3001, () => {
  console.log('Serving on port 3001')
});

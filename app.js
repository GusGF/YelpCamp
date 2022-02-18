const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const CampGround = require('./models/campground');
const methodOverride = require('method-override');

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

// http://localhost:3001/campgrounds?password=pass
app.use((req, res, next) => {
  const { password } = req.query;
  if (password === 'pass') {
    console.log("Access allowed");
    next();
  }
  else
    res.send("DENIED!!")
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

// Adding a campground
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

app.use((req, res) => {
  res.send("404 Page does not exist.")
})

app.listen(3001, () => {
  console.log('Serving on port 3000')
});

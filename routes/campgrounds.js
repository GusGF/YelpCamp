const express = require('express');
const router = express.Router();


// Full list
router.get('/campgrounds', async (req, res) => {
  const campgrounds = await CG_Yelpcamp.find({});
  // res.render('campgrounds/index', { campgrounds, messages: req.flash('success') });
  res.render('campgrounds/index', { campgrounds });
})

// Display form for adding a new campground
router.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
})

// Add a campground
router.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
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
router.get('/campgrounds/:id', catchAsync(async (req, res) => {
  const campGround = await CG_Yelpcamp.findById(req.params.id).populate('reviews');
  console.log(campGround);
  res.render('campgrounds/show', { campGround });
}))

// Display a campground to edit
router.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
  const campGround = await CG_Yelpcamp.findById(req.params.id)
  res.render('campgrounds/edit', { campGround });
}))

// Update campground
router.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log(`Updating a row for: ${id}`);
  console.log(req.body);
  const campground = await CG_Yelpcamp.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/campgrounds/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await CG_Yelpcamp.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}));

module.exports = router;
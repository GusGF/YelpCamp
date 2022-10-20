const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { campgroundSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Yelpcamp = require('../models/campground');
const ObjectID = require('mongoose').Types.ObjectId;

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

// Full list
router.get('/', async (req, res) => {
  const campgrounds = await Yelpcamp.find({});
  // res.render('campgrounds/index', { campgrounds, messages: req.flash('success') });
  res.render('campgrounds/index', { campgrounds });
})

// Display form for adding a new campground
router.get('/new', (req, res) => {
  res.render('campgrounds/new');
})

// Add a campground
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
  console.log('In add a campground')
  // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
  /* We're using middleware to validate our data before we even attempt to save it with or involve Mongoose */
  const campground = new Yelpcamp(req.body.campground);
  await campground.save();
  // Set a flash message by passing the key, followed by the value, to req.flash()
  req.flash('success', 'Congrats you successfully made a campground');
  //redo res.redirect(`/campgrounds/${campground._id}`);
  res.redirect(`/campgrounds/${campground._id}`);
}))

// Display a campground
router.get('/:id', catchAsync(async (req, res) => {
  const campGround = await Yelpcamp.findById(req.params.id).populate('reviews');
  console.log(campGround);
  // // Passing our request property flash
  // res.render('campgrounds/show', { campGround, msg: req.flash('success') });
  res.render('campgrounds/show', { campGround });
}))

// Display a campground to edit
router.get('/:id/edit', catchAsync(async (req, res) => {
  const campGround = await Yelpcamp.findById(req.params.id)
  res.render('campgrounds/edit', { campGround });
}))

// Update campground
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
  console.log("Updating campground")
  const { id } = req.params;
  console.log(`Updating a row for: ${id}`);
  console.log(req.body);
  const campground = await Yelpcamp.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/${campground._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Yelpcamp.findByIdAndDelete(id);
  res.redirect('/campgrounds/');
}));

module.exports = router;




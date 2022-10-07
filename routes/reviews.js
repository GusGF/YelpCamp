const express = require('express');
const router = express.Router({ mergeParams: true });
const Joi = require('joi');
const { reviewSchema, campgroundSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Yelpcamp = require('../models/campground');
const Review = require('../models/review');
const ObjectID = require('mongoose').Types.ObjectId;

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

// Add a campground review
router.post('/', validateReview, catchAsync(async (req, res) => {
  console.log("About to post review")
  const campground = await Yelpcamp.findById(req.params.id);
  console.log(req.body.review)
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`)
}))

// Delete reviews for campgrounds
router.delete('/:reviewID', catchAsync(async (req, res) => {
  // res.send('Delete Me!');
  const { id, reviewID } = req.params;
  /* The $pull mongo operator removes from an array all instances of a value(s) that match a specified condition. */
  await Yelpcamp.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
  await Review.findByIdAndDelete(reviewID);
  res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;
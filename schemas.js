// Here we are defining the type i.e. campground is indeed an 'object' and it should be there i.e. required
// Our JOI schema should match our Mongoose schema for the fields we want to check
const Joi = require('Joi');

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required()
  }).required()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required(),
    body: Joi.string().required()
  }).required()
});
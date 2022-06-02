const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const campGroundSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});

// This trigger is fired when findByIdAndDelete in 'app.js' is used to delete a CG.
// So beware if you delete CGs using 'remove' or 'deleteMany' this middleware won't be triggered 
// So 'doc' is the object that's been deleted and is available to us so is passed in here
campGroundSchema.post('findOneAndDelete', async function (doc) {
  // console.log("Deleted!")
  console.log(doc);
  // Your looking for CG review-IDs that match Review review-IDs 
  // '$in' for IN, '$or' for OR
  // Also we should be using 'deleteMany' here as 'remove' was deprecated
  if (doc) {
    await Review.remove({
      _id: { $in: doc.reviews }
    })
  }
})

module.exports = mongoose.model('CG_Yelpcamp', campGroundSchema);
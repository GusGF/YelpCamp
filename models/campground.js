const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

campGroundSchema.post('findOneAndDelete', async function () {
  console.log("Deleted!")
})

module.exports = mongoose.model('CG_Yelpcamp', campGroundSchema);
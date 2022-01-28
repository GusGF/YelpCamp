const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campGroundSchema = new Schema({
  title: String,
  price: String,
  description: String,
  location: String
});
module.exports = mongoose.model('CampGround', campGroundSchema);
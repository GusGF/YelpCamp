const mongoose = require('mongoose');
const Product = require('./product');
const { Schema } = mongoose;

const farmSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Farm must have a name!']
  },
  city: {
    type: String
  },
  email: {
    type: String,
    required: [true, 'Email required']
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  ]
});


// Below we create Mongoose middleware to perform a delete when a farm is deleted
// DELETE ALL ASSOCIATED PRODUCTS AFTER A FARM IS DELETED
farmSchema.post('findOneAndDelete', async function (farm) {
  console.log(`Products are: ${farm.products}`);
  if (farm.products.length) {
    // Using the Mongo operatior '$in' we can delete all products whose ID is in 'farm.products' array
    const res = await Product.deleteMany({ _id: { $in: farm.products } })
    console.log(res);
  }
})

// // In the Pre-middleware we don't have access to the farm data as it's running before the 
// // delete query unlike with the Post-middleware as it runs after the farm is fetched and
// // deleted. In the post we can pull off the associated products and delete them.
// farmSchema.pre('findOneAndDelete', async function (data) {
//   console.log("PRE MIDDLEWARE!!!");
//   console.log(data);
// })
// farmSchema.post('findOneAndDelete', async function (data) {
//   console.log("POST MIDDLEWARE!!!");
//   console.log(data);
// })

const Farm = mongoose.model('Farm', farmSchema);



module.exports = Farm;
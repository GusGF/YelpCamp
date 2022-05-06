const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/relationshipDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

// PRODUCTS
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  season: {
    type: String,
    enum: ['Spring', 'Summer', 'Autumn', 'Winter']
  }
});
const Product = mongoose.model('Product', productSchema);
Product.insertMany([
  { name: 'Goddess Melon', price: 4.99, season: 'Summer' },
  { name: 'Sugar Baby Watermelon', price: 4.99, season: 'Summer' },
  { name: 'Asparagus', price: 3.99, season: 'Spring' }
])

// FARM
const farmSchema = new mongoose.Schema({
  name: String,
  city: String,
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
  // And this is where the 'ref' comes in that we set up, this ref product. This is our way of telling 
  // Mongoose this is an array of object IDs and each one represents or is connected to an actual product model.
})
const Farm = mongoose.model('Farm', farmSchema);
// Here we have a function to make a farm after which we push a product to it
const makeFarm = async () => {
  const farm = new Farm({ name: 'Full Belly Farms', city: 'Guinda, CA' });
  const melon1 = await Product.findOne({ name: 'Goddess Melon' });
  farm.products.push(melon1);
  const melon2 = await Product.findOne({ name: 'Sugar Baby Watermelon' });
  farm.products.push(melon2);
  const melon3 = await Product.findOne({ name: 'Asparagus' });
  farm.products.push(melon3);
  await farm.save();
  console.log(farm);
}
makeFarm();
Farm.findOne({ name: 'Full Belly Farms' }).then(product => console.log(product));
// Each one of our object IDs represents or is connected to an actual product model. So when we call populate, 
// Mongoose is going to take each I.D. that has been stored in the 'Product' array and replace with the 
// corresponding product, but we have to make sure we tell it to populate.
Farm.findOne({ name: 'Full Belly Farms' }).populate('products').then(theFarm => console.log(theFarm));
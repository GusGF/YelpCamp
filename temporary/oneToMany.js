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
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
  // Here we tell Mongoose this type i.e. it is an object ID type. It's not JS it's mongoose
  // The ref option is what tells Mongoose which model to use during population i.e. an array of 'Product' IDs.
})
const Farm = mongoose.model('Farm', farmSchema);
const makeFarm = async () => {
  const farm = new Farm({ name: 'Full Belly Farms', city: 'Guinda, CA' });
  const melon = await Product.findOne({ name: 'Goddess Melon' });
  farm.products.push(melon);
  await farm.save();
  console.log(farm);
}
makeFarm();
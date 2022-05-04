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

// Make a Schema
// Note: Mongoose treats 'addresses' as it's own embedded schema!
// '_id' we've turned it off for 'addresses'
const userSchema = new mongoose.Schema({
  first: String,
  last: String,
  addresses: [
    {
      _id: { id: false },
      street: String,
      city: String,
      state: String,
      country: String
    }
  ]
});

// Create a model
const User = mongoose.model('User', userSchema);

// Function to make a user
const makeUser = async () => {
  // Create a user
  const u = new User({
    first: 'Harry',
    last: 'Potter'
  });
  // Add an address to the user
  u.addresses.push({
    street: '123 Sesame St',
    city: 'New York',
    state: 'NY',
    country: 'USA'
  });
  const res = await u.save();
  console.log(res)
}

const addAddresses = async (id) => {
  const user = await User.findById(id);
  user.addresses.push({
    street: '99 3rd St.',
    city: 'New York',
    state: 'NY',
    country: 'USA'
  });
  const res = await user.save();
  console.log(res)
}

// makeUser();
addAddresses('6272b4f694505a395840d51c')
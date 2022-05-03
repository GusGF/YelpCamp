const mongoose = require('mongoose');
const CG_Yelpcamp = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelpCampDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await CG_Yelpcamp.deleteMany({});
  for (let i = 0; i <= 1; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 100);
    const camp = new CG_Yelpcamp({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: 'https://source.unsplash.com/collection/483251',
      description: 'One of the many joys of wild camping is that it gives access to remote and wild places. Finding a remote spot with a view to enjoy at sunrise will make all the aches and pains of hiking through the wilderness seem worthwhile.',
      price: price
    })
    await camp.save();
  }
}

seedDB().then(() => {
  const dbConn = mongoose.createConnection('mongodb://localhost:27017/yelpCampDB');
  dbConn.close();
  console.log("DB connection closed");
});
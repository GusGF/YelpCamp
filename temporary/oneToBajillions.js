const mongoose = require('mongoose');
const { schema } = require('../schemas');
mongoose.connect('mongodb://localhost:27017/relationshipDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const userSchema = new mongoose.Schema({
  username: String,
  age: Number
})
const User = mongoose.model('User', userSchema);

const tweetSchema = new mongoose.Schema({
  text: String,
  likes: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
const Tweet = mongoose.model('Tweet', tweetSchema);

const makeTweets = async () => {
  const alphaUser = new User({ username: 'chickenFan99', age: 61 });
  const tweet1 = new Tweet({ text: 'OMG I love my chicken family!', likes: 0 });
  const tweet2 = new Tweet({ text: 'OMG I love my bicycle', likes: 104 });
  tweet1.user = alphaUser;
  tweet2.user = alphaUser;
  tweet1.save();
  tweet2.save();
  alphaUser.save();
  const t = await Tweet.findOne({}).populate('user', 'username');
  console.log(t);
}

makeTweets();
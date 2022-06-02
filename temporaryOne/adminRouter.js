const express = require('express');
// create an instance of router
const adminRouter = express.Router();

adminRouter.use((req, res, next) => {
  if (req.query.pwd) {
    next();
  } else { res.send("You don't have clearance") }
})

// Add the following to our instance of router
adminRouter.get('/', (req, res) => {
  res.send("All admin");
})

adminRouter.get('/new', (req, res) => {
  res.send("Form for new admin")
})

module.exports = adminRouter;
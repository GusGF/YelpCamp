const express = require('express');
const shelterRouter = express.Router();

shelterRouter.get('/', (req, res) => {
  res.send("All shelters");
})

shelterRouter.get('/:id', (req, res) => {
  res.send("Viewing one shelter")
})

shelterRouter.get('/:id/edit', (req, res) => {
  res.send("Editing one shelter")
})

module.exports = shelterRouter;
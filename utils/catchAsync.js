// we use this to wrap our async functions
module.exports = func => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  }
}
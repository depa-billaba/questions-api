const questions = require('./questions');

module.exports = app => {
  app.use('/qa/questions', questions)
}

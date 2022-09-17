const questions = require('./questions');
const answers = require('./answers');

module.exports = app => {
  app.use('/qa/questions', questions)
  app.use('/qa/answers', answers)
}

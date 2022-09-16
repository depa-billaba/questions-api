const Router = require('express-promise-router');

const db = require('../db');

const router = new Router();

module.exports = router;

router.get('/', async (req, res) => {
  const id = req.query.product_id;
  if(!id) {
    res.status(400);
    res.send('Incorrect product id');
    return;
  }
  let response = await db.query(`
    SELECT
      q.*,
      a.body AS answerbody,
      a.date_written AS answerdate,
      a.reported AS answerreported,
      a.helpful AS answerhelpful,
      a.id AS answerid,
      a.answerer_name,
      p.url
    FROM
      questions q
    LEFT JOIN answers a ON a.question_id = q.id
    LEFT JOIN photos p ON a.id = p.answer_id
    WHERE
      q.product_id = $1
      AND q.reported=false`,
    [id]);
  response = response.rows;
  const questions = {};
  response.forEach(item => {
    if(!questions[item.id]) {
      questions[item.id] = {
        question_id: item.id,
        question_body: item.body,
        question_date: item.date_written.toISOString(),
        asker_name: item.asker_name,
        question_helpfulness: item.helpful,
        reported: item.reported,
        answers: {}
      }
    }
    if (!item.answerid || item.answerreported) return;
    questions[item.id].answers[item.answerid] = {
      id: item.answerid,
      body: item.answerbody,
      date: item.answerdate.toISOString(),
      answerer_name: item.answerer_name,
      helpfulness: item.answerhelpful,
      photos: [],
    }
    if (!item.url) return;
    questions[item.id].answers[item.answerid].photos.push(item.url);
  })
  const result = {
    product_id: id,
    results: [],
  }
  for(let key in questions) {
    result.results.push(questions[key]);
  }
  console.log(response);
  res.status(200)
  res.send(result);
})
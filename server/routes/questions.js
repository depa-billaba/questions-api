const Router = require('express-promise-router');
const joinjs = require('join-js').default;
const maps = require('./schemaMap');
const db = require('../db');

const router = new Router();

module.exports = router;

router.get('/:question_id/answers', async (req, res) => {
  const qid = req.params.question_id;
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  const skip = (count * page) - count;
  if(!qid) {
    res.status(400);
    res.send('Incorrect question id');
    return;
  }
  let response = await db.query(`
    SELECT
      a.id as a_id,
      a.question_id as a_question_id,
      a.body as a_body,
      a.date_written as a_date,
      a.answerer_name as a_answerer_name,
      a.answerer_email as a_email,
      a.helpful as a_helpfulness,
      p.id as p_id,
      p.answer_id as p_answer_id,
      p.url as p_url
    FROM answers a
    LEFT JOIN
      photos p
    ON
      a.id = p.answer_id
    WHERE
      a.question_id = $1 AND
      a.reported = false
  `, [qid])
  response = response.rows;
  let mapped = joinjs.map(response, maps, 'answerMap', 'a_')
  mapped = mapped.slice(skip, skip + count)
  mapped.forEach(answer => {
    answer.answer_id = answer.id,
    answer.id = undefined;
  })
  const finalResponse = {
    question: qid + '',
    page: page,
    count: count,
    results: mapped
  }
  res.status(200);
  res.send(finalResponse);
})
router.get('/', async (req, res) => {
  const id = req.query.product_id;
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  const skip = (count * page) - count;
  if(!id) {
    res.status(400);
    res.send('Incorrect product id');
    return;
  }
  let response = await db.query(`
    SELECT
      q.id as q_question_id,
      q.body as q_question_body,
      q.date_written as q_question_date,
      q.asker_name as q_asker_name,
      q.helpful as q_question_helpfulness,
      q.reported as q_reported,
      a.id as a_id,
      a.question_id as a_question_id,
      a.body as a_body,
      a.date_written as a_date,
      a.answerer_name as a_answerer_name,
      a.answerer_email as a_email,
      a.helpful as a_helpfulness,
      p.id as p_id,
      p.answer_id as p_answer_id,
      p.url as p_url
    FROM questions q
    LEFT JOIN
      answers a
    ON
      a.question_id = q.id AND
      a.reported = false
    LEFT JOIN
      photos p
    ON
      a.id = p.answer_id
    WHERE
      q.product_id = $1 AND
      q.reported = false
  `, [id])
  response = response.rows;
  let mapped = joinjs.map(response, maps, 'questionsMap', 'q_')
  mapped = mapped.slice(skip, skip + count)
  mapped.forEach(question => {
    const newAnswers = {};
    question.answers.forEach(answer => {
      newAnswers[answer.id] = answer;
    })
    question.answers = newAnswers;
  })
  const clientData = {
    product_id: id,
    results: mapped
  }
  res.status(200);
  res.send(clientData);
})
const Router = require('express-promise-router');
const db = require('../db');

const router = new Router();
module.exports = router;

router.put('/:answer_id/helpful', async (req, res) => {
  const id = req.params.answer_id;
  const response = await db.query(`
    UPDATE answers
    SET helpful = helpful + 1
    WHERE id = $1
  `, [id])
  res.sendStatus(204);
})
router.put('/:answer_id/report', async (req, res) => {
  const id = req.params.answer_id;
  const response = await db.query(`
    UPDATE answers
    SET reported = true
    WHERE id = $1
  `, [id]);
  res.sendStatus(204);
})
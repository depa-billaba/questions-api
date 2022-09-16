const {parse} = require('csv-parse');
const fs = require('fs');
const {Client, Pool} = require('pg');
const format = require('pg-format');
require('dotenv').config();

main().catch(err => console.log(err))

async function main() {
  const pool = new Pool();
  await pool.connect();
  console.log('Connected');

  const answerParser = fs
    .createReadStream(__dirname + '/../raw-data/answers.csv')
    .pipe(parse({
      skip_records_with_error: true,
      columns: true,
    }))
  console.time('Parse');
  await pool.query('DELETE FROM ANSWERS *');
  let count = 0;
  let answers = [];
  for await (const record of answerParser) {
    answer = [record.id, record.question_id, record.body, new Date(Number(record.date_written)), record.answerer_name, record.answerer_email, record.reported === '1', record.helpful];
    answers.push(answer);
    count++;
    if(count === 10000) {
      const query = format('INSERT INTO answers (id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful) VALUES %L', answers);
      console.count('10k');
      count = 0;
      answers = [];
      const res = await pool.query(query);
      console.log('Inserted', res.rowCount);
    }
  }
  const query = format('INSERT INTO answers (id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful) VALUES %L', answers);
  const res = await pool.query(query);
  console.log('Inserted', res.rowCount);
  console.timeEnd('Parse');
  console.log('Answers table generation complete');
  await pool.end();
}
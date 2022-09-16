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

  const questionParser = fs
    .createReadStream(__dirname + '/../raw-data/questions.csv')
    .pipe(parse({
      skip_records_with_error: true,
      columns: true,
    }))
  console.time('Parse');
  await pool.query('DELETE FROM QUESTIONS *');
  let count = 0;
  let questions = [];
  for await (const record of questionParser) {
    const question = [record.id, record.product_id, record.body, new Date(Number(record.date_written)), record.asker_name, record.asker_email, record.reported === '1', record.helpful];
    questions.push(question);
    count++;
    if (count === 10000) {
      const query = format('INSERT INTO questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful) VALUES %L', questions)
      console.count('10')
      count = 0;
      questions = [];
      const res = await pool.query(query);
      console.log('Inserted', res.rowCount);
    }
  }
  const query = format('INSERT INTO questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful) VALUES %L', questions)
  const res = await pool.query(query);
  console.log('Inserted', res.rowCount);
  console.timeEnd('Parse');
  console.log('Question table generation complete');
  await pool.end();
  console.log('Disconnected program terminating');
  process.exit(0);
}
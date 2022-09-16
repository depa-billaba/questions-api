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
    .createReadStream(__dirname + '/../raw-data/answers_photos.csv')
    .pipe(parse({
      skip_records_with_error: true,
      columns: true,
    }))
  console.time('Parse');
  await pool.query('DELETE FROM PHOTOS *');
  let count = 0;
  let photos = [];
  for await (const record of answerParser) {
    const photo = [record.id, record.answer_id, record.url];
    photos.push(photo);
    count++;
    if (count === 10000) {
      const query = format('INSERT INTO photos(id, answer_id, url) VALUES %L', photos);
      console.count('10k');
      count = 0;
      photos = [];
      const res = await pool.query(query);
      console.log('Inserted', res.rowCount);
    }
  }
  const query = format('INSERT INTO photos(id, answer_id, url) VALUES %L', photos);
  console.count('10k');
  const res = await pool.query(query);
  console.log('Inserted', res.rowCount);
  console.timeEnd('Parse');
  console.log('Photos table generation complete');
  await pool.end();
}
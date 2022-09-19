const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.port || 8090;

app.use(express.static(__dirname + '/public'));

app.get('/', async (req, res) => {
  res.sendStatus(200);
})

app.listen(PORT, () => {
  console.log(`QnA service listening on port ${PORT}`);
});
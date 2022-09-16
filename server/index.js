const express = require('express');
const mountRoutes = require('./routes/index.js');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
mountRoutes(app);
const PORT = process.env.port || 8090;

app.use(morgan('dev'));

app.listen(PORT, () => {
  console.log(`QnA service listening on port ${PORT}`);
});
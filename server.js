const express = require('express');

const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(express.static(__dirname + '/dist'));
app.use(cors());

// Mongoose Connect
mongoose.connect(
  process.env.MONGODG_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err;
    console.log("MongoDB database connection established successfully");
  }
);

// Routing
const practicesRouter = require('./src/routes/practices');
const teachersRouter = require('./src/routes/teachers');
const mapsRouter = require('./src/routes/maps');
const usersRouter = require('./src/routes/users');

app.use('/practices', practicesRouter);
app.use('/teachers', teachersRouter);
app.use('/maps', mapsRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

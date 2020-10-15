const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

// Initialize the app
const app = express();
const port = process.env.PORT || 5000;
const db = process.env.MONGODG_URI;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Mongoose Connect
mongoose.connect(db,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err;
    console.log(`MongoDB database connection established successfully to ${db}`);
  }
);

// Routing
const practicesRouter = require('./src/routes/practices');
const teachersRouter = require('./src/routes/teachers');
const usersRouter = require('./src/routes/users');

app.use('/practices', practicesRouter);
app.use('/teachers', teachersRouter);
app.use('/users', usersRouter);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

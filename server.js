const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

require('dotenv').config();

// Initialize the app
const app = express();
const port = process.env.PORT || 5000;
const db = process.env.MONGODG_URI;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Static toute to /public
app.use(express.static('public'));

// Mongoose Connect
mongoose.connect(db,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err;
    console.log(`MongoDB database connection established successfully.`);
  }
);

// Routing
const practicesRouter = require('./src/routes/practices');
const teachersRouter = require('./src/routes/teachers');
const usersRouter = require('./src/routes/users');
const signupRouter = require('./src/routes/signup');

// Mount the routers to express app
app.use('/practices', practicesRouter);
app.use('/teachers', teachersRouter);
app.use('/users', usersRouter);
app.use('/signup', signupRouter);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

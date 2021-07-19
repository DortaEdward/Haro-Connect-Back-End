const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {
  notFound,
  errorHandler,
  checkTokkenSetUser,
  isLoggedin,
} = require('./middleware');
const authController = require('./auth');
const postController = require('./routes/postsController');
const userController = require('./routes/userController');

require('dotenv').config();

const app = express();
const { PORT, MONGOURI } = process.env;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(checkTokkenSetUser);

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', () => {
  console.log('error connecting to db');
});
db.once('open', () => {
  console.log('DB connected');
});
db.on('close', () => {
  console.log('db closed');
});

app.use('/auth', authController);
app.use('/api/v1/posts', isLoggedin, postController);
app.use('/api/v1/users', userController);

app.get('/', (req, res) => {
  res.json({
    user: req.user,
  });
});

// Middleware error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

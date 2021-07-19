const jwt = require('jsonwebtoken');

const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`Not found - ${req.originalUrl}`);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  res.status = res.statusCode || 500;
  res.json({
    message: err.message,
    stack: err.stack,
  });
};

const checkTokkenSetUser = (req, res, next) => {
  const authHeader = req.get('authorization');
  if (authHeader) {
    const tokken = authHeader.split(' ')[1];
    if (tokken) {
      jwt.verify(tokken, process.env.TOKKEN_SECRET, (error, user) => {
        if (error) {
          console.log(`Error: ${error}`);
        }
        req.user = user;
        next();
      });
    } else {
      next();
    }
  } else {
    next();
  }
};

const isLoggedin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    const error = new Error('unauthorized');
    res.status(401);
    next(error);
  }
};

module.exports = {
  notFound,
  errorHandler,
  checkTokkenSetUser,
  isLoggedin,
};

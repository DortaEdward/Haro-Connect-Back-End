const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const Users = require('../models/userModel');

// User schema validatiion
const signUpSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: ['com', 'net'],
      },
    })
    .required(),

  username: Joi.string()
    .regex(/(^[a-zA-Z0-9_]+$)/)
    .min(2)
    .max(30)
    .required(),

  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .min(5)
    .required(),
  profilePicture: Joi.string().uri(),
  role: Joi.string(),

});

const logInSchema = Joi.object({
  username: Joi.string()
    .regex(/(^[a-zA-Z0-9_]+$)/)
    .min(2)
    .max(30)
    .required(),

  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .min(5)
    .required(),
});

const respondError422 = (res, next) => {
  res.status = 404;
  const error = new Error('Unable to login');
  next(error);
};

router.get('/users', (req, res) => {
  Users.find({}, (err, foundUsers) => {
    if (err) {
      res.send('error');
    } else {
      res.json({
        data: foundUsers,
      });
    }
  });
});

router.post('/signup', (req, res, next) => {
  const result = signUpSchema.validate(req.body);
  if (!result.error) {
    result.value.password = bcrypt.hashSync(result.value.password, bcrypt.genSaltSync(12));
    Users.create(result.value, (err, createdUser) => {
      if (err) {
        next(err);
      } else {
        res.json({
          message: 'User created!',
          user: createdUser,
        });
      }
    });
  } else {
    respondError422(res, next);
  }
});

router.post('/login', (req, res, next) => {
  const result = logInSchema.validate(req.body);
  if (!result.error) {
    Users.findOne({ username: result.value.username }, (err, foundUser) => {
      if (err) {
        respondError422(res, next);
      }
      if (!foundUser) {
        res.json({
          message: 'user not found!',
        });
      } else if (foundUser) {
        if (bcrypt.compareSync(result.value.password, foundUser.password)) {
          const payload = {
            id: foundUser._id,
            username: foundUser.username,
            profilePicture: 'https://drive.google.com/uc?id=17qamwkPahosjPPVqvSbLcmKzOKifQRon',
            role: foundUser.role,
          };
          jwt.sign(payload, process.env.TOKKEN_SECRET, {
            expiresIn: '1d',
          }, (error, tokken) => {
            if (error) {
              respondError422(res, next);
            } else {
              res.json({
                tokken,
              });
            }
          });
        }
      }
    });
  } else {
    respondError422(res, next);
  }
});

router.get('/resetDb', (req, res) => {
  Users.deleteMany({}, (err, deletedUsers) => {
    if (err) {
      res.send('did not work');
    } else {
      res.send(deletedUsers);
    }
  });
});

module.exports = router;

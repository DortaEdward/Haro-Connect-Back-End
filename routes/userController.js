const express = require('express');
const Users = require('../models/userModel');

const router = express.Router();

const respondError404 = (res, next) => {
  res.status = 404;
  const error = new Error('Not Found');
  next(error);
};

router.get('/:id', (req, res, next) => {
  Users.findById(req.params.id, (err, foundUser) => {
    if (err) {
      respondError404(req, next);
    } else {
      const user = {
        username: foundUser.username,
        profilePicture: foundUser.profilePicture,
        followers: foundUser.followers,
        following: foundUser.following,
        role: foundUser.role,
      };
      res.json({
        userInfo: user,
      });
    }
  });
});

router.put('/update/:id', (req, res) => {
  Users.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedUser) => {
    if (err) {
      res.json({
        error: err,
      });
    } else {
      res.json({
        status: 200,
        message: 'User Updated',
      });
    }
  });
});

router.delete('/delete/:id', (req, res) => {
  Users.findByIdAndDelete(req.params.id, (err, deletedUser) => {
    if (err) {
      res.json({
        error: err,
      });
    } else {
      res.json({
        staus: 200,
        message: 'User Deleted!',
      });
    }
  });
});

module.exports = router;

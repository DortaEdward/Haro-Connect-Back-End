const express = require('express');
const Joi = require('joi');
const Posts = require('../models/postModel');

const router = express.Router();

const postSchema = Joi.object({
  content: Joi.string()
    .trim()
    .max(280)
    .required(),
});

router.get('/', (req, res, next) => {
  Posts.find({})
    .sort({date: 1})
    .exec((err, foundPosts) => {
      if (err) {
            next(err);
      } else {
        res.json({
          posts: foundPosts,
        });
      }
    })
});

router.get('/:id', (req, res, next) => {
  Posts.findById(req.params.id, (err, foundPost) => {
    if (err) {
      next(err);
    } else {
      res.json({
        data: foundPost,
      });
    }
  });
});

router.put('/update/:id', (req, res, next) => {
  Posts.findByIdAndUpdate(req.params.id,
    { content: req.body.content },
    { new: true },
    (err, updatedPost) => {
      if (err) {
        next(err);
      }
      res.json({
        message: 'updated',
      });
    });
});

router.post('/create', (req, res, next) => {
  const result = postSchema.validate(req.body);
  if (result.error == null) {
    const post = {
      ...req.body,
      authorId: req.user.id,
      author: req.user.username,
    };
    Posts.create(post, (err, createdPost) => {
      if (err) {
        next(err);
      } else {
        res.json({
          post: createdPost,
        });
      }
    });
  } else {
    const error = new Error(result.error);
    res.status(422);
    next(error);
  }
});

router.delete('/delete/:id', (req, res, next) => {
  Posts.findByIdAndDelete(req.params.id, (err, deletedPost) => {
    if (err) {
      next(err);
    } else {
      res.json({
        staus: 200,
        message: 'Post Deleted!',
      });
    }
  });
});

module.exports = router;

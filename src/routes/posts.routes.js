const express = require('express');
const {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/posts.controller');
const { asyncHandler } = require('../middlewares/asyncHandler');
const { requireAuth } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const {
  createPostSchema,
  updatePostSchema,
  postIdSchema,
  listPostsSchema,
} = require('../schemas/post.schemas');

const router = express.Router();

router.get('/', validate(listPostsSchema), asyncHandler(listPosts));
router.get('/:id', validate(postIdSchema), asyncHandler(getPost));
router.post('/', requireAuth, validate(createPostSchema), asyncHandler(createPost));
router.patch('/:id', requireAuth, validate(updatePostSchema), asyncHandler(updatePost));
router.delete('/:id', requireAuth, validate(postIdSchema), asyncHandler(deletePost));

module.exports = router;

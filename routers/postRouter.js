const express = require('express');

const router = express.Router();
const postController = require('../controllers/postsController');
const { identifier } = require('../middlewares/identification');


router.post('/create', identifier, postController.createPost);
router.get('/all', identifier, postController.getAllPosts);
router.get('/:id',identifier, postController.getPostById);
router.patch('/update/:id', identifier, postController.updatePost);
router.delete('/delete/:id', identifier, postController.deletePost);

module.exports = router;
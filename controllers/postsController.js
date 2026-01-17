const Post = require('../models/postsModel');
const createPostSchema = require('../middlewares/validator').createPostSchema;
exports.getAllPosts = async (req, res) => {
    const {page} = req.query;
    const postsPerPage = 10;

    try {
        let pageNum = 0;
        if (page <= 0){
            pageNum = 0;
        } else {
            pageNum = page - 1;
        }

        const result = await Post.find()
            .skip(pageNum * postsPerPage)
            .limit(postsPerPage)
            .sort({ createdAt: -1 })
            .populate({path: 'userId', select: 'email'});

        return res.status(200).json({ success: true, data: result, message: 'Posts retrieved successfully' }); 

    } catch (error) {
        console.error('Get posts error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



// Create Post

exports.createPost = async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user.id;

    try {

        const {error, value} = createPostSchema.validate({ title, description, userId });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const result = await Post.create({
            title: value.title,
            description: value.description,
            userId: value.userId,
        });

        return res.status(201).json({ success: true,  message: 'Post created successfully', data: result });

    } catch (error) {
        console.error('Create post error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


exports.getPostById = async (req, res) => {
    // Get post by ID logic here
    const { id } = req.params;

    try {
        const result = await Post.findById(id).populate({path: 'userId', select: 'email'});
        if (!result) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        return res.status(200).json({ success: true, data: result, message: 'Post retrieved successfully' });

    } catch (error) {
        console.error('Get post by ID error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }       


};

exports.updatePost = async (req, res) => {
    // Update post logic here
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.user.id;

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to update this post' });
        }

        post.title = title || post.title;
        post.description = description || post.description;

        const result = await post.save();

        return res.status(200).json({ success: true, data: result, message: 'Post updated successfully' });

    } catch (error) {
        console.error('Update post error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }       
};

exports.deletePost = async (req, res) => {
    // Delete post logic here
    const { id } = req.params;
    const userId = req.user.id;     
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this post' });
        }

        await Post.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: 'Post deleted successfully' });

    } catch (error) {
        console.error('Delete post error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }       
};
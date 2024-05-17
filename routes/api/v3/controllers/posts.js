import express from 'express';
import models from '../../../../models.js';

const router = express.Router();

router.post("/", async (req, res, next) => {
    if (req.session.isAuthenticated) {
        let postObj = req.body;
        try {
            let newPost = new req.models.Post({
                url: postObj.url,
                username: req.session.account.username,
                description: postObj.description,
                created_date: Date.now()
            });
            await newPost.save();
            res.json({ "status": "success" });
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ "status": "error", "error": error.message });
        }
    } else {
        res.status(401)
        res.json({
            status: "error",
            error: "not logged in"
         })
    }
});

// GET /api/v3/posts - Retrieve all posts
router.get('/', async (req, res) => {
    try {
        const posts = await models.Post.find({}).lean();
        // Rename _id to id
        posts.forEach(post => post.id = post._id);
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error });
    }
});

// POST /api/v3/posts/like - Like a post
router.post('/like', async (req, res) => {
    try {
        if (!req.session || !req.session.account) {
            return res.status(401).json({ status: 'error', error: 'not logged in' });
        }

        const { postID } = req.body;
        const username = req.session.account.username;
        const post = await models.Post.findById(postID);

        if (!post) {
            return res.status(404).json({ status: 'error', error: 'post not found' });
        }

        if (!post.likes.includes(username)) {
            post.likes.push(username);
            await post.save();
        }

        res.json({ status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error });
    }
});

// POST /api/v3/posts/unlike - Unlike a post
router.post('/unlike', async (req, res) => {
    try {
        if (!req.session || !req.session.account) {
            return res.status(401).json({ status: 'error', error: 'not logged in' });
        }

        const { postID } = req.body;
        const username = req.session.account.username;
        const post = await models.Post.findById(postID);

        if (!post) {
            return res.status(404).json({ status: 'error', error: 'post not found' });
        }

        const index = post.likes.indexOf(username);
        if (index > -1) {
            post.likes.splice(index, 1);
            await post.save();
        }

        res.json({ status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error });
    }
});

// DELETE /api/v3/posts - Delete a post
router.delete('/', async (req, res) => {
    try {
        if (!req.session || !req.session.account) {
            return res.status(401).json({ status: 'error', error: 'not logged in' });
        }

        const { postID } = req.body;
        const username = req.session.account.username;
        const post = await models.Post.findById(postID);

        if (!post) {
            return res.status(404).json({ status: 'error', error: 'post not found' });
        }

        if (post.username !== username) {
            return res.status(401).json({ status: 'error', error: 'you can only delete your own posts' });
        }

        // Delete all comments referencing this post
        await models.Comment.deleteMany({ post: postID });
        // Delete the post itself
        await models.Post.deleteOne({ _id: postID });

        res.json({ status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error });
    }
});

export default router;

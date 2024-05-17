import express from 'express';
import models from '../../../../models.js';
const router = express.Router();

// GET /api/v3/comments - Get comments for a specific post
router.get('/', async (req, res) => {
    try {
        const { postID } = req.query;
        const comments = await models.Comment.find({ post: postID }).lean();
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error });
    }
});

// POST /api/v3/comments - Add a comment to a specific post
router.post('/', async (req, res) => {
    try {
        if (!req.session || !req.session.account) {
            return res.status(401).json({ status: 'error', error: 'not logged in' });
        }

        const { postID, newComment } = req.body;
        const username = req.session.account.username;

        const comment = new models.Comment({
            username,
            comment: newComment,
            post: postID,
            created_date: new Date()
        });

        await comment.save();
        res.json({ status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error });
    }
});

export default router;

import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

// const escapeHTML = str => String(str).replace(/[&<>'"]/g, 
//     tag => ({
//         '&': '&amp;',
//         '<': '&lt;',
//         '>': '&gt;',
//         "'": '&#39;',
//         '"': '&quot;'
//     }[tag]));

//TODO: Add handlers here
router.post('/', async (req, res, next) => {
    if (req.session.isAuthenticated) {
        let reqBody = req.body
        try{
            let comingPost = new req.models.Post({
                url: reqBody.url,
                username: req.session.account.username,
                description: reqBody.description,
                created_date: Date.now()
            })
            
            // await escapeHTML(comingPost).save()
            await comingPost.save()

            res.json({"status": "success"});
        } catch (error){
            console.log("Error:", error)
            res.status(500).json({"status": "error", "error": error})
        }
    } else {
        console.log("Error:", error)
        res.status(401).json({"status": "error", "error": "not logged in"})
    }
    
})


router.get('/', async (req, res, next) => {
    let username = req.query.username
  try {
    let posts = []
    if (username) {
        posts = await req.models.Post.find({username: username});
    } else {
        posts = await req.models.Post.find();
    }
    const postData = await Promise.all (posts.map(async post => {
    let htmlPreview = {}
        try {
            htmlPreview = await getURLPreview(post.url);
        } catch (error) {
            htmlPreview = error.message
        }
        return { "description": post.description, "username" : post.username, "htmlPreview" : htmlPreview };

    }));
    res.json(postData);
  } catch (error) {
      console.error(error);
      console.log('here is the problem 2')
      res.status(500).json({ status: "error", error: error.message });
  }
});

export default router;

import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.post('/', async (req, res) => {
    let postObject = req.body
    try{
        let comingPost = new req.models.Post({
            url: postObject.url,
            description: postObject.description,
            current: postObject.date
        })
        await comingPost.save()
        res.json({"status": "success"})
    } catch (error){
        console.log("Error:", error)
        res.status(500).json({"status": "error", "error": error})
    }
})

router.get('/', async function(req, res, next) {
    try{
      let allPosts = await req.models.Post.find()
      const postData = await Promise.all (allPost.map(async post => {
        let htmlPreview{}
        try{
          htmlPreview = await getURLPreview(post.url)
        } catch{
          htmlPreview = error.message
          res.send('error')
      

        }
        return { description: post.description, htmlPreview: `Error: ${error.message}` };
      }));
      res.json(postData)
    } catch(error){
      console.log("Error:", error)
      res.status(500).json({"status": "error", "error": error})
    }
  });

export default router;

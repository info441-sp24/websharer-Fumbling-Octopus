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
      let allPosts = await req.models.User.find()
      res.json(allUsers)
    } catch(error){
      console.log("Error:", error)
      res.status(500).json({"status": "error", "error": error})
    }
  });
  


export default router;

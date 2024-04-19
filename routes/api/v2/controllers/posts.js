import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.post('/', async (req, res) => {
    try{
        let comingPost = new req.models.Post({
            url: req.body.url,
            description: req.body.description,
            current_time: Date.now(),
            username: req.body.username
        })
        await comingPost.save()
        res.json({"status": "success"})
    } catch (error){
        console.log("Error:", error)
        res.status(500).json({"status": "error", "error": error})
    }
})

// router.get('/', async function(req, res) {
//     try{
//       let allPosts = await req.models.Post.find()
//       const postData = await Promise.all (allPosts.map(async post => {
//         try{
//           htmlPreview = await getURLPreview(post.url)
//         } catch{
//           htmlPreview = error.message
//           res.send('error')
//         }
//         return { description: post.description, htmlPreview: `Error: ${error.message}` };
//       }));
//       res.json(postData)
//     } catch(error) {
//       console.log("Error:", error)
//       res.status(500).json({"status": "error", "error": error})
//     }
//   });

router.get('/', async (req, res) => {
  try {
      const posts = await req.models.Post.find(); 
      const postData = await Promise.all(posts.map(async post => {
          try {
              const htmlPreview = await getURLPreview(post.url);
              return { description: post.description, htmlPreview };
          } catch (error) {
              return { description: post.description, htmlPreview: `Error: ${error.message}` };
          }
      }));
      res.json(postData);
  } catch (error) {
      console.error(error);
      console.log('here is the problem 2')
      res.status(500).json({ status: "error", error: error.message }); // Send a 500 status on error
  }
});

export default router;

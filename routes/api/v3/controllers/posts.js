import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

const escapeHTML = str => String(str).replace(/[&<>'"]/g, 
    tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag]));

//TODO: Add handlers here
router.post('/', async (req, res) => {
    if (req.session.isAuthenticated) {
        let reqBody = req.body
        try{
            let comingPost = new req.models.Post({
                url: reqBody.url,
                username: req.session.account.username,
                description: reqBody.description,
            })
            
            await escapeHTML(comingPost).save()
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
    let username = req.query.username
  try {
    let posts = []
    if (username) {
        posts = await req.models.Post.find({username: username});
    } else {
        posts = await req.models.Post.find();
    }
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

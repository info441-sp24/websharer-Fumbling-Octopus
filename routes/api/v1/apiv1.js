import express from 'express';
var router = express.Router();
import fetch from 'node-fetch'
import parser from 'node-html-parser'

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/urls/preview', async (req, res, next)=>{
  try {
    const queryString = req.query.url
    const fetchQuery = await fetch(queryString)

  if(!fetchQuery.ok) {
    throw new Error('failure on fetching URL')
  }

    const pageText = await fetchQuery.text()


    //parse html
    const htmlPageContent = parser.parse(pageText)

    const findUrl = htmlPageContent.querySelector("meta[property='og:url']")
    const findImage = htmlPageContent.querySelector("meta[property='og:image']")
    const findTitle = htmlPageContent.querySelector("meta[property='og:title']")
    const findDescription = htmlPageContent.querySelector("meta[property='og:description']")

    let url = findUrl ? findUrl.getAttribute('content') : queryString;
    let title = findTitle ? findTitle.getAttribute('content') : (htmlPageContent.querySelector('title') ? htmlPageContent.querySelector('title').innerHTML : queryString);
    let image = findImage ? findImage.getAttribute('content') : '';
    let description = findDescription ? findDescription.getAttribute('content') : '';


    const htmlDisplay = 
      `<div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center;">
        <a href="${url}">
            <p><strong>${title}
            </strong></p>
            <img src= ${image} style="max-height: 200px; max-width: 270px;">
        </a>
        <p>${description}</p>
      </div>`;

    res.setHeader('Content-Type', 'text/html');
    res.send(htmlDisplay);

  } catch (err) {
    console.log(err)
    res.status(500).send("Error html content")
  }
})

export default router;
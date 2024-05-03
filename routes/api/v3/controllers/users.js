import express from 'express';
var router = express.Router();

router.get("api/v3/users/myIdentity", async (req, res) => {
    try {
        if (req.session.isAuthenticated) {
            res.json({
                
                    status: "loggedin", 
                    userInfo: {
                       name: req.session.account.name, 
                       username: req.session.account.username}
                 
            })
        } else {
            res.json({
                status: "loggedout"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send("Cannot login")
    }
})
import express from 'express';
const router = express.Router();

router.post("/", async (req, res) => {
    if (req.session.isAuthenticated) {
        let username = req.session.account.username;
        console.log("username(test): " + username);
        let email = req.body.useremail;
        let favoriteDonut = req.body.favoriteDonut;
        let created_date = req.body.created_date;
        try {
            let filter = { username: username };
            let update = { email: email, favoriteDonut: favoriteDonut, created_date: created_date };
            let options = { upsert: true, new: true };
            await req.models.User.findOneAndUpdate(filter, update, options);
            res.status(200).json({"status": "success"});
        } catch (error) {
            res.status(500).json({"status": "error", "error": error.message});
        }
    } else {
        return res.status(401).json({status: "error", error: "not logged in"});
    }
});

router.get("/", async (req, res) => {
    if (req.session.isAuthenticated) {
        let username = req.query.username;
        try {
            let userInfo = await req.models.User.findOne({ username });
            if (!userInfo) {
                return res.status(401).json({userInfo: "not found", created_date: "not found"});
            }
            res.json(userInfo);
        } catch (error) {
            res.status(500).json({"status": "error", "error": error.message});
        }
    } else {
        return res.status(401).json({status: "error", error: "not logged in"});
    }  
});

export default router;
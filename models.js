

import mongoose from 'mongoose';

let models = {};
main();

async function main() {
    console.log("Connect to mongoDB");
    await mongoose.connect("mongodb+srv://jh345:jh345@cluster0.wxwxdi1.mongodb.net/");


    const postSchema = new mongoose.Schema({
        url: String,
        username: String,
        description: String,
        likes: [String],
        created_date: Date
    });
    models.Post = mongoose.model('Post', postSchema);
    console.log("Post Model created");

    const commentSchema = new mongoose.Schema({
        username: String,
        comment: String,
        post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
        created_date: Date
    });
    models.Comment = mongoose.model('Comment', commentSchema);
    console.log("Comment Model created");

    const userSchema = new mongoose.Schema({
        username: String,
        email: String,
        favoriteDonut: String,
        created_date: { type: Date, default: Date.now }
    });
    models.User = mongoose.model('User', userSchema);
    console.log("User Model created");
}

export default models;

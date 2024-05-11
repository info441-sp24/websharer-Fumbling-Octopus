import mongoose from 'mongoose'

let models = {}

console.log("connecting to mongodb")
//TODO: Add your mongoDB connection string (mongodb+srv://...)
await mongoose.connect("mongodb+srv://jh345:jh345@cluster0.wxwxdi1.mongodb.net/")

console.log("successfully connected to mongodb")

const postSchema = new mongoose.Schema({
    url: String,
    description: String,
    username: { type: String, required: true },
    likes: [String],
    created_date: Date
})
const commentSchema = new mongoose.Schema({
    username: { type: String, required: true },
    comment: { type: String, required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    created_date: { type: Date, default: Date.now }
});
models.Post = mongoose.model('Post', postSchema)
models.Comment = mongoose.model('Comment', commentSchema);


console.log("mongoose models created")

export default models

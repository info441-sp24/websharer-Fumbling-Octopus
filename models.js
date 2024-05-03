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
    created_date: Date
})

models.Post = mongoose.model('Post', postSchema)

console.log("mongoose models created")

export default models

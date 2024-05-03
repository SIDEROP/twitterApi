import app from "./app.js"
import dbConnection from "./db/connect.js"
import {STATIC_PORT} from "./constants.js"

let PORT = process.env.NODE_PORT || STATIC_PORT

// server connection 
dbConnection().then(()=>{
    try {
        app.listen(PORT,()=>{
            console.log(`serv is runnnn ${PORT}`)
        })
    } catch (error) {
        console.log("serv not runn this port **** ")
        process.exit(1)
    }
})









































// // Import required modules
// import express from "express"
// import mongoose from "mongoose"

// // Initialize express app
// const app = express();
// const PORT = 3000;

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/dbs', { useNewUrlParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;

// // Define user schema
// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   age: Number
// });

// // Define post schema
// const postSchema = new mongoose.Schema({
//   title: String,
//   content: String,
//   author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
// });

// // Create user model
// const User = mongoose.model('User', userSchema);

// // Create post model
// const Post = mongoose.model('Post', postSchema);

// // Middleware to parse JSON
// app.use(express.json());

// // Routes
// // Create a new user
// app.post('/users', async (req, res) => {
//   try {
//     const newUser = new User(req.body);
//     await newUser.save();
//     res.status(201).send(newUser);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // Get all users
// app.get('/users', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.send(users);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Create a new post
// app.post('/posts', async (req, res) => {
//   try {
//     const newPost = new Post(req.body);
//     await newPost.save();
//     res.status(201).send(newPost);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // Get all posts with authors populated
// app.get('/posts', async (req, res) => {
//   try {
//     const posts = await Post.find().populate("author")
//     res.send(posts);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
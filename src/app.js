import express from "express";
import cors from "cors"
import cookieParser from 'cookie-parser';

// import routes 
import userRouter from "./routes/user.Routes.js"
import userPost from "./routes/userPost.Routes.js"
import userComment from "./routes/userComment.Routes.js"
import userBookmark from "./routes/user.Bookmark.Routes.js"

let app = express();
// using middlewares
app.use(express.json({limit:"20kb"}))
app.use(cors({origin:"*",credentials:true}))
app.use(express.static("public"))
app.use(cookieParser());

// using routes
app.use("/v1",userRouter)
app.use("/v1",userPost)
app.use("/v1",userComment)
app.use("/v1",userBookmark)

app.get("/",(req,res)=>{
    res.send("<h1>hello</h>")
})

export default  app
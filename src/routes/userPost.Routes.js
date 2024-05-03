import { Router } from "express"
import upload from "../middlewares/multer.js"

import {
    Views,
    createPost,
    deletePostById,
    getPosts,
    getUserPost,
    likePost,
    updatePostById
} from "../controllers/userPostContr.js"

let router = Router()
// create routing 
router.route("/createpost").post(upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]),createPost)
router.route("/getpost").get(getPosts)
router.route("/getuserpost/:userId").post(getUserPost)
router.route("/updatepost/:id").put(upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]),updatePostById)
router.route("/deletepost/:id").delete(deletePostById)

// Like post fun
router.route("/likepost/:userId/:postId").put(likePost)

router.route("/views/:postId").put(Views)

export default router
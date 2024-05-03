import { Router } from "express"
import upload from "../middlewares/multer.js"

import {
    createComment,
    deleteComment,
    likeComment,
    updateComment
} from "../controllers/userComment.js"

let router = Router()
// create routing 
router.route("/createComment").post(createComment)
router.route("/updatecomment/:id").put(updateComment)
router.route("/deletecomment/:id").delete(deleteComment)

router.route("/likecomment/:userId/:commentId").put(likeComment)

export default router
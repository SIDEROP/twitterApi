import { Router } from "express";

import { 
    toggleBookmark,
    getUserBookmarks,
} from "../controllers/userBookmark.js";

let router = Router();
// create routing
router.route("/getbookmarks/:userId").post(getUserBookmarks);
router.route("/addbookmark/:userId/:postId").post(toggleBookmark);

export default router;

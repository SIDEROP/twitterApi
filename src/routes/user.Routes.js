import { Router } from "express";
import upload from "../middlewares/multer.js";
import {
  searchApi,
  toggleFollow,
  userLogin,
  userProtected,
  userRegistered,
} from "../controllers/userContr.js";

let router = Router();
// create routing
router.route("/registered").post(upload.single("image"), userRegistered);
router.route("/login").post(userLogin);
router.route("/protected/:token").post(userProtected);

router.route("/follow/:userId/:otherUserId").put(toggleFollow);
router.route("/search/:userName").post(searchApi);

export default router;

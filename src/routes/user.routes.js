import { Router } from "express";
import { resgisterUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.post("/register", upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverimage",
        maxCount: 1
    }
]),  resgisterUser)

export default router
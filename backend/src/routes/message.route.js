import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { getUsersInContact } from "../controllers/message.controller.js"

const router = express.Router()

router.get("/contacts", protectRoute, getUsersInContact)

export default router
import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { getAllContacts, getPersonalMessages, getUsersInContact, sendMessage } from "../controllers/message.controller.js"
import { updateContact } from "../lib/utils.js"

const router = express.Router()

router.get("/get/:id", protectRoute, getPersonalMessages)
router.post("/send/:messageType", protectRoute, sendMessage)

router.get("/contacts", protectRoute, getUsersInContact)
router.get("/contacts/all-contact", protectRoute, getAllContacts)


export default router
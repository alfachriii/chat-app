import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { getAllContacts, getChatList, getLastMessages, getPersonalMessages, getUndeliveredMessageIds, sendMessage } from "../controllers/message.controller.js"
import { updateContact } from "../lib/utils.js"

const router = express.Router()

router.get("/get/:id", protectRoute, getPersonalMessages)
router.get("/last", protectRoute, getLastMessages)
router.get("/undelivered", protectRoute, getUndeliveredMessageIds)
router.post("/send/:messageType", protectRoute, sendMessage)

router.get("/get-chat-list", protectRoute, getChatList)

// router.get("/contacts", protectRoute, getUsersInContact)
router.get("/contacts/all-contact", protectRoute, getAllContacts)


export default router
import { findUsersByIds } from "../lib/utils.js"
import Contact from "../models/contact.model.js"

export const getUsersInContact = async (req, res) => {
    try {
        const contactId = req.user.contactId
        const contact = await Contact.findById(contactId)
        let userIds = []
        contact.contactList.forEach(element => {
            userIds.push(element.userId)
        });

        const contacts = await findUsersByIds(userIds)
        console.log(contacts)
        res.status(200).json(contacts)
    } catch (error) {
        console.error("Error in getUserInContact: ", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}
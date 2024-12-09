import { findUsersByEmails } from "../lib/utils.js"
import Contact from "../models/contact.model.js"
import User from "../models/user.model.js"

export const getUsersInContact = async (req, res) => {
    try {
        const contactId = req.user.contactId
        const contact = await Contact.findById(contactId)
        let userIds = []
        contact.contactList.forEach(element => {
            userIds.push(element.email)
        });

        const contacts = await findUsersByEmails(userIds)
        res.status(200).json(contacts)
    } catch (error) {
        console.error("Error in getUserInContact: ", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getAllContacts = async (req, res) => {
    const userId = req.user._id
    try {
        const contacts = await User.find({ _id: { $ne: userId }})
        res.status(200).json(contacts)
    } catch (error) {
        console.log("Error on get all contacts controller: ", error)
        res.status(500).json({ message: "Internal server error"})
    }
}
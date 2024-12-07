import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contactList: [
        {
            userId: { type: String, required: true, unique: true }
        },
    ]
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
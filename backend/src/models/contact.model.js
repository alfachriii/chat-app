import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    user: { // Penting: gunakan _id yang sama dengan user
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User' // Referensi balik ke model User (opsional, tapi disarankan)
    },
    contactList: [{ // Array dari ObjectId yang mereferensikan User lain
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;

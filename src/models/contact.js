import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
 firstName: {
  type: String,
  required: [true, "Please provide a first name!"],
 
 },
    lastName: {
    type: String,
    required: [true, "Please provide a last name!"],
 
    },
    email: {
        type: String,
        required: [true, "Please provide an email!"],
        unique: true,
    },
    phone: {
        type: Number,
        required: [true, "Please provide a phone number!"],
        unique: true,
    },
    message: {
        type: String,
        required: [true, "Please provide a message!"],
    },

})

const Contact = mongoose.models.contacts || mongoose.model("contacts", contactSchema); //if user collection is already created then use that else create one as user.

export default Contact;
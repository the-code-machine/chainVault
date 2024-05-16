import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    ethreumAddress: {
        type: String,
        required: [true, "Please provide a ethereum address!"],
        unique: true,
    },
    name: {
        type: String,
        required: [true, "Please provide a name!"],
        unique: true,
    },
   

})

const User = mongoose.models.users || mongoose.model("users", userSchema); //if user collection is already created then use that else create one as user.

export default User;
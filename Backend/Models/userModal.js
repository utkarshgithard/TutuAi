import mongoose, { model } from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: function () {
            // Password is required only if the user is not a Google user
            return !this.isGoogleUser;
        }
    },
    isGoogleUser: {
        type: Boolean,
        default: false
    }
});

const userModel = new model('user', UserSchema)

export default userModel;
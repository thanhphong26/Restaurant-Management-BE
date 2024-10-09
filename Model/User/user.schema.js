import mongoose from "../Mongoose/mongoose.js";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "customer", "staff","manager"],
    },
    last_name: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    cid: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png",
    },
    point: {
        type: Number,
        default: 0,
        validate:{
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        },
    },
    save_voucher: {
        type: Array,
        default: [],
    },
    }
);
const User = mongoose.model("User", userSchema);
export default User;
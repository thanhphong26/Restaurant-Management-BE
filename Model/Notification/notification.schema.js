import mongoose from "../Mongoose/mongoose.js";
const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['read', 'unread'],
        default: 'unread',
    }
});
const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
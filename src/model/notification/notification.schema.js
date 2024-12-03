import { mongoose, Schema } from "mongoose";
const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['shift', 'booking'], //shift: thông báo xin nghỉ, booking: thông báo đặt bàn
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    list_receiver: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    status: {
        type: String,
        enum: ['read', 'unread'],
        default: 'unread',
    }
});
const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
import mongoose from "../Mongoose/mongoose.js";
const staffSchema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
        min: 0,
    },
    type: {
        type: String,
        required: true,
        enum: ['full-time', 'part-time'],
    },
    point: {
        type: Number,
        default: 0,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        },
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    }
});
const Staff = mongoose.model("Staff", staffSchema);
export default Staff;
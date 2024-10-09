import mongoose from "../Mongoose/mongoose.js";
const timeKeepingSchema = new mongoose.Schema({
    staff_id: {
        type: Schema.Types.ObjectId,
        ref: 'Staff',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    check_in: Date,
    check_out: Date,
    status: {
        type: String,
        enum: ['present', 'absent', 'late'],
        default: 'absent',
    }
});
const TimeKeeping = mongoose.model("TimeKeeping", timeKeepingSchema);
export default TimeKeeping;
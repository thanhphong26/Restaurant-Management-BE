import { mongoose, Schema } from 'mongoose';
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
    check_out: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'late', 'early_leave', 'late_with_overtime', 'overtime', 'late_and_early_leave'],
        default: 'absent',
    }
});
const TimeKeeping = mongoose.model("TimeKeeping", timeKeepingSchema);
export default TimeKeeping;
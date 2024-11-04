import { mongoose, Schema } from 'mongoose';
const timeKeepingSchema = new mongoose.Schema({
    staff_id: {
        type: Schema.Types.ObjectId,
        ref: 'Staff',
        required: true,
    },
    shift_id: {
        type: Schema.Types.ObjectId,
        ref: 'Shift',
        required: true,
    },
    check_in: Date,
    check_out: {
        type: Date,
        default: null,
    },
    status_check_in: {
        type: String,
        enum: ['ontime', 'late', 'early'],
    },
    status_check_out: {
        type: String,
        enum: ['ontime', 'late', 'early'],
        default: null,
    }
});
const TimeKeeping = mongoose.model("TimeKeeping", timeKeepingSchema);
export default TimeKeeping;


/*
    check in và check out sẽ theo shift
    nếu check in trước thời gian thì là early
    nếu check in trễ 5' thì là ontime
    nếu check in sau thời gian đó thì là late

    nếu check out trước thời gian thì là early
    nếu check out trễ 1h thì là ontime
*/
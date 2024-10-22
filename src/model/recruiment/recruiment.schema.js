import { Schema, mongoose } from "mongoose";

const recruimentSchema = new mongoose.Schema({
    position: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
        min: 0,
    },
    start_date: {
        type: Date,
        required: true,
    },
    address: String,
    describe: String,
    require: String,
    infomation: String,
    type: String,
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    }
});
const Recruiment = mongoose.model("Recruiment", recruimentSchema);
export default Recruiment;
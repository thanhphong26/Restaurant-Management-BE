import mongoose from "../Mongoose/mongoose.js";
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
});
const Recruiment = mongoose.model("Recruiment", recruimentSchema);
export default Recruiment;
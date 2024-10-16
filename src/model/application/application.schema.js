import mongoose from "../mongoose/mongoose.js";
const applicationSchema = new mongoose.Schema({
    recruitment_id: {
        type: Schema.Types.ObjectId,
        ref: 'Recruitment',
        required: true,
    },
    full_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    cid: {
        type: String,
        required: true,
        unique: true,
    },
    address: String,
    dob: Date,
    about: String,
    require: String,
});
const Application = mongoose.model("Application", applicationSchema);
export default Application;
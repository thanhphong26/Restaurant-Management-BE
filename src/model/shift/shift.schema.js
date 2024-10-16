import mongoose from "../mongoose/mongoose.js";
const shiftSchema = new mongoose.Schema({
    list_staff: [{
        type: Schema.Types.ObjectId,
        ref: 'Staff'
    }],
    date: {
        type: Date,
        required: true,
    },
    shift_number: {
        type: Number,
        enum: [1, 2, 3],
        required: true,
    }
});
const Shift = mongoose.model("Shift", shiftSchema);
export default Shift;
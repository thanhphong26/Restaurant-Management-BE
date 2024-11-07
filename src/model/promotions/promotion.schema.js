import { mongoose, Schema } from "mongoose";
const promotionSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    description: String,
    quantity: {
        type: Number,
        min: 0,
        required: true
    },
    discount: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    condition: Number || 0,
    type: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true,
    }, 
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    }
});
const Promotion = mongoose.model("Promotion", promotionSchema);
export default Promotion;
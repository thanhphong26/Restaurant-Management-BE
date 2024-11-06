import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    inventory: {
        type: Number,
        required: true,
        min: 0,
    },
    unit: {
        type: String,
        enum: ['kg', 'l'],
        required: true,
    },
    description: String,
    type: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    }
}, { timestamps: true});
ingredientSchema.plugin(mongoosePaginate);
const Ingredient = mongoose.model("Ingredient", ingredientSchema);
export default Ingredient;
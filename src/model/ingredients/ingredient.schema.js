import mongoose from "../mongoose/mongoose.js";
const ingredientSchema = new mongoose.Schema({
    ingredient_id: {
        type: Schema.Types.ObjectId,
        ref: 'Ingredient',
        required: true,
    },
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
});
const Ingredient = mongoose.model("Ingredient", ingredientSchema);
export default Ingredient;
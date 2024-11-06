import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const updateIngredientSchema = new mongoose.Schema({
    ingredient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient',
        required: true,
        index: true,
    },
    quantity: {
        type: Number,
        validate:{
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        },
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        index: true,
    },
    supplier: String,
    expiration_date: Date,
    description: String,
    price: {
        type: Number,
        min: 0,
    },
    type: {
        type: String,
        enum: ['import', 'export'],
        required: true,
    }
}, { timestamps: true });
updateIngredientSchema.plugin(mongoosePaginate);
const UpdateIngredient = mongoose.model("UpdateIngredient", updateIngredientSchema);
export default UpdateIngredient;
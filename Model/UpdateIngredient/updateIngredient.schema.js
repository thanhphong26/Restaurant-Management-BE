import mongoose from "../Mongoose/mongoose.js";
const updateIngredientSchema = new mongoose.Schema({
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
    },
    expiration_date: Date,
    description: String,
    type: {
        type: String,
        enum: ['import', 'export'],
        required: true,
    }
});
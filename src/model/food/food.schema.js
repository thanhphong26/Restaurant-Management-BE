import mongoose from "mongoose";
const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
      },
      image: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      description: String,
      type: {
        type: String,
        required: true
      },
      status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available'
      }
});
const Food = mongoose.model("Food", foodSchema);
export default Food;
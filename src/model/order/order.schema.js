import { mongoose, Schema } from "mongoose";
const orderSchema = new mongoose.Schema({
  food_id: {
    type: Schema.Types.ObjectId,
    ref: 'Food',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'served', 'canceled'],
    default: 'pending'
  }
});
const Order = mongoose.model("Order", orderSchema);
export default Order;
import { mongoose, Schema } from "mongoose";
const tableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  seats: {
    type: Number,
    required: true,
    min: 1
  },
  type: {
    type: String,
    enum: ['normal', 'VIP'],
    required: true
  },
  tip: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved'],
    default: 'available'
  }
});
const Table = mongoose.model("Table", tableSchema);
export default Table;
import mongoose from "../mongoose/mongoose.js";
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
      type: String,
      tip: Number,
      status: {
        type: String,
        enum: ['available', 'occupied', 'reserved'],
        default: 'available'
      }
});
const Table = mongoose.model("Table", tableSchema);
export default Table;
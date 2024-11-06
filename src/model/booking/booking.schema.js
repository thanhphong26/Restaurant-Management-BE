import { Schema, mongoose } from "mongoose";
const bookingSchema = new mongoose.Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true
  },
  table_id: {
    type: Schema.Types.ObjectId,
    ref: 'Table',
    required: true
  },
  order_detail: [{
    type: Schema.Types.ObjectId,
    ref: 'Order',
    default: []
  }],
  note: {
    type: String,
    default: ''
  },
  total: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  voucher: {
    type: String,
    default: ''
  },
  payment_method: {
    type: String,
    enum: ['cash', 'credit_card', 'debit_card', 'mobile_payment'],
    default: null
  },
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  list_staff: [{
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    default: null
  }],
  comment: {
    type: String,
    default: null
  },
  rate: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  }
});
const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;    
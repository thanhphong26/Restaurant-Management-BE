import mongoose from "../Mongoose/mongoose.js";
const bookingSchema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      date: {
        type: Date,
        required: true
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
      order_detail: [orderSchema],
      note: String,
      total: {
        type: Number,
        required: true,
        min: 0
      },
      voucher: String,
      payment_method: {
        type: String,
        enum: ['cash', 'credit_card', 'debit_card', 'mobile_payment'],
        required: true
      },
      payment_status: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
      },
      list_staff: [{
        type: Schema.Types.ObjectId,
        ref: 'Staff'
      }],
      comment: String,
      point: {
        type: Number,
        default: 0
      },
      status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'completed'],
        default: 'confirmed'
      }
    });
const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;    
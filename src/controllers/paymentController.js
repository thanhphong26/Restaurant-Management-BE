import bookingService from '../services/bookingService.js';
import paymentService from '../services/paymentService.js';

const createPayment = async (req, res) => {
    try {
        let response = await paymentService.createPayment(req.query.bookingId, req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            EC: 1,
            EM: 'Internal Server Error',
            DT: ""
        });

    }
}
const callbackPayment = async (req, res) => {
    // cập nhật dữ liệu vào database ()
    const { amount, extraData, payType } = req.body;
    let [bookingId, voucher] = extraData.split(" ");
    // cập nhật dữ liệu vào database
    const data = {
        voucher,
        payment_method: payType,
        amount: amount
    }
    await bookingService.payment(bookingId, data);
}
export default {
    createPayment,
    callbackPayment
}
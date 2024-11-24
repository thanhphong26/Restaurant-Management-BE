import bookingService from '../services/bookingService.js';
import paymentService from '../services/paymentService.js';

const createPayment = async (req, res) => {
    try {
        let response = await paymentService.createPayment(req.body.id, req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            EC: 1,
            EM: 'Internal Server Error',
            DT: ""
        });

    }
}
const createDeposit = async (req, res) => {
    try {
        let response = await paymentService.createDeposit(req.user.id, req.body);
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
        total: amount
    }
    await bookingService.payment(bookingId, data);
}

const handleDepositCallback = async (req, res) => {
    try{
        const rawExtraData = req.body.extraData; // Lấy raw extraData
        const extraData = JSON.parse(rawExtraData);

        const bookingResult = await bookingService.createBooking(extraData.user_id, extraData.table, extraData.booking, extraData.depositCost);
        if(bookingResult){
            return res.status(200).json({
                EC: 0,
                EM: 'Tạo booking thành công',
                DT: bookingResult
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 1,
            EM: 'Internal Server Error',
            DT: ""
        });
    }
};

export default {
    createPayment,
    callbackPayment,
    createDeposit,
    handleDepositCallback
}
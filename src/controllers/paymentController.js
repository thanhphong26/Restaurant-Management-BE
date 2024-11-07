import { generateVNPayUrl, verifyReturnUrl } from '../services/vnpay.js';

export const createPayment = (req, res) => {
    const { amount, orderId, orderInfo } = req.body;

    const paymentUrl = generateVNPayUrl(amount, orderId, orderInfo);

    res.json({ paymentUrl });
};

export const handleReturnUrl = (req, res) => {
    const query = req.query;

    const isValid = verifyReturnUrl(query);

    if (isValid) {
        res.json({ message: 'Payment verified successfully', data: query });
    } else {
        res.status(400).json({ message: 'Invalid payment response' });
    }
};

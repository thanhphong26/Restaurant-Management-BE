import dotenv from 'dotenv';
import crypto from 'crypto';
import querystring from 'qs';

dotenv.config();

// Hàm tạo URL thanh toán
const generateVNPayUrl = (amount, orderId, orderInfo) => {
    const vnp_TmnCode = process.env.VNP_TMN_CODE;
    const vnp_HashSecret = process.env.VNP_HASH_SECRET;
    const vnp_Url = process.env.VNP_URL;
    const vnp_ReturnUrl = process.env.VNP_RETURN_URL;

    const date = new Date();
    const vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode,
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: 'billpayment',
        vnp_Amount: amount * 100, // Chuyển sang đơn vị đồng
        vnp_ReturnUrl,
        vnp_IpAddr: '127.0.0.1',
        vnp_CreateDate: date.toISOString().replace(/[-:TZ.]/g, '').slice(0, 14) // Định dạng YYYYMMDDHHMMSS
    };

    // Sắp xếp tham số theo thứ tự bảng chữ cái
    const sortedParams = sortObject(vnp_Params);

    // Tạo chuỗi dữ liệu để ký
    const signData = querystring.stringify(sortedParams, { encode: false });

    // Tạo chữ ký HMAC SHA512
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const secureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Thêm chữ ký vào URL thanh toán
    sortedParams.vnp_SecureHash = secureHash;
    const paymentUrl = `${vnp_Url}?${querystring.stringify(sortedParams)}`;

    return paymentUrl;
};

// Hàm sắp xếp các tham số theo thứ tự bảng chữ cái
const sortObject = (obj) => {
    const sorted = {};
    Object.keys(obj).sort().forEach((key) => {
        sorted[key] = obj[key];
    });
    return sorted;
};

// Hàm xác minh chữ ký phản hồi từ VNPay
const verifyReturnUrl = (query) => {
    const vnp_HashSecret = process.env.VNP_HASH_SECRET;
    const secureHash = query.vnp_SecureHash;
    delete query.vnp_SecureHash;
    delete query.vnp_SecureHashType;

    const sortedParams = sortObject(query);
    const signData = querystring.stringify(sortedParams, { encode: false });

    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const checkSum = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    return secureHash === checkSum;
};

export { generateVNPayUrl, verifyReturnUrl };

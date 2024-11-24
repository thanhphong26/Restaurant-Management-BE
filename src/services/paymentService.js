import axios from 'axios';
import crypto from 'crypto';

const createPayment = async (bookingId, paymentData) => {
    const { total, voucher } = paymentData;
    var accessKey = 'F8BBA842ECF85';
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var orderInfo = 'pay with MoMo';
    var partnerCode = 'MOMO';
    var redirectUrl = 'http://localhost:/5173';
    var ipnUrl = 'https://d4f9-115-73-221-4.ngrok-free.app/api/payment/callback';
    var requestType = "payWithMethod";
    var amount = total;
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData = bookingId + ' ' + voucher;
    var orderGroupId = '';
    var autoCapture = true;
    var lang = 'vi';

    //before sign HMAC SHA256 with format
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;

    //puts raw signature
    var signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature
    });

    const options = {
        url: 'https://test-payment.momo.vn/v2/gateway/api/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody),
        },
        data: requestBody
    }
    let result
    try {
        result = await axios(options)
        return {
            EC: 0,
            EM: 'Tạo thanh toán thành công',
            DT: result.data
        }
    } catch (error) {
        return {
            EC: 1,
            EM: 'Internal Server Error',
            DT: ""
        }
    }
}

const createDeposit = async (userId, depositData) => {
    const { booking, table, total } = depositData;
    const depositAmount = total; 

    const accessKey = 'F8BBA842ECF85';
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const partnerCode = 'MOMO';
    const orderInfo = 'Deposit for booking';
    const redirectUrl = 'http://localhost:5173/account';
    const ipnUrl = 'https://e907-115-73-221-4.ngrok-free.app/api/deposit/callback';
    const requestType = "payWithMethod";
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const extraData = JSON.stringify({
        user_id: userId,
        booking,        
        table,
        depositCost: total,           
    });
    const lang = 'vi';
    const autoCapture = true;

    // Generate raw signature
    const rawSignature = `accessKey=${accessKey}&amount=${depositAmount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    // Create request body
    const requestBody = JSON.stringify({
        partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId,
        amount: depositAmount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        lang,
        requestType,
        autoCapture,
        extraData,
        signature
    });

    const options = {
        url: 'https://test-payment.momo.vn/v2/gateway/api/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody),
        },
        data: requestBody,
    };

    try {
        const result = await axios(options);
        return {
            EC: 0,
            EM: 'Tạo yêu cầu đặt cọc thành công',
            DT: result.data,
        };
    } catch (error) {
        console.error("Lỗi tạo đặt cọc:", error.message);
        return {
            EC: 1,
            EM: 'Không thể tạo đặt cọc',
            DT: null,
        };
    }
};


export default {
    createPayment,
    createDeposit,
}
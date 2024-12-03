import cors from 'cors';
const corsConfig = cors({
    origin: ['http://localhost:5173'], //chỉ cho phép các domain này gửi request
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], //chỉ cho phép các phương thức này
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Fingerprint'], //cho phép các header này
    credentials: true,
});
export default corsConfig;


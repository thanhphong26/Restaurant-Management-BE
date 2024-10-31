import cors from 'cors';
const corsConfig = cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Fingerprint'],
    exposedHeaders: ['New-Token', 'Token-Expiry'],
    credentials: true,
});
export default corsConfig;
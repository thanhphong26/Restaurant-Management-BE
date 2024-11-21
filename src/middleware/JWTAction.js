import jwt from 'jsonwebtoken';

const JWT_SECRET = 'pntpnt0123456789';

export const authentication = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    const err = new Error("Bạn không có quyền truy cập");
    err.statusCode = 401;
    return next(err);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        const expiredError = new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
        expiredError.statusCode = 401;
        return next(expiredError);
      }
      const invalidTokenError = new Error("Token không hợp lệ");
      invalidTokenError.statusCode = 403;
      return next(invalidTokenError);
    }
    req.user = user;
    next();
  });
};

export const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      const noAccessError = new Error("Bạn không có quyền truy cập");
      noAccessError.statusCode = 401;
      return next(noAccessError);
    }

    if (!roles.includes(req.user.role)) {
      const accessDeniedError = new Error(`Truy cập bị từ chối. Chỉ ${roles.join(', ')} có quyền truy cập`);
      accessDeniedError.statusCode = 403;
      return next(accessDeniedError);
    }
    next();
  };
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || "Lỗi hệ thống";
  
  res.status(statusCode).json({
    EC: statusCode,
    EM: errorMessage,
    DT: ""
  });
};

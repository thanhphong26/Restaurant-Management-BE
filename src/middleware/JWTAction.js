import jwt from 'jsonwebtoken';

const JWT_SECRET = 'pntpnt0123456789'; 
export const authentication = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({
      EC: 401,
      EM: "Bạn không có quyền truy cập",
      DT: ""
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if(err){
      if(err.name === 'TokenExpiredError'){
        return res.status(401).json({
          EC: 401,
          EM: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại",
          DT: ""
        });
      }
      return res.status(403).json({
        EC: 403,
        EM: "Token không hợp lệ",
        DT: ""
      });
    }
    req.user = user;
    next();
  });
};

export const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        EC: 401,
        EM: "Bạn không có quyền truy cập",
        DT: ""
    });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        EC: 403,
        EM: `Access denied. Only ${roles.join(', ')} can access`,
        DT: ""
      });
    }
    next();
  };
};

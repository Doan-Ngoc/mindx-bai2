const jwt = require("jsonwebtoken");
const SECRET_KEY = "ABCDE";

function verifyUser(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Vui lòng đăng nhập" });
    }
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Token không hợp lệ" });
    }
}

module.exports = { verifyUser };
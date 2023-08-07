const jwt = require("jsonwebtoken");
const session = require("express-session");
const SECRET_KEY = "ABCDE"

function verifyUser(req, res, next) {
    const token = req.cookies.token || req.session.token

    if (!token) {
        return res.status(401).json({ error: "Vui lòng đăng nhập" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        if (req.session.token === null) {
            return res.status(401).json({ error: "Vui lòng đăng nhập" });
        }
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token không hợp lệ" });
    }
}

module.exports = { verifyUser };
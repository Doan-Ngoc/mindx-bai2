const {userCollection, getAllUsers} = require("../db")
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const express = require("express");
const lgin = express();

lgin.use(cookieParser());

const SECRET_KEY = "ABCDE";

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
     const allUsers = await getAllUsers();
     //await console.log("Danh sách user", allUsers)
     const user = allUsers.find((user) => user.username === username);
    //console.log("Current user:", user);
    if (!user || user.password !== password) {
      res.clearCookie("token");
      return res.status(401).json({ error: "Thông tin đăng nhập không hợp lệ" });
    }

    const token = jwt.sign({ username: user.username }, SECRET_KEY);

    res.locals.token = token;
    res.cookie("token", token, { httpOnly: true });
    next();
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Đăng nhập thất bại" });
  }
}

module.exports = { login };

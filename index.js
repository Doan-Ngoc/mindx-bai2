const express = require("express");
const { connectToDb, getInventories, orderWithProductDescriptions } = require("./db");
const path = require("path");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const { login } = require("./middleware/Login")
const { verifyUser } = require("./middleware/VerifyUser")
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();
connectToDb();
app.use(express.json());
app.use(express.static(path.join(__dirname, "pages"), { 'content-type': 'application/javascript' }));
app.use(express.static(path.join(__dirname)));
app.use(cookieParser());
app.use(session({
  secret: "my-secret-key",
  resave: false,
  saveUninitialized: true
}));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "home.html"));
});

app.get("/api/inventories", verifyUser, async (req, res) => {
  const { lowQuantity } = req.query;
  try {
    const inventories = await getInventories(lowQuantity);
    res.json(inventories);
  } catch (err) {
    console.error("Error fetching inventories:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "login.html"));
});


app.post("/login", login, (req, res) => {
  const token = res.locals.token;
  res.status(200).json({ access_token: token });
});


app.get("/api/orders", verifyUser, async (req, res) => {
  try {
    const ordersWithDescriptions = await orderWithProductDescriptions();
    res.json(ordersWithDescriptions);
  } catch (err) {
    console.error("Error fetching order information:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/logout", (req, res) => {
  req.session.token = null;
  res.status(200).send("<h1>Đăng xuất thành công</h1>");
});

app.listen(3000, () => {
  console.log("App is running at 3000");
})

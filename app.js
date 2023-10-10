const express = require("express");
const app = express();
const { productData } = require("./data/productData");
const { authenticateToken } = require("./auth/authToken");
const {
  handleCreateUser,
  handleUpdateUserById,
  handleDeleteUserById,
  getUser,
  getUserById,
} = require("./routes/userRoute");
const { handleLogin, handleRefreshToken } = require("./auth/login");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
} = require("./routes/productRoute");
const { generateTimestamp } = require("./datetime/datetime");
const { format } = require("date-fns");
require("dotenv").config();

//port
const port = 3000;
//app use
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
1.token
2.handleRefreshToken handle the logic and get the token when transmitting the refreshtoken
*/
app.post("/token", handleRefreshToken);
//get product to showwing data product

// default homepage
app.get("/", (req, res) => {
  res.send("hello world");
});
/*
1.CRUD User
*/
app.get("/users", authenticateToken, getUser);
app.post("/users", authenticateToken, handleCreateUser);
app.put("/users/:id", authenticateToken, handleUpdateUserById);
app.get("/users/:id", authenticateToken, getUserById);
app.delete("/users/:id", authenticateToken, handleDeleteUserById);
/*
2.CRUD Product
*/
app.get("/products", authenticateToken, getProducts);
app.get("/products/:id", authenticateToken, getProductById);
app.post("/products", authenticateToken, createProduct);
app.put("/products/:id", authenticateToken, updateProductById);
app.delete("/products/:id", authenticateToken, deleteProductById);
/*
1.login
2.hadleLogin Logic processing at handle Logic when the user logs in will return a refreshtoken and use this token to access, view, edit, and delete data.
*/
app.post("/login", handleLogin);

console.log("Hi");
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
});

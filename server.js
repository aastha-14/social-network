const express = require("express");
const app = express();
const connectDB = require("./config/db");

connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to the home page!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server sarted on port ${PORT}`);
});

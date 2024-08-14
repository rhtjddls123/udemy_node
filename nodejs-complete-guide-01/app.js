const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const adminRouter = require("./routes/admin.js");
const shopRouter = require("./routes/shop.js");

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminRouter);
app.use(shopRouter);
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(3000);

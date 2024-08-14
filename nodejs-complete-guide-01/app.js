const express = require("express");
const bodyParser = require("body-parser");
const adminRouter = require("./routes/admin.js");
const shopRouter = require("./routes/shop.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(adminRouter);
app.use(shopRouter);

app.listen(3000);

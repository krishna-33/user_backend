require('dotenv').config();

const express = require('express'); 
const cors = require('cors');
const path = require("path");
const port = process.env.SERVER_PORT || 3000;
require('./models')
const indexRouter = require('./routes');
const app = express(); 
app.use(express.json());

app.use(cors({ origin: true, credentials: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/', indexRouter);

app.listen(port, () => {
    try {
       console.log(`server conencted on port:${port}`);
    } catch (error) {}
 });
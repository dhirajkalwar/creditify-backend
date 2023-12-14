const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require('cors');
require('dotenv').config();
const connection = require('./db')
connection();
const app = express();

// const User = require("./models/userSchema");
//MiddleWare 
app.use(express.json());
app.use(cors({
    origin: 'https://creditify.vercel.app',
    credentials: true,
}));
app.use((req, res, next) => {
    res.header('Access-Control-Expose-Headers', 'jwtoken');
    res.setHeader('Access-Control-Allow-Origin', '*')
    next();
  });
app.use(cookieParser());

app.use(require('./routes/auth'));
app.use(require('./routes/routing'));
app.use(require('./routes/update'))
app.use(require('./routes/upload'));
app.use(require('./routes/api'));




const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is Running on ${port} port`);
})
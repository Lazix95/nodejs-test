const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const uuid = require('uuid/v4');

const authRoutes = require('./routes/auth');
const userRouts = require('./routes/user');
const categoriesRoutes = require('./routes/categories');
const productsRouter = require('./routes/products');
const qrRouter = require('./routes/qrCodes');
const ordersRouter = require('./routes/orders');
const staffRouter = require('./routes/staff');

const app = express();

const fileStorage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'images');
   },
   filename: (req, file, cb) => {
      cb(null, uuid() + '-' + file.originalname);
   }
});

const fileFilter = (req, file, cb) => {
   if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
   ) {
      cb(null, true);
   } else {
      cb(null, false);
   }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
   multer({storage: fileStorage, fileFilter: fileFilter}).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
   );
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   next();
});

app.use('/auth', authRoutes);
app.use('/', userRouts);
app.use('/', categoriesRoutes);
app.use('/', productsRouter);
app.use('/', qrRouter);
app.use('/', ordersRouter);
app.use('/', staffRouter);

app.use((error, req, res, next) => {
   console.log(error);
   const status = error.statusCode || 500;
   const message = error.message;
   const data = error.data;
   res.status(status).json({message: message, data: data});
});

mongoose
   .connect('mongodb://localhost:27017/messages', {useNewUrlParser: true, useCreateIndex: true})
   .then(result => {
      const server = app.listen(8080);
      const io = require('./socket').init(server);
      io.sockets.on('connection', function(socket) {
         // once a client has connected, we expect to get a ping from them saying what room they want to join
         console.log('client connected')
         socket.on('room', function(room) {
            socket.join(room);
         });
      });
   })
   .catch(err => console.log(err));

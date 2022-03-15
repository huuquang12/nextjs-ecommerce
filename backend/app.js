import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import formidableMiddleware from 'express-formidable';
import path from 'path';
import userRouter from './routers/userRouter.js';
import productRouter from './routers/productRouter.js';
import orderRouter from './routers/orderRouter.js';
// import uploadRouter from './routers/uploadRouter.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/nextjs-ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
// app.use('/api/uploads', uploadRouter);

//Khai báo suử dụng template pug
app.set("views", "./views");
app.set("view engine", "pug");
 
//Middleware parse form
app.use(
  formidableMiddleware({
    multiples: true
  })
);
//Khởi tạo route
app.get("/", (req, res) => {
  res.render("index");
});
 

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
  res.send('Server is ready');
});
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
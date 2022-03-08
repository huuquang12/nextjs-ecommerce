const express = require('express');
const app = express();
const mongo = require('mongodb');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser')



const adminRoutes = require('./routers/adminRouter');

const userRouter = require('./routers/userRouter');
// const productRouter = require('./router/productRouter');
// const orderRouter = require('./router/orderRouter');

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/webShopping";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ 
    extended: false 
}))

app.use('/api/users', userRouter);
// app.use('/api/products', productRouter);
// app.use('/api/orders', orderRouter);
// app.use('/api/uploads', uploadRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});


app.get('/', (req, res) => {
  res.send('Server is ready');
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
// import express from 'express';
// import paypal from 'paypal-rest-sdk';



// paypal.configure({
//     mode: "sandbox", //sandbox or live
//     client_id:
//         "AWfqqnqW4S0H0ssEgXfx7mWRT7l3Np0oA3VTRmDJnCRiQOS7etkWLm1WpGSS5Ysjkgn2QT_tYsHLIZjE",
//     client_secret:
//         "EElE7a8TABo6It9dlFC5Y9CvFoNvwLlZoNaZg4ewvyOevVHb34zYllVO5JlF5Q6SDQz1qiITftS8lZh1"
// });


// const paypalRouter = express();


// paypalRouter.post("/paypal",async (req,res) => {
//     const create_payment_json = {
//         "intent": "sale",
//         "payer": {
//             "payment_method": "paypal"
//         },
//         "redirect_urls": {
//             "return_url": "http://localhost:3000/success",
//             "cancel_url": "http://localhost:3000/cancel"
//         },
//         "transactions": [{
//             "item_list": {
//                 "items": [{
//                     "name": "Nike Air Max, Nike Jordan Mid, Nike Running, Nike Air OG, Nike Air OG, Nike Jump Man",
//                     "sku": "item",
//                     "price": "70.00",
//                     "currency": "USD",
//                     "quantity": 1
//                 }]
//             },
//             "amount": {
//                 "currency": "USD",
//                 "total": "70.00"
//             },
//         }]
//     };


//     paypal.payment.create(create_payment_json, function (error, payment) {
//         if (error) {
//             throw error;
//         } else {
//             for (let i = 0; i < payment.links.length; i++) {
//                 if (payment.links[i].rel === 'approval_url') {
//                     res.redirect(payment.links[i].href);
//                 }
//             }

//         }
//     });
// })
// paypalRouter.get('/success', (req, res) => {

//     const payerId = req.query.PayerID;
//     const paymentId = req.query.paymentId;

//     const execute_payment_json = {
//         "payer_id": payerId,
//         "transactions": [{
//             "amount": {
//                 "currency": "USD",
//                 "total": "70.00"
//             }
//         }]
//     };
//     paypal.payment.execute(paymentId, execute_payment_json, function(error, payment) {
//         if (error) {
//             console.log(error.response);
//             throw error;
//         } else {
//             console.log(JSON.stringify(payment));
//             res.send('Success (Mua hàng thành công)');
//         }
//     });
// });

// paypalRouter.get('/cancel',(req,res) => res.send('Cancelled (Đơn hàng đã hủy)'));



// export default paypalRouter;


import express from "express";
import { isAuth } from "../utils.js";

const paypalRouter = express.Router();

paypalRouter.get("/paypal", isAuth, async (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

export default paypalRouter;
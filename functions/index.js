const functions = require('firebase-functions');

const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_mKxjR7OiFHEy8Xffe74SfuqT00iSHYPvUy');

// API

// App Config
const app = express();
// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Api Routes
app.get('/', (req, res) => res.status(200).send('hello world'));

app.post('/payments/create', async (req, res) => {
  const total = req.query.total;
  console.log('Payment request received BOOM! for this amount >>>', total);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total, // subunits of the currency.
    currency: 'INR',
  });

  res.status(200).send({
      clientSecret: paymentIntent.client_secret,
  })

});

// Listen command
exports.api = functions.https.onRequest(app);

// end point
// http://localhost:5001/challenge-c438d/us-central1/api

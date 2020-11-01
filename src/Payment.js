import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useStateValue } from './StateProvider';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

import './Payment.css';
import CheckoutProduct from './CheckoutProduct';
import { getBasketTotal } from './reducer';
import CurrencyFormat from 'react-currency-format';
import axios from './axios';
import { db } from './firebase';

function Payment() {
  const [{ basket, user }, dispatch] = useStateValue();
  const history = useHistory();
  const stripe = useStripe();
  const elements = useElements();

  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState('');

  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState(true);

  useEffect(() => {
    // generate the special stripe secret with allows us to charge a customer
    let isMounted = true;
    const getClientSecret = async () => {
      const response = await axios({
        method: 'post',
        url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
      });
      if (isMounted) setClientSecret(response.data.clientSecret);
    };
    getClientSecret();
    return () => {
      isMounted = false;
    };
  }, [basket]);

  console.log('THE SECRET IS >>> ', clientSecret);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    const payload = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })
      .then(
        ({ paymentIntent }) => {
          // paymentIntent = payment confirmation
          db.collection('users')
            .doc(user?.uid)
            .collection('orders')
            .doc(paymentIntent.id)
            .set({
              basket: basket,
              amount: paymentIntent.amount,
              created: paymentIntent.created,
            });

          setSucceeded(true);
          setError(null);
          setProcessing(false);

          dispatch({
            type: 'EMPTY_BASKET',
          });

          history.replace('/orders');
        },
        (error) => {
          console.log('>>>>>', error);
        }
      );
  };

  const handleChange = (event) => {
    // listen for changed in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : '');
  };

  return (
    <div className='payment'>
      <div className='payment__container'>
        <h1>
          Checkout (<Link to='/checkout'>{basket?.length} items</Link>)
        </h1>

        {/* delivery address */}
        <div className='payment__section'>
          <div className='payment__title'>
            <h3>Delivery Address</h3>
          </div>
          <div className='payment__address'>
            <p>{user?.email}</p>
            <p>123 React Lane</p>
            <p>Los Angeles, CA</p>
          </div>
        </div>
        {/* review items */}
        <div className='payment__section'>
          <div className='payment__title'>
            <h3>Review items and delivery</h3>
          </div>
          <div className='payment__items'>
            {basket.map((item) => (
              <CheckoutProduct
                key={item.id}
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>
        {/* payment method */}
        <div className='payment__section'>
          <div className='payment__title'>
            <h3>Payment Method</h3>
          </div>
          <div className='payment__details'>
            {/* stripe magic will go */}
            <form onSubmit={handleSubmit}>
              <CardElement
                className='card'
                onChange={handleChange}
                options={{
                  style: {
                    base: {
                      backgroundColor: 'white',
                    },
                  },
                }}
              />

              <div className='payment__priceContainer'>
                <CurrencyFormat
                  renderText={(value) => <h3>Order Total: {value}</h3>}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'₹'}
                />
                <button disabled={processing || disabled || succeeded}>
                  <span>{processing ? <p>Processing</p> : 'Buy Now'}</span>
                </button>
              </div>
              {/* Error */}
              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;

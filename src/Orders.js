import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import './Orders.css';
import { useStateValue } from './StateProvider';
import Order from './Order';

function Orders() {
  const [{ basket, user }, dispatch] = useStateValue();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let isMounted = true;
    if (user) {
      db.collection('users')
        .doc(user?.uid)
        .collection('orders')
        .orderBy('created', 'desc')
        .onSnapshot((snapshot) => {
          if (isMounted) {
            setOrders(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
              }))
            );
          }
        });
    } else {
      setOrders([]);
      isMounted = false;
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <div className='orders'>
      <h1>Your Orders</h1>
      <div className='orders_order'>
        {orders.map((order, i) => (
          <Order key={i} order={order} />
        ))}
      </div>
    </div>
  );
}

export default Orders;

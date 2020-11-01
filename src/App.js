import './App.css';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import Header from './Header';
import Home from './Home';
import Checkout from './Checkout';
import Login from './Login';
import { auth } from './firebase';
import { useStateValue } from './StateProvider';
import { useEffect } from 'react';
import Payment from './Payment';
import { Elements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Orders from './Orders';

const stripe = loadStripe('pk_test_8ZO3SxLVZRyRY5s7IPIejHmf0011OBMiEO');

function App() {
  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    let isMounted = true;

    auth.onAuthStateChanged((authUser) => {
      console.log('The User is >>>', authUser);
      if (authUser && isMounted) {
        // the user just logged in
        dispatch({
          type: 'SET_USER',
          user: authUser,
        });
      } else {
        isMounted = false;
        // the user logged out
        dispatch({
          type: 'SET_USER',
          user: null,
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route path='/orders'>
            <Header />
            <Orders />
          </Route>

          <Route path='/login'>
            <Login />
          </Route>
          <Route path='/checkout'>
            <Header />
            <Checkout />
          </Route>

          <Route path='/payment'>
            <Header />
            <Elements stripe={stripe}>
              <Payment />
            </Elements>
          </Route>
          <Route path='/'>
            <Header />
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

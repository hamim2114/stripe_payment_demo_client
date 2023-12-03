import './App.css';
import StripeCheckout from 'react-stripe-checkout';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function App() {
  const publishableKey = 'pk_test_51N5o6SGQ2RjwokUafGOgsMc6YjX0N3muSls8d4YbEzbrwftfmRVauZXo3xuzP9HKM5gUZQSKI04wDCrF3ibZyxll00ZBCmbJNC';
  const [product, setProduct] = useState({
    name: 'Demo Item',
    price: 50,
  });
  const priceForStripe = product.price * 100;

  const handleSuccess = () => {
    MySwal.fire({
      icon: 'success',
      title: 'Payment was successful',
      time: 4000,
    });
  };
  const handleFailure = () => {
    MySwal.fire({
      icon: 'error',
      title: 'Payment was not successful',
      time: 4000,
    });
  };
  const payNow = async token => {
    try {
      const response = await axios({
        url: 'https://stripe-payment-demo-server.vercel.app/payment',
        method: 'post',
        data: {
          amount: product.price * 100,
          token,
        },
      });
      if (response.status === 200) {
        handleSuccess();
      }
    } catch (error) {
      handleFailure();
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h2>Stripe payment</h2>
      <p>
        <span>Product: </span>
        {product.name}
      </p>
      <p>
        <span>Price: </span>${product.price}
      </p>
      <StripeCheckout
        stripeKey={publishableKey}
        label="Pay Now"
        name="Pay With Credit Card"
        billingAddress
        shippingAddress
        amount={priceForStripe}
        description={`Your total is $${product.price}`}
        token={payNow}
      />
    </div>
  );
}

export default App;

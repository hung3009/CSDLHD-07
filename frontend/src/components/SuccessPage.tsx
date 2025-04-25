import React from 'react';

const SuccessPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px', marginTop: '40px' }}>
      <h1>Payment Success!</h1>
      <p>Your payment was successfully processed. Thank you for your purchase!</p>
      <a href="/" style={{ textDecoration: 'none', color: 'blue' }}>
        Go back to homepage
      </a>
    </div>
  );
};

export default SuccessPage;

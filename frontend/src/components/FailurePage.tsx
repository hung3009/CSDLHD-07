import React from 'react';

const FailurePage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px', marginTop: '40px'  }}>
      <h1>Payment Failed</h1>
      <p>Unfortunately, your payment could not be processed. Please try again later.</p>
      <a href="/" style={{ textDecoration: 'none', color: 'red' }}>
        Go back to homepage
      </a>
    </div>
  );
};

export default FailurePage;

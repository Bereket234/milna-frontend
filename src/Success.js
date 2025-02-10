import React from "react";
import { Link } from "react-router-dom";

const SuccessPage = () => {
  return (
    <div className="success-page">
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase.</p>
      <Link to="/" className="back-button">
        Back to Home
      </Link>
    </div>
  );
};

export default SuccessPage;

import React, { useState, useEffect } from "react";
import { AcceptHosted } from "react-acceptjs";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const AcceptHostedModal = () => {
  const navigate = useNavigate();
  const [formToken, setFormToken] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [response, setResponse] = useState(null);

  // Fetch form token when component mounts, not when modal opens
  useEffect(() => {
    axios
      .post("http://localhost:5000/get-payment-form-token")
      .then((res) => {
        setFormToken(res.data.formToken);
      })
      .catch((err) => console.error("Error fetching form token:", err));
  }, []);

  const handleOutsideClick = (e) => {
    if (e.target.className === "modal-overlay") {
      setShowModal(false);
    }
  };

  return (
    <div className="payment-container">
      {/* Main payment page */}
      <div className="payment-content">
        <h1>Final Order</h1>
        <div className="order-details">
          <p>Total Amount (including taxes): $42.68</p>
        </div>
        <button className="book-button" onClick={() => setShowModal(true)}>
          Book
        </button>
      </div>

      {/* Payment Modal */}
      {formToken && showModal && (
        <div className="modal-overlay" onClick={handleOutsideClick}>
          <div className="modal-content">
            <AcceptHosted
              formToken={formToken}
              integration="iframe"
              environment="SANDBOX"
              onCancel={() => {
                setShowModal(false);
              }}
              onTransactionResponse={(response) => {
                setShowModal(false);
                navigate('/success');
              }}
              cssStyles={{
                ".AcceptUI": {
                  fontFamily: "Roboto, sans-serif",
                },
                ".AcceptUI input": {
                  fontSize: "16px",
                },
                ".AcceptUI label": {
                  color: "#795548", // Brown color
                  fontSize: "16px",
                },
                ".AcceptUI h2": {
                  color: "#000000",
                  fontSize: "20px",
                  fontWeight: "bold",
                },
                ".AcceptUI .footer-text": {
                  color: "#9E9E9E",
                  fontSize: "16px",
                },
                ".AcceptUI button": {
                  backgroundColor: "#FF9800", // Orange color
                },
              }}
            >
              <AcceptHosted.Button className="btn btn-primary">
                Pay with Authorize.Net
              </AcceptHosted.Button>
              <AcceptHosted.IFrameBackdrop />
              <AcceptHosted.IFrameContainer>
                <AcceptHosted.IFrame />
              </AcceptHosted.IFrameContainer>
            </AcceptHosted>
          </div>
        </div>
      )}

      {/* Show Payment Response */}
      {response && <pre>{response}</pre>}
    </div>
  );
};

export default AcceptHostedModal;

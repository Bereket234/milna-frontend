import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Payment.css";
import Modal from "react-modal";

const PaymentForm = () => {
  const [token, setToken] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.CommunicationHandler = {
      onReceiveCommunication: (argument) => {
        const params = new URLSearchParams(argument.qstr);

        switch (params.get("action")) {
          case "resizeWindow":
            console.log("resize");
            break;
          case "successfulSave":
            console.log("save");
            break;
          case "cancel":
            console.log("cancel");
            break;
          case "transactResponse":
            sessionStorage.removeItem("HPTokenTime");
            console.log("transaction complete");
            const transResponse = JSON.parse(params.get("response"));
            window.location.href = "/checkout/complete";
            break;
          default:
            break;
        }
      },
    };
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      setIsLoading(true);
      const fetchToken = async () => {
        const order = {
          items: [{ price: 100 }, { price: 200 }],
          billing_first_name: "John",
          billing_last_name: "Doe",
          billing_address: {
            address_1: "123 Main St",
            city: "Anytown",
            state: "CA",
            zip: "12345",
            country: "USA",
          },
          phone: "555-555-5555",
        };

        console.log("Fetching token...");
        try {
          const response = await axios.post(
            "http://localhost:5000/get-payment-form-token",
            { order }
          );
          console.log("Token received:", response.data.formToken);
          if (response.data.formToken) {
            setToken(response.data.formToken);
            setIsLoading(false);
          } else {
            setToken("");
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error fetching token:", error);
          setToken("");
          setIsLoading(false);
        }
      };

      fetchToken();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (token) {
      console.log("Submitting form with token:", token);
      document.getElementById("send_hptoken").submit();
    }
  }, [token]);

  return (
    <div>
      {/* Checkout Button */}
      <div className="checkout-button-container">
        <h3>Order Summary</h3>
        <p>
          <strong>Items: $42.68</strong>
        </p>
        <p>
          <strong>Total: $42.68</strong>
        </p>
        <p>Pay on the next popup</p>
        <button
          className="checkout-button"
          onClick={() => setIsModalOpen(true)}
        >
          Book Now
        </button>
      </div>

      {/* React Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Payment Modal"
        preventScroll={false}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 1000,
          },
          content: {
            width: "70%",
            height: "70%",
            maxWidth: "800px",
            margin: "auto",
            padding: "20px",
            borderRadius: "8px",
            position: "relative",
            overflow: "auto",
          },
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsModalOpen(false)}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          &times;
        </button>

        {/* IFrame and Form */}
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <div id="iframe_holder">
            <iframe
              id="load_payment"
              name="load_payment"
              width="100%"
              height="600"
              frameBorder="0"
              scrolling="yes"
              title="Payment Form"
            ></iframe>
            <form
              id="send_hptoken"
              action="https://test.authorize.net/payment/payment"
              method="post"
              target="load_payment"
            >
              <input type="hidden" name="token" value={token || ""} />
            </form>
          </div>
        )}
      </Modal>
    </div>
  );

  //   return (
  //     <div
  //       id="iframe_holder"
  //       className="center-block"
  //       style={{ width: "90%", maxWidth: "1000px" }}
  //       data-mediator="payment-form-loader"
  //     >
  //       <iframe
  //         id="load_payment"
  //         className="embed-responsive-item"
  //         name="load_payment"
  //         width="750"
  //         height="900"
  //         frameBorder="0"
  //         scrolling="no"
  //       ></iframe>
  //       <form
  //         id="send_hptoken"
  //         action="https://test.authorize.net/payment/payment"
  //         method="post"
  //         target="load_payment"
  //       >

  //         <input type="hidden" name="token" value={token} />
  //       </form>
  //     </div>
  //   );
};

export default PaymentForm;

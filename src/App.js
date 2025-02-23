import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Success from "./Success";
import PaymentForm from "./PaymentForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaymentForm />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;

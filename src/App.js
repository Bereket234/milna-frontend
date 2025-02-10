import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AcceptHostedModal from "./AcceptHostedModal";
import Success from "./Success";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AcceptHostedModal />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./page/homepage";
import InboxPage from "./page/inbox";
import MessagePage from "./page/message";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={<HomePage userId="6630aa0827925b6d3e42f2ae" />}
        />
        <Route path="/inbox/:userId" element={<InboxPage />} />
        <Route path="/message/:id" element={<MessagePage />} />
      </Routes>
    </Router>
  );
};

export default App;

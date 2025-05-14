import { Component } from "react";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { NotificationProvider } from "./context/NotificationContext";
import NotificationManager from "./components/NotificationManager";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoutes";
import Dashboard from "./components/Admin/DashBoard/index.js";
import HomePage from "./components/User/Dashboard/index.js";
import NotFound from "./components/NotFound/index.js";

import DetailsPage from "./components/User/Document/index.js";
import CreateDocument from "./components/User/CreateDocument/index.js";
class App extends Component {
  render() {
    return (
      <NotificationProvider>
        <Router>
          {/* Notification bar should always render */}
          <NotificationManager />
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/" element={<ProtectedRoute />} /> */}
            {/* <Route path="/signup" element={<SignUp />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/create-document" element={<CreateDocument />} />
            <Route path="/details/:id" element={<DetailsPage />} />

            <Route path="//" element={<ProtectedRoute />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute
                  element={Dashboard}
                  allowedRoles={["admin"]}
                />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </NotificationProvider>
    );
  }
}

export default App;

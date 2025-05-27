import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FeedbackForm from "./pages/feedbackform";
import Account from "./pages/account";
import Userf from "./pages/userf";
import Dashboard from "./dash/dashboard";
import User from "./dash/user";
import Feedbackr from "./dash/feedbackr";
import Graph from "./dash/graph";
import ProtectedRoute from "./protectedroute";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // or spinner
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Routes>
       <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route
          path="/feedback"
          element={user ? <FeedbackForm userId={user.uid} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/account"
          element={user ? <Account userId={user.uid} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/userf"
          element={user ? <Userf userId={user.uid} /> : <Navigate to="/login" replace />}
        />
        
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedbackr"
          element={
            <ProtectedRoute>
              <Feedbackr />
            </ProtectedRoute>
          }
        />
           <Route
          path="/graph"
          element={
            <ProtectedRoute>
              <Graph />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

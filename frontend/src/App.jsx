import React from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import MyResultPage from "./pages/MyResultPage";

// Protected Route
function RequireAuth({ children }) {
  const isLoggedIn = Boolean(localStorage.getItem("authToken"));
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Prevent logged-in users from opening Login/Signup again
function PublicRoute({ children }) {
  const isLoggedIn = Boolean(localStorage.getItem("authToken"));

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

const App = () => {
  return (
    <Routes>

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Login */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Signup */}
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* Home */}
      <Route
        path="/home"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />

      {/* Result */}
      <Route
        path="/result"
        element={
          <RequireAuth>
            <MyResultPage />
          </RequireAuth>
        }
      />

      {/* Invalid URL */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
};

export default App;
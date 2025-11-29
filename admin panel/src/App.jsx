// Example: src/App.js or App.js (adjust path)
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext"; // adjust path if needed
import RequireAuth from "../components/RequireAuth";
import SignIn from "../pages/SignIn";
import NotAuthorized from "../pages/NotAuthorized";
import AdminHome from "../pages/AdminHome";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/not-authorized" element={<NotAuthorized />} />

          <Route
            path="/admin/*"
            element={
              <RequireAuth allowedRoles={['admin']}>
                <AdminHome />
              </RequireAuth>
            }
          />
          {/* other public routes */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

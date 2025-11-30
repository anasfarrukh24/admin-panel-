import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

/*
  Replace POST URL with your admin backend auth endpoint.
  Expected response: { token: "...", role: "admin", name: "...", email: "..." } OR { token: "..." }
*/

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const from = (location.state && location.state.from && location.state.from.pathname) || "/admin";

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await axios.post("/api/admin/login", { email, password }); // adjust endpoint
      const data = res.data || {};
      const token = data.token || null;
      const role = data.role || null;
      const name = data.name || null;
      auth.login({ token, role, name, email });
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Admin login failed", err);
      setError(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setSaving(false);
    }
  }

  if (auth && auth.isAuthenticated()) {
    navigate(from, { replace: true });
    return null;
  }

  return (
    <div style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
      <h2>Admin Sign In</h2>
      <form onSubmit={submit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
        <button type="submit" disabled={saving}>{saving ? "Signing in..." : "Sign in"}</button>
      </form>
    </div>
  );
}

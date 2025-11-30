import React from "react";
import { Link } from "react-router-dom";

export default function NotAuthorized() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h2>Not Authorized</h2>
      <p>You do not have permission to view this page.</p>
      <p><Link to="/SignIn">Sign in</Link> or <Link to="/">Go home</Link></p>
    </div>
  );
}

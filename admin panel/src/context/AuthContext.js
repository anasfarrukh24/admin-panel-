import React, { createContext, useContext, useEffect, useState } from "react";

/*
  AuthContext for admin panel
  - call login({ token, role, name, email }) after successful backend authentication
  - parses JWT token for common role claim names if role not supplied
  - persists to localStorage under 'admin_auth' (separate key to avoid collision if both apps run together)
*/

const AUTH_STORAGE_KEY = "admin_auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      console.warn("Failed to read auth from storage", e);
    }
  }, []);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to persist auth to storage", e);
    }
  }, [user]);

  function parseRoleFromToken(token) {
    if (!token) return null;
    try {
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      const role = payload.role || payload.roles || payload.role_name || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      if (Array.isArray(role)) return role[0];
      return role || null;
    } catch (e) {
      console.warn("Failed to parse token for role claim", e);
      return null;
    }
  }

  function normalizeRole(r) {
    if (!r) return r;
    try {
      return String(r).toLowerCase();
    } catch {
      return r;
    }
  }

  function login({ token = null, role = null, name = null, email = null } = {}) {
    const inferredRole = normalizeRole(role || parseRoleFromToken(token) || "user");
    const newUser = {
      role: inferredRole,
      token,
      name,
      email,
      authenticatedAt: new Date().toISOString(),
    };
    setUser(newUser);
    return newUser;
  }

  function logout() {
    setUser(null);
  }

  function isAuthenticated() {
    return !!user;
  }

  // allowedRoles: array of normalized role strings (e.g. ['admin'])
  function hasRole(allowedRoles = []) {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    if (!user) return false;
    // normalize comparison
    const normalized = allowedRoles.map(normalizeRole);
    return normalized.includes(normalizeRole(user.role));
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

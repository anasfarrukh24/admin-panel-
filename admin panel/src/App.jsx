import React, { useEffect } from "react";
import { Routes, Route, Navigate, useRoutes } from "react-router-dom";
import { ProtectedRoute } from "ProtectedRoute";
import { withAuthContext } from "context/Auth";
import routes from "ProtectedRoute";
const App = ({ Token, CheckToken }) => {
  useEffect(() => {
    CheckToken();
  }, []);

  const routing = useRoutes(routes(Token));

  return (
    <>
      {routing}
    </>
  );
};

export default withAuthContext(App);

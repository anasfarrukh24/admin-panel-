import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const withAuthContext = (Component) => (props) =>
  (
    <AuthContext.Consumer>
      {(value) => <Component {...value} {...props} />}
    </AuthContext.Consumer>
  );

const AuthProvider = ({ children }) => {
  const [Token, setToken] = useState("");
  const [currAdmin, setcurrAdmin] = useState({});
  const [AdminRole, setAdminRole] = useState("");
  const GetCurrentAdmin = () => {
    if (Token || localStorage.getItem("token")) {
      axios
        .get(`${process.env.REACT_APP_PUBLIC_PATH}/AdminInfo`, {
          headers: {
            Authorization: Token
              ? `${Token}`
              : `${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res?.data?.status == 200) {
            setcurrAdmin(res?.data?.data);
            setAdminRole(res?.data?.data?.Role);
          }
        })
        .catch((err) => {
          console.log(err?.message);
        });
    } else {
      setTimeout(() => {
        CheckToken();
        GetCurrentAdmin();
      }, 500);
    }
  };

  function CheckToken() {
    if ((!Token || Token == "") && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    } else if (
      !localStorage.getItem("token") ||
      localStorage.getItem("token") == ""
    ) {
      localStorage.removeItem("token");
      setToken("");
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    CheckToken();
    GetCurrentAdmin();
  }, [Token]);

  useEffect(() => {
    CheckToken();
    GetCurrentAdmin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        Token,
        setToken,
        CheckToken,
        currAdmin,
        GetCurrentAdmin,
        AdminRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

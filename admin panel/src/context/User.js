import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { withAuthContext } from "./Auth";

export const UserContext = createContext();

export const withUserContext = (Component) => (props) =>
  (
    <UserContext.Consumer>
      {(value) => <Component {...value} {...props} />}
    </UserContext.Consumer>
  );

const UserProvider = ({ children, Token, CheckToken }) => {
  const [AllUser, setAllUser] = useState([]);
  const [UserError, setUserError] = useState(null);
  const GetAllUser = () => {
    if (Token || localStorage.getItem("token")) {
      axios
        .get(`${process.env.REACT_APP_PUBLIC_PATH}/GetAllUsers`, {
          headers: {
            Authorization: Token
              ? `${Token}`
              : `${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res?.data?.status == 200) {
            setAllUser(res?.data?.data);
          } else {
            setUserError(res?.data?.message);
          }
        })
        .catch((err) => {
          setUserError(err?.message);
        });
    } else {
      setTimeout(() => {
        CheckToken();
        GetAllUser();
      }, 500);
    }
  };

  useEffect(() => {
    GetAllUser()
  },[])

  return (
    <UserContext.Provider
      value={{
        GetAllUser,
        AllUser,
        UserError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default withAuthContext(UserProvider);

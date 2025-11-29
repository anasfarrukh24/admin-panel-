import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { withAuthContext } from "./Auth";

export const AddressContext = createContext();

export const withAddressContext = (Component) => (props) =>
  (
    <AddressContext.Consumer>
      {(value) => <Component {...value} {...props} />}
    </AddressContext.Consumer>
  );

const AddressProvider = ({ children, Token, CheckToken }) => {
  const [AllAddress, setAllAddress] = useState([]);
  const [AddressError, setAddressError] = useState(null);
  const GetAllAddress = () => {
    if (Token || localStorage.getItem("token")) {
      axios
        .get(`${process.env.REACT_APP_PUBLIC_PATH}/GetAllAddresss`, {
          headers: {
            Authorization: Token
              ? `${Token}`
              : `${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res?.data?.status == 200) {
            setAllAddress(res?.data?.data);
          } else {
            setAddressError(res?.data?.message);
          }
        })
        .catch((err) => {
          setAddressError(err?.message);
        });
    } else {
      setTimeout(() => {
        CheckToken();
        GetAllAddress();
      }, 500);
    }
  };

  useEffect(() => {
    GetAllAddress()
  },[])

  return (
    <AddressContext.Provider
      value={{
        GetAllAddress,
        AllAddress,
        AddressError,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export default withAuthContext(AddressProvider);

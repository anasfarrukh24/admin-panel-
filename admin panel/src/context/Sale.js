import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { withAuthContext } from "./Auth";

export const SaleContext = createContext();

export const withSaleContext = (Component) => (props) =>
(
  <SaleContext.Consumer>
    {(value) => <Component {...value} {...props} />}
  </SaleContext.Consumer>
);

const SaleProvider = ({ children, Token, CheckToken }) => {
  const [AllSale, setAllSale] = useState([]);
  const [SaleError, setSaleError] = useState(null);
  const GetAllSale = () => {
    if (Token || localStorage.getItem("token")) {
      axios
        .get(`${process.env.REACT_APP_PUBLIC_PATH}/GetAllSale`, {
          headers: {
            Authorization: Token
              ? `${Token}`
              : `${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res?.data?.status == 200) {
            setAllSale(res?.data?.data.reverse());
          } else {
            setSaleError(res?.data?.message);
          }
        })
        .catch((err) => {
          setSaleError(err?.message);
        });
    } else {
      setTimeout(() => {
        CheckToken();
        GetAllSale();
      }, 500);
    }
  };

  useEffect(() => {
    GetAllSale()
  }, [])

  return (
    <SaleContext.Provider
      value={{
        GetAllSale,
        AllSale,
        SaleError,
      }}
    >
      {children}
    </SaleContext.Provider>
  );
};

export default withAuthContext(SaleProvider);

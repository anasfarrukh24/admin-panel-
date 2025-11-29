import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { withAuthContext } from "./Auth";

export const DiscountContext = createContext();

export const withDiscountContext = (Component) => (props) =>
(
  <DiscountContext.Consumer>
    {(value) => <Component {...value} {...props} />}
  </DiscountContext.Consumer>
);

const DiscountProvider = ({ children, Token, CheckToken }) => {
  const [AllDiscount, setAllDiscount] = useState([]);
  const [DiscountError, setDiscountError] = useState(null);
  const GetAllDiscount = () => {
    if (Token || localStorage.getItem("token")) {
      axios
        .get(`${process.env.REACT_APP_PUBLIC_PATH}/GetAllDiscounts`, {
          headers: {
            Authorization: Token
              ? `${Token}`
              : `${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res?.data?.status == 200) {
            setAllDiscount(res?.data?.data);
          } else {
            setDiscountError(res?.data?.message);
          }
        })
        .catch((err) => {
          setDiscountError(err?.message);
        });
    } else {
      setTimeout(() => {
        CheckToken();
        GetAllDiscount();
      }, 500);
    }
  };

  useEffect(() => {
    GetAllDiscount()
  }, [])

  return (
    <DiscountContext.Provider
      value={{
        GetAllDiscount,
        AllDiscount,
        DiscountError,
      }}
    >
      {children}
    </DiscountContext.Provider>
  );
};

export default withAuthContext(DiscountProvider);

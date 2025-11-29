import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { withAuthContext } from "./Auth";

export const CouponContext = createContext();

export const withCouponContext = (Component) => (props) =>
(
  <CouponContext.Consumer>
    {(value) => <Component {...value} {...props} />}
  </CouponContext.Consumer>
);

const CouponProvider = ({ children, Token, CheckToken }) => {
  const [AllCoupon, setAllCoupon] = useState([]);
  const [CouponError, setCouponError] = useState(null);
  const GetAllCoupon = () => {
    if (Token || localStorage.getItem("token")) {
      axios
        .get(`${process.env.REACT_APP_PUBLIC_PATH}/GetAllCoupons`, {
          headers: {
            Authorization: Token
              ? `${Token}`
              : `${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res?.data?.status == 200) {
            setAllCoupon(res?.data?.data);
          } else {
            setCouponError(res?.data?.message);
          }
        })
        .catch((err) => {
          setCouponError(err?.message);
        });
    } else {
      setTimeout(() => {
        CheckToken();
        GetAllCoupon();
      }, 500);
    }
  };

  useEffect(() => {
    GetAllCoupon()
  }, [])

  return (
    <CouponContext.Provider
      value={{
        GetAllCoupon,
        AllCoupon,
        CouponError,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
};

export default withAuthContext(CouponProvider);

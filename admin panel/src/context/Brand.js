import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { withAuthContext } from "./Auth";

export const BrandContext = createContext();

export const withBrandContext = (Component) => (props) =>
  (
    <BrandContext.Consumer>
      {(value) => <Component {...value} {...props} />}
    </BrandContext.Consumer>
  );

const BrandProvider = ({ children, Token, CheckToken }) => {
  const [AllBrand, setAllBrand] = useState([]);
  const [BrandError, setBrandError] = useState(null);
  const GetAllBrand = () => {
    if (Token || localStorage.getItem("token")) {
      axios
        .get(`${process.env.REACT_APP_PUBLIC_PATH}/GetAllBrands`, {
          headers: {
            Authorization: Token
              ? `${Token}`
              : `${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res?.data?.status == 200) {
            setAllBrand(res?.data?.data);
          } else {
            setBrandError(res?.data?.message);
          }
        })
        .catch((err) => {
          setBrandError(err?.message);
        });
    } else {
      setTimeout(() => {
        CheckToken();
        GetAllBrand();
      }, 500);
    }
  };

  useEffect(() => {
    GetAllBrand()
  },[])

  return (
    <BrandContext.Provider
      value={{
        GetAllBrand,
        AllBrand,
        BrandError,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export default withAuthContext(BrandProvider);

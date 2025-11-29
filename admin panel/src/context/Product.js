import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { withAuthContext } from "./Auth";

export const ProductContext = createContext();

export const withProductContext = (Component) => (props) =>
  (
    <ProductContext.Consumer>
      {(value) => <Component {...value} {...props} />}
    </ProductContext.Consumer>
  );

const ProductProvider = ({ children, Token, CheckToken }) => {
  const [AllProduct, setAllProduct] = useState([]);
  const [ProductError, setProductError] = useState(null);
  const GetAllProduct = () => {
    if (Token || localStorage.getItem("token")) {
      axios
        .get(`${process.env.REACT_APP_PUBLIC_PATH}/GetAllProducts`, {
          headers: {
            Authorization: Token
              ? `${Token}`
              : `${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res?.data?.status == 200) {
            setAllProduct(res?.data?.data);
          } else {
            setProductError(res?.data?.message);
          }
        })
        .catch((err) => {
          setProductError(err?.message);
        });
    } else {
      setTimeout(() => {
        CheckToken();
        GetAllProduct();
      }, 500);
    }
  };

  useEffect(() => {
    GetAllProduct()
  },[])

  return (
    <ProductContext.Provider
      value={{
        GetAllProduct,
        AllProduct,
        ProductError,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default withAuthContext(ProductProvider);

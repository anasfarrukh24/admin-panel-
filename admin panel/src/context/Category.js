import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { withAuthContext } from "./Auth";

export const CategoryContext = createContext();

export const withCategoryContext = (Component) => (props) =>
  (
    <CategoryContext.Consumer>
      {(value) => <Component {...value} {...props} />}
    </CategoryContext.Consumer>
  );

const CategoryProvider = ({ children, Token, CheckToken }) => {
  const [AllCategory, setAllCategory] = useState([]);
  const [CategoryError, setCategoryError] = useState(null);
  const GetAllCategory = () => {
    if (Token || localStorage.getItem("token")) {
      axios
        .get(`${process.env.REACT_APP_PUBLIC_PATH}/GetAllCategorys`, {
          headers: {
            Authorization: Token
              ? `${Token}`
              : `${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res?.data?.status == 200) {
            setAllCategory(res?.data?.data);
          } else {
            setCategoryError(res?.data?.message);
          }
        })
        .catch((err) => {
          setCategoryError(err?.message);
        });
    } else {
      setTimeout(() => {
        CheckToken();
        GetAllCategory();
      }, 500);
    }
  };

  useEffect(() => {
    GetAllCategory()
  },[])

  return (
    <CategoryContext.Provider
      value={{
        GetAllCategory,
        AllCategory,
        CategoryError,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export default withAuthContext(CategoryProvider);

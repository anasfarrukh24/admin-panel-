import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { withAuthContext } from "./Auth";

export const BankContext = createContext();

export const withBankContext = (Component) => (props) =>
  (
    <BankContext.Consumer>
      {(value) => <Component {...value} {...props} />}
    </BankContext.Consumer>
  );

const BankProvider = ({ children, Token, CheckToken }) => {
  const [AllBank, setAllBank] = useState([]);
  const [BankError, setBankError] = useState(null);
  const GetAllBank = () => {
    if (Token || localStorage.getItem("token")) {
      axios
        .get(`${process.env.REACT_APP_PUBLIC_PATH}/GetAllBanks`, {
          headers: {
            Authorization: Token
              ? `${Token}`
              : `${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res?.data?.status == 200) {
            setAllBank(res?.data?.data);
          } else {
            setBankError(res?.data?.message);
          }
        })
        .catch((err) => {
          setBankError(err?.message);
        });
    } else {
      setTimeout(() => {
        CheckToken();
        GetAllBank();
      }, 500);
    }
  };

  useEffect(() => {
    GetAllBank()
  },[])

  return (
    <BankContext.Provider
      value={{
        GetAllBank,
        AllBank,
        BankError,
      }}
    >
      {children}
    </BankContext.Provider>
  );
};

export default withAuthContext(BankProvider);

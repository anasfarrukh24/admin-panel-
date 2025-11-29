import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import App from "./App";
import AuthProvider from "context/Auth";
import BrandProvider from "context/Brand";
import SaleProvider from "context/Sale";
import CategoryProvider from "context/Category";
import AddressProvider from "context/Address";
import BankProvider from "context/Bank";
import UserProvider from "context/User";
import ProductProvider from "context/Product";
import DiscountProvider from "context/Discount";
import CouponProvider from "context/Coupon";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <BrandProvider>
        <SaleProvider>
          <CategoryProvider>
            <CouponProvider>
              <DiscountProvider>
                <AddressProvider>
                  <BankProvider>
                    <UserProvider>
                      <ProductProvider>
                        <App />
                      </ProductProvider>
                    </UserProvider>
                  </BankProvider>
                </AddressProvider>
              </DiscountProvider>
            </CouponProvider>
          </CategoryProvider>
        </SaleProvider>
      </BrandProvider>
    </AuthProvider>
  </BrowserRouter>
);

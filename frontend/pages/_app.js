import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useEffect } from "react";
import "../styles/globals.css";
import { StoreProvider } from "../utils/Store";
import { SnackbarProvider } from "notistack";
import axios from "axios";
import Cookies from "js-cookie";
import process from "process";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  if (process.browser) {
    const userInfo = Cookies.get("userInfo")
      ? JSON.parse(Cookies.get("userInfo"))
      : null;
    // console.log(userInfo._id);
    if (userInfo) {
      const checkIn = async () => {
        await axios.get(`http://localhost:8000/api/runes/user/${userInfo._id}`);
        await axios.get(`http://localhost:8000/api/runes/add/${userInfo._id}`);
      };
      checkIn();
    }
  }

  return (
    <SnackbarProvider anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <StoreProvider>
        <PayPalScriptProvider deferLoading={true}>
          <Component {...pageProps} />
        </PayPalScriptProvider>
      </StoreProvider>
    </SnackbarProvider>
  );
}

export default MyApp;

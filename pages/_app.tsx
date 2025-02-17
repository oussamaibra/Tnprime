import { NextComponentType, NextPageContext } from "next";
import Router, { useRouter } from "next/router";
import NProgress from "nprogress";
import { NextIntlProvider } from "next-intl";

import { ProvideCart } from "../context/cart/CartProvider";
import { ProvideWishlist } from "../context/wishlist/WishlistProvider";
import { ProvideAuth } from "../context/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import "../styles/globals.css";
import "animate.css";
import "nprogress/nprogress.css";

// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/pagination/pagination.min.css";
import "swiper/components/scrollbar/scrollbar.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Script from "next/script";
// import ReactPixel from "react-facebook-pixel";
// import { FacebookPixelEvents } from "../context/Util/fb";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

let ReactPixel: any = null;

if (typeof window !== "undefined") {
  import("react-facebook-pixel")
    .then((x) => x.default)
    .then((currReactPixel) => {
      ReactPixel = currReactPixel;
    });
}

type AppCustomProps = {
  Component: NextComponentType<NextPageContext, any, {}>;
  pageProps: any;
  cartState: string;
  wishlistState: string;
};

const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51PcmN3DIMS3Lybv9aOrD9VaN3mLG7bkBBzcDHf3aIaIffVv70VvDv3kdG0b4QUABQigvYHd9juMwttVPn0QRRHTw00Wlb2Qove";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const options = {
  mode: "payment",
  amount: 1099,
  currency: "eur",
  // Fully customizable with appearance API.
  appearance: {
    /*...*/
  },
};

const MyApp = ({ Component, pageProps }: AppCustomProps) => {
  // const stripePromise = await fetch("/api/v1/config").then(async (r) => {
  //   const { publishableKey } = await r.json();
  //  return loadStripe(publishableKey);
  // });
  const checkLocation = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_LOCATION_MODULE}`);
    if (res.data) {
      localStorage.setItem("location", JSON.stringify(res.data));
    }
  };

  const router = useRouter();

  // FacebookPixelEvents()
  useEffect(() => {
    checkLocation();
  }, []);
  
  useEffect(() => {
    if (!ReactPixel) {
      (async () => {
        await import("react-facebook-pixel")
          .then((x) => x.default)
          .then((currReactPixel) => {
            ReactPixel = currReactPixel;
          });
        ReactPixel.init(`1302096797738899`);
        ReactPixel.pageView();
      })();
    } else {
      ReactPixel.init(`1302096797738899`);
      ReactPixel.pageView();
    }
  }, [router.pathname]);

  return (
    <>
      <NextIntlProvider messages={pageProps?.messages}>
        <ProvideAuth>
          <ProvideWishlist>
            <ProvideCart>
              <Elements stripe={stripePromise} options={options}>
                <Component {...pageProps} />
              </Elements>
            </ProvideCart>
          </ProvideWishlist>
        </ProvideAuth>
      </NextIntlProvider>
    </>
  );
};

export default MyApp;

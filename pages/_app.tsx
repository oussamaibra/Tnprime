import { NextComponentType, NextPageContext } from "next";
import Router from "next/router";
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

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

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

  useEffect(() => {
    checkLocation();
  }, []);

  return (
    <>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1055542786588397');
fbq('track', 'PageView');
`,
        }}
      />
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

"use client";
import React, { useEffect, useState } from "react";
import _ from "lodash";
import { roundDecimal } from "../components/Util/utilFunc";
import { useRouter } from "next/router";

let ReactPixel: any = null;

if (typeof window !== "undefined") {
  import("react-facebook-pixel")
    .then((x) => x.default)
    .then((currReactPixel) => {
      ReactPixel = currReactPixel;
    });
}

export const FacebookPixelEvents = () => {
  const router = useRouter();

  // const pathname = usePathname();
  // const searchParams = useSearchParams();

  useEffect(() => {
    if (!ReactPixel) {
      import("react-facebook-pixel")
        .then((x) => x.default)
        .then((currReactPixel) => {
          ReactPixel = currReactPixel;
        });
      ReactPixel.init(`1302096797738899`);
      ReactPixel.pageView();
    } else {
      ReactPixel.init(`1302096797738899`);
      ReactPixel.pageView();
    }
  }, [router.pathname]);

  return null;
};

export const fbPixelAddToCart = async () => {
  if (ReactPixel) ReactPixel.fbq("track", "AddToCart");
};

export const fbPixelPurchase = async (total: number) => {
  if (ReactPixel)
    ReactPixel.fbq("track", "PurchasePrime", {
      currency: "USD",
      value: Number(total),
    });
};

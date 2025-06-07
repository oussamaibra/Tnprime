import React, { useState, useEffect } from "react";
import { GetStaticProps } from "next";
import Image from "next/image";
import { useTranslations } from "next-intl";
import axios from "axios";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Button from "../components/Buttons/Button";
import Slideshow from "../components/HeroSection/Slideshow";
import OverlayContainer from "../components/OverlayContainer/OverlayContainer";
import Card from "../components/Card/Card";
import TestiSlider from "../components/TestiSlider/TestiSlider";
import { apiProductsType, itemType } from "../context/cart/cart-types";
import LinkButton from "../components/Buttons/LinkButton";
import { Swiper, SwiperSlide } from "swiper/react";

import ourShop from "../public/bg-img/ourshop.png";
import moment from "moment";
import _ from "lodash";
import CardIG from "../components/Card/CardIG";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper/core";
import Modal from "@leafygreen-ui/modal";
import ProductCard from "../components/Card/ProductCard";

SwiperCore.use([Pagination, Navigation, Autoplay]);

type Props = {
  products: itemType[];
};

type Product = {
  _id: string;
  name: string;
  stock: string;
  discount: string;
  details: string;
  varient: {
    name: string;
    price: number;
    images: string;
  }[];
  reviews: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

const Accessories: React.FC<Props> = () => {
  const t = useTranslations("Index");
  const [currentItems, setCurrentItems] = useState<Product[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [open, setopen] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_ACC_MODULE}`);
        const sortedArray = _.orderBy(res?.data?.data, (o: Product) => {
          return moment(o.createdAt).valueOf();
        }).reverse();

        setProducts(sortedArray);
        setCurrentItems(sortedArray);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    })();
  }, []);

  const handleSeemore = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsFetching(true);
  };

  return (
    <>
      {/* ===== Header Section ===== */}
      <Header />

      <main id="main-content" className="-mt-20">
        {/* ===== Best Selling Section ===== */}
        <section className="app-max-width w-full h-full flex flex-col justify-center mt-24 mb-20">
          <div className="flex justify-center">
            <table width="90%" className="mb-10 mt-10">
              <tr>
                <td>
                  <hr style={{ opacity: "0.2" }} />
                </td>
                <td
                  style={{
                    width: "1px",
                    padding: "0 25px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <h2 className="text-4xl">Apple</h2>
                </td>
                <td>
                  <hr style={{ opacity: "0.2" }} />
                </td>
              </tr>
            </table>
          </div>

          {/* ===== Main Content Section ===== */}
          <div className="app-x-padding app-max-width mt-10 mb-14 ">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 sm:gap-y-6 mb-10">
              {currentItems.map((item) => {
                const firstVariant = item?.varient[0];
                const images = firstVariant.images.split(",");

                const cardItem = {
                  id: item._id,
                  name: item.name,
                  price: firstVariant.price,
                  discount: item.discount,
                  qty: 1,
                  description: item.details,
                  detail: item.details,
                  img1: images[0],
                  img2: images.length > 1 ? images[1] : images[0],
                  stock: item.stock,
                  createdAt: item.createdAt,
                  option: firstVariant.name,
                  size: firstVariant.name, // Using variant name as size in this case
                };

                return <Card key={item._id} item={cardItem} acc={true} />;
              })}
            </div>
          </div>
        </section>
      </main>
      {/* <Footer /> */}
    </>
  );
};

// export const getStaticProps: GetStaticProps = async ({ locale }) => {
//   try {
//     const res = await axios.get(`${process.env.NEXT_PUBLIC_ACC_MODULE}`);

//     const sortedArray = _.orderBy(
//       res.data,
//       (o: Product) => moment(o.createdAt).valueOf(),
//       ["desc"]
//     );

//     const products = sortedArray.map((item) => {
//       const firstVariant = item.varient[0];
//       const images = firstVariant.images.split(",");

//       return {
//         id: item._id,
//         name: item.name,
//         price: firstVariant.price,
//         discount: item.discount,
//         qty: 1,
//         description: item.details,
//         detail: item.details,
//         img1: images[0],
//         img2: images.length > 1 ? images[1] : images[0],
//         stock: item.stock,
//         createdAt: item.createdAt,
//         option: firstVariant.name,
//         size: firstVariant.name,
//       };
//     });

//     return {
//       props: {
//         messages: {
//           ...require(`../messages/common/${locale}.json`),
//         },
//         products,
//       },
//     };
//   } catch (error) {
//     console.error("Error in getStaticProps:", error);
//     return {
//       props: {
//         messages: {
//           ...require(`../messages/common/${locale}.json`),
//         },
//         products: [],
//       },
//     };
//   }
// };

export default Accessories;

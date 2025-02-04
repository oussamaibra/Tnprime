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

// /bg-img/ourshop.png
import ourShop from "../public/bg-img/ourshop.png";
import moment from "moment";
import _ from "lodash";
import CardIG from "../components/Card/CardIG";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper/core";
SwiperCore.use([Pagination, Navigation, Autoplay]);

type Props = {
  products: itemType[];
  collections: any;
};

const Home: React.FC<Props> = () => {
  const t = useTranslations("Index");
  const [currentItems, setCurrentItems] = useState<Array<any>>();
  const [isFetching, setIsFetching] = useState(false);
  const [products, setproducts] = useState<Array<any>>();
  useEffect(() => {
    (async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_PRODUCTS_MODULE}`);

      const sortedArray = _.orderBy(
        res.data.data,
        (o: any) => {
          return moment(o.createdAt).format("YYYY-MM-DD");
        },
        ["desc"]
      );

      const nouveateArray = sortedArray;
      const products: any[] = nouveateArray.map((el) => ({
        id: el?.id,
        option: el?.option[0].id,
        size: el?.option[0].size.split(",")[0],
        name: el?.name,
        price: el?.option[0].price,
        qty: 1,
        description: el?.description,
        detail: el?.detail,
        collectionId: el.collectionId,
        img1: el?.option[0].images.split(",")[0],
        img2:
          el?.option[0].images.split(",").length > 1
            ? el?.option[0].images.split(",")[1]
            : el?.option[0].images.split(",")[0],
        // categoryName: ,
        stock: el?.option[0].stock,
        createdAt: el?.createdAt,
      }));
      setproducts(products);
      setCurrentItems(products);
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

      {/* ===== Carousel Section ===== */}
      <Slideshow />

      <main id="main-content" className="-mt-20">
        {/* ===== Category Section ===== */}
        {/* <section className="app-max-width w-full h-full flex flex-col justify-center mt-20 ">
          <div className="flex justify-center">
            <table width="90%">
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
                  <h2 className="text-4xl">{t("Collections")}</h2>
                </td>
                <td>
                  <hr style={{ opacity: "0.2" }} />
                </td>
              </tr>
            </table>
          </div>
        </section>
        <section className="w-full h-auto py-10 mb-20">
          <div className="app-max-width app-x-padding h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="w-full sm:col-span-2 lg:col-span-2 ">
              <OverlayContainer
                imgSrc={collections[0]?.thumbnailImage}
                imgSrc2={collections[0]?.thumbnailImage}
                imgAlt="New Arrivals"
              >
                <LinkButton
                  href={`/product-category/${collections[0]?.id}/${collections[0]?.name}`}
                  extraClass="absolute bottom-10-per sm:right-10-per z-20"
                >
                  {collections[0]?.name}
                </LinkButton>
              </OverlayContainer>
            </div>

            {collections.slice(1, 3).map((el: any, i: number) => (
              <div className="w-full" key={i}>
                <OverlayContainer imgSrc={el?.thumbnailImage} imgAlt={el?.name}>
                  <LinkButton
                    href={`/product-category/${el?.id}/${el?.name}`}
                    extraClass="absolute bottom-10-per z-20"
                  >
                    {el?.name}
                  </LinkButton>
                </OverlayContainer>
              </div>
            ))}
          </div>
        </section> */}

        <section className="app-max-width w-full h-full justify-center mt-24 mb-20">
          <div className="flex justify-center mt-10">
            <table width="90%" className="mb-10">
              <tr>
                <td
                  style={{
                    width: "1px",
                    padding: "25px",
                    whiteSpace: "wrap",
                    textAlign: "center",
                    background: "#000",
                    fontWeight: "bolder",
                    color: "#fff",
                  }}
                >
                  {t("topnavContent")}
                </td>
              </tr>
            </table>
          </div>

          <div >
            <Swiper
              // slidesPerView={3}
              centeredSlides={true}
              breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 20 },
                480: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 20 },
              }}

              // spaceBetween={20}
              loop={true}
              grabCursor={true}
              freeMode
              navigation={true}
              // pagination={{
              //   clickable: true,
              //   type: "progressbar",
              //   dynamicBullets: true,
              // }}

            >
              {currentItems
                ?.filter((el) => el.collectionId === 2)
                .map((item) => (
                  <SwiperSlide key={item.id}>
        
                      <CardIG  key={item.id} item={item} />
              
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </section>

        {/* ===== Best Selling Section ===== */}
        <section className="app-max-width w-full h-full flex flex-col justify-center mt-24 mb-20">
          <div className="flex justify-center">
            <table width="90%" className="mb-10">
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
                  <h2 className="text-4xl">{t("ListDesProduits")}</h2>
                </td>

                <td>
                  <hr style={{ opacity: "0.2" }} />
                </td>
              </tr>
            </table>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 lg:gap-x-12 gap-y-6 mb-10 app-x-padding">
            {currentItems[0] && (
              <Card key={currentItems[0]?.id} item={currentItems[0]} />
            )}
            {currentItems[1] && (
              <Card key={currentItems[1]?.id} item={currentItems[1]} />
            )}
            {currentItems[2] && (
              <Card key={currentItems[2]?.id} item={currentItems[2]} />
            )}
          </div> */}

          {/* ===== Main Content Section ===== */}
          <div className="app-x-padding app-max-width mt-10 mb-14 ">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 sm:gap-y-6 mb-10">
              {currentItems
                ?.filter((el) => el.collectionId === 1)
                ?.map((item) => (
                  <Card key={item.id} item={item} />
                ))}
            </div>
            {/* {categorie !== "new-arrivals" && <Pagination currentPage={page} lastPage={lastPage} orderby={orderby} />} */}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_PRODUCTS_MODULE}`);

  const sortedArray = _.orderBy(
    res.data.data,
    (o: any) => {
      return moment(o.createdAt).format("YYYY-MM-DD");
    },
    ["desc"]
  );

  const nouveateArray = sortedArray;
  const products: any[] = nouveateArray.map((el) => ({
    id: el?.id,
    option: el?.option[0].id,
    size: el?.option[0].size.split(",")[0],
    name: el?.name,
    price: el?.option[0].price,
    qty: 1,
    description: el?.description,
    detail: el?.detail,
    img1: el?.option[0].images.split(",")[0],
    img2:
      el?.option[0].images.split(",").length > 1
        ? el?.option[0].images.split(",")[1]
        : el?.option[0].images.split(",")[0],
    // categoryName: ,
    stock: el?.option[0].stock,
    createdAt: el?.createdAt,
  }));

  const collections = await axios.get(
    `${process.env.NEXT_PUBLIC_CATEGORIE_MODULE}`
  );

  // const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products?order_by=createdAt.desc&limit=10`);
  // const fetchedProducts = res.data;
  // fetchedProducts.data.forEach((product: apiProductsType) => {
  //   products = [
  //     ...products,
  //     {
  //       id: product.id,
  //       name: product.name,
  //       price: product.price,
  //       img1: product.image1,
  //       img2: product.image2,
  //     },
  //   ];
  // });

  return {
    props: {
      messages: {
        // ...require(`../messages/index/${locale}.json`),
        ...require(`../messages/common/${locale}.json`),
      },
      products,
      collections: collections.data.data,
    }, // will be passed to the page component as props
  };
};

export default Home;

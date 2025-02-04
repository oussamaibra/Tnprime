/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { iphoneimg } from "../../public/bg-img/iphone.png";
import { Disclosure } from "@headlessui/react";
import { useTranslations } from "next-intl";
import axios from "axios";
import { useRouter } from "next/router";

import Heart from "../../public/icons/Heart";
import DownArrow from "../../public/icons/DownArrow";
import FacebookLogo from "../../public/icons/FacebookLogo";
import InstagramLogo from "../../public/icons/InstagramLogo";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import GhostButton from "../../components/Buttons/GhostButton";
import Button from "../../components/Buttons/Button";
import Card from "../../components/Card/Card";
import Circle from "@uiw/react-color-circle";
import _, { isEmpty, isNil, values } from "lodash";
import { LazyLoadImage } from "react-lazy-load-image-component";


// swiperjs
import { Swiper, SwiperSlide } from "swiper/react";

// import Swiper core and required modules
import SwiperCore, { Pagination } from "swiper/core";
import { apiProductsType, itemType } from "../../context/cart/cart-types";
import { useWishlist } from "../../context/wishlist/WishlistProvider";
import { useCart } from "../../context/cart/CartProvider";
import HeartSolid from "../../public/icons/HeartSolid";
import { EasyZoomOnMove } from "easy-magnify";
import copy from "copy-to-clipboard";
import Select from "react-select";
import Input from "../../components/Input/Input";

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Example threshold for mobile devices
    };

    checkMobile(); // Initial check
    window.addEventListener("resize", checkMobile); // Update on resize

    return () => {
      window.removeEventListener("resize", checkMobile); // Cleanup on unmount
    };
  }, []);

  return isMobile;
};

// install Swiper modules
// SwiperCore.use([Pagination]);

type Props = {
  product: any;
  products: any[];
};

const Product: React.FC<Props> = ({ product, products, url }) => {
  const [location, setlocation] = useState({});
  const [currency, setcurrency] = useState("TND");

  const checkLocation = async () => {
    const loc = JSON.parse(localStorage.getItem("location") ?? "");
    setlocation(loc);
    setcurrency(loc.currency);
  };
  useEffect(() => {
    checkLocation();
  }, []);

  const isMobile = useMobileDetection();
  const router = useRouter();
  // const img1 = product?.option[0]?.images?.split(",")[0];
  // const img2 = product?.option[1]?.images?.split(",")[0];

  const { addItem } = useCart();
  const { wishlist, addToWishlist, deleteWishlistItem } = useWishlist();
  const [size, setSize] = useState(null);
  const [mainImg, setMainImg] = useState(product?.mainImg);
  const [currentQty, setCurrentQty] = useState(1);
  const [copied, setcopied] = useState(false);
  const [color, setcolor] = useState(product?.option[0]?.color);
  const [productOption, setproductOption] = useState(product?.option[0]);

  const [model, setmodel] = useState(null);

  const listMark = ["IPHONE", "SAMSUNG", "OTHERS"];

  const listIphone = [
    { value: "iPhone 16 Pro Max", label: "iPhone 16 Pro Max" },
    { value: "iPhone 16 Pro", label: "iPhone 16 Pro" },
    { value: "iPhone 16 Plus", label: "iPhone 16 Plus" },
    { value: "iPhone 16", label: "iPhone 16" },

    { value: "iPhone 15 Pro Max", label: "iPhone 15 Pro Max" },
    { value: "iPhone 15 Pro", label: "iPhone 15 Pro" },
    { value: "iPhone 15 Plus", label: "iPhone 15 Plus" },
    { value: "iPhone 15", label: "iPhone 15" },

    { value: "iPhone 14 Pro Max", label: "iPhone 14 Pro Max" },
    { value: "iPhone 14 Pro", label: "iPhone 14 Pro" },
    { value: "iPhone 14 Plus", label: "iPhone 14 Plus" },
    { value: "iPhone 14", label: "iPhone 14" },
    { value: "iPhone 13 Pro Max", label: "iPhone 13 Pro Max" },
    { value: "iPhone 13 Pro", label: "iPhone 13 Pro" },
    { value: "iPhone 13 Mini", label: "iPhone 13 Mini" },
    { value: "iPhone 13", label: "iPhone 13" },
    { value: "iPhone 12 Pro Max", label: "iPhone 12 Pro Max" },
    { value: "iPhone 12 Pro", label: "iPhone 12 Pro" },
    { value: "iPhone 12 Mini", label: "iPhone 12 Mini" },
    { value: "iPhone 12", label: "iPhone 12" },
    { value: "iPhone 11 Pro Max", label: "iPhone 11 Pro Max" },
    { value: "iPhone 11 Pro", label: "iPhone 11 Pro" },
    { value: "iPhone 11", label: "iPhone 11" },
    {
      value: "iPhone SE (3rd generation)",
      label: "iPhone SE (3rd generation)",
    },
    {
      value: "iPhone SE (2nd generation)",
      label: "iPhone SE (2nd generation)",
    },
    { value: "iPhone XR", label: "iPhone XR" },
    { value: "iPhone XS Max", label: "iPhone XS Max" },
    { value: "iPhone XS", label: "iPhone XS" },
    { value: "iPhone X", label: "iPhone X" },
    { value: "iPhone 8 Plus", label: "iPhone 8 Plus" },
    { value: "iPhone 8", label: "iPhone 8" },
    { value: "iPhone 7 Plus", label: "iPhone 7 Plus" },
  ];
  const listSam = [
    { value: "Samsung Galaxy S24 Ultra", label: "Samsung Galaxy S24 Ultra" },
    { value: "Samsung Galaxy S24", label: "Samsung Galaxy S24" },
    { value: "Samsung Galaxy S23 Ultra", label: "Samsung Galaxy S23 Ultra" },
    { value: "Samsung Galaxy S23+", label: "Samsung Galaxy S23+" },
    { value: "Samsung Galaxy S23", label: "Samsung Galaxy S23" },
    { value: "Samsung Galaxy S22 Ultra", label: "Samsung Galaxy S22 Ultra" },
    { value: "Samsung Galaxy S22+", label: "Samsung Galaxy S22+" },
    { value: "Samsung Galaxy S22", label: "Samsung Galaxy S22" },
    { value: "Samsung Galaxy S21 Ultra", label: "Samsung Galaxy S21 Ultra" },
    { value: "Samsung Galaxy S21+", label: "Samsung Galaxy S21+" },
    { value: "Samsung Galaxy S21", label: "Samsung Galaxy S21" },
    { value: "Samsung Galaxy S21 FE", label: "Samsung Galaxy S21 FE" },
    { value: "Samsung Galaxy Z Fold 5", label: "Samsung Galaxy Z Fold 5" },
    { value: "Samsung Galaxy Z Fold 4", label: "Samsung Galaxy Z Fold 4" },
    { value: "Samsung Galaxy Z Fold 3", label: "Samsung Galaxy Z Fold 3" },
    { value: "Samsung Galaxy Z Flip 5", label: "Samsung Galaxy Z Flip 5" },
    { value: "Samsung Galaxy Z Flip 4", label: "Samsung Galaxy Z Flip 4" },
    { value: "Samsung Galaxy Z Flip 3", label: "Samsung Galaxy Z Flip 3" },
    {
      value: "Samsung Galaxy Note 20 Ultra",
      label: "Samsung Galaxy Note 20 Ultra",
    },
    { value: "Samsung Galaxy Note 20", label: "Samsung Galaxy Note 20" },
    { value: "Samsung Galaxy Note 10+", label: "Samsung Galaxy Note 10+" },
    { value: "Samsung Galaxy Note 10", label: "Samsung Galaxy Note 10" },
    { value: "Samsung Galaxy A73", label: "Samsung Galaxy A73" },
    { value: "Samsung Galaxy A72", label: "Samsung Galaxy A72" },
    { value: "Samsung Galaxy A71", label: "Samsung Galaxy A71" },
    { value: "Samsung Galaxy A54", label: "Samsung Galaxy A54" },
    { value: "Samsung Galaxy A53", label: "Samsung Galaxy A53" },
    { value: "Samsung Galaxy A52", label: "Samsung Galaxy A52" },
    { value: "Samsung Galaxy A34", label: "Samsung Galaxy A34" },
    { value: "Samsung Galaxy A33", label: "Samsung Galaxy A33" },
    { value: "Samsung Galaxy A32", label: "Samsung Galaxy A32" },
    { value: "Samsung Galaxy A14", label: "Samsung Galaxy A14" },
    { value: "Samsung Galaxy A13", label: "Samsung Galaxy A13" },
    { value: "Samsung Galaxy A12", label: "Samsung Galaxy A12" },
    { value: "Samsung Galaxy M54", label: "Samsung Galaxy M54" },
    { value: "Samsung Galaxy M53", label: "Samsung Galaxy M53" },
    { value: "Samsung Galaxy M52", label: "Samsung Galaxy M52" },
    { value: "Samsung Galaxy M14", label: "Samsung Galaxy M14" },
    { value: "Samsung Galaxy M13", label: "Samsung Galaxy M13" },
    { value: "Samsung Galaxy M12", label: "Samsung Galaxy M12" },
    { value: "Samsung Galaxy F54", label: "Samsung Galaxy F54" },
    { value: "Samsung Galaxy F23", label: "Samsung Galaxy F23" },
    { value: "Samsung Galaxy F14", label: "Samsung Galaxy F14" },
  ];
  const t = useTranslations("Category");

  const alreadyWishlisted =
    wishlist.filter((wItem) => wItem.id === product.id).length > 0;

  useEffect(() => {
    setMainImg(product?.mainImg);
    setcolor(product?.option[0]?.color);
    setproductOption(product?.option[0]);
  }, [product]);

  const handleSize = (value: string) => {
    setSize(value);
    setmodel(null);
  };

  const currentItem = {
    ...product,
    price: productOption.price,
    img1: productOption?.images?.split(",")[0],
    option: productOption.id,
    size: model?.value,
    qty: currentQty,
  };

  const handleWishlist = () => {
    alreadyWishlisted
      ? deleteWishlistItem!(currentItem)
      : addToWishlist!(currentItem);
  };

  return (
    <div>
      {/* ===== Head Section ===== */}
      <Header title={`${product.name} - TN Prime`} />

      <main id="main-content">
        {/* ===== Breadcrumb Section ===== */}
        <div className="bg-lightgreen h-16 w-full flex items-center border-t-2 border-gray200">
          <div className="app-x-padding app-max-width w-full">
            <div className="breadcrumb">
              <Link href="/">
                <a className="text-gray400">{t("home")}</a>
              </Link>{" "}
              /{" "}
              <Link href={`/product-category/${product.categoryName}`}>
                <a className="text-gray400 capitalize">
                  {t(product.categoryName as string)}
                </a>
              </Link>{" "}
              / <span>{product.name}</span>
            </div>
          </div>
        </div>
        {/* ===== Main Content Section ===== */}
        <div className="itemSection app-max-width app-x-padding flex flex-col md:flex-row">
          <div className="imgSection w-full md:w-1/2 h-full flex">
            {!isMobile ? (
              <>
                <div className="hidden sm:block w-full sm:w-1/4 h-full space-y-4 my-4">
                  {productOption?.images?.split(",").map((el: any) => (
                    <Image
                      className={`cursor-pointer ${
                        mainImg === el
                          ? "opacity-100 border border-gray300"
                          : "opacity-50"
                      }`}
                      onClick={() => setMainImg(el)}
                      src={el as string}
                      alt={product.name}
                      width={1000}
                      height={1482}
                    />
                  ))}
                </div>

                <div
                  className="w-full sm:w-3/4 h-full m-0 sm:m-4 ps-5 pe-5"
                  style={{
                    paddingLeft: "4rem",
                    paddingRight: "4rem",
                  }}
                >
                  <EasyZoomOnMove
                    loadingIndicator
                    mainImage={{
                      src: mainImg,
                      alt: "My Product",
                      width: 600,
                      height: 700,
                    }}
                    zoomImage={{
                      src: mainImg,
                      alt: "My Product",
                    }}
                  />
                </div>
              </>
            ) : (
              <Swiper
                slidesPerView={1}
                spaceBetween={0}
                loop={true}
                pagination={{
                  clickable: true,
                }}
              >
                {" "}
                {productOption?.images?.split(",").map((el: any) => (
                  <SwiperSlide>
                    <LazyLoadImage
                      effect="blur"
                      src={el}
                      className="lazy-image"
                      alt={product?.name}
                      placeholderSrc="/bg-img/skeleton-loading.gif"

                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
          <div className="infoSection w-full md:w-1/2 h-auto py-8 sm:pl-4 flex flex-col">
            <h1 className="text-3xl mb-4">{product.name}</h1>
            <span className="text-2xl text-gray400 mb-2">
              {productOption.price} {currency}
            </span>
            <span className="mb-2 text-justify break-words">
              {product.description}
            </span>
            <span className="mb-2">
              {t("availability")}: {t("in_stock")}
            </span>

            <div className="mb-2 mt-2">
              <strong
                style={{
                  color: "#F14A00",
                }}
              >
                {" "}
                1 - {t("SelectionnerVotreMarquedeTélephone")}
              </strong>

              <div className="sizeContainer flex space-x-4 text-sm mb-4">
                {/* ["IPHONE", "SAMSUNG", "OTHERS"] */}
                {listMark?.map((el: any) => (
                  <div
                    key={el}
                    onClick={() => {
                      handleSize(el);
                    }}
                    className={`flex items-center justify-center border ${
                      size === el
                        ? "border-gray500"
                        : "border-gray300 text-gray400"
                    } cursor-pointer hover:bg-gray500 hover:text-gray100`}
                  >
                    <div>
                      <img
                        src={
                          el === "IPHONE"
                            ? "https://www.tnprime.shop:6443" +
                              "/images/" +
                              "ap.png"
                            : el === "SAMSUNG"
                            ? "https://www.tnprime.shop:6443" +
                              "/images/" +
                              "sam.png"
                            : "https://i.pinimg.com/564x/97/6a/0f/976a0ffd77349036329064a231504f7f.jpg"
                        }
                        height={100}
                        width={100}
                      />
                    </div>
                  </div>
                ))}

                <GhostButton
                  onClick={handleWishlist}
                  extraClass="hover:bg-gray200"
                  size="sm"
                >
                  {alreadyWishlisted ? (
                    <HeartSolid extraClass="inline" />
                  ) : (
                    <Heart extraClass="inline" />
                  )}
                </GhostButton>
              </div>
            </div>

            {size && (
              <div className="mb-2 mt-2">
                <strong
                  style={{
                    color: "#F14A00",
                  }}
                >
                  2 - {t("SelectionnerVotreModeldeTélephone")}
                </strong>

                {["IPHONE", "SAMSUNG"].includes(size) ? (
                  <Select
                    className="w-auto focus:border-gray500 mb-4 z-10"
                    value={model}
                    onChange={(e: any) => {
                      setmodel(e);
                    }}
                    options={
                      size === "IPHONE"
                        ? listIphone
                        : size === "SAMSUNG"
                        ? listSam
                        : []
                    }
                  />
                ) : (
                  <Input
                    type="model"
                    name="model"
                    required
                    extraClass="w-full focus:border-gray500"
                    border="border-2 border-gray300 mb-4"
                    placeholder="Votre Marque et Model (Exp:Oppo F2 ,Nokia 2024 ...)"
                    onChange={(e: any) =>
                      setmodel({
                        value: e.target.value,
                        label: e.target.value,
                      })
                    }
                    value={model?.value}
                  />
                )}
              </div>
            )}

            {model && (
              <div className="mb-2 mt-2">
                <strong
                  style={{
                    color: "#F14A00",
                  }}
                >
                  3 - {t("PlacerVotreCommande")}
                </strong>

                <div className="addToCart flex flex-col sm:flex-row md:flex-col lg:flex-row space-y-4 sm:space-y-0 mb-4">
                  <div className="plusOrMinus h-12 flex border justify-center border-gray300 divide-x-2 divide-gray300 mb-4 mr-0 sm:mr-4 md:mr-0 lg:mr-4">
                    <div
                      onClick={() =>
                        setCurrentQty((prevState) => prevState - 1)
                      }
                      className={`${
                        currentQty === 1 && "pointer-events-none"
                      } h-full w-full sm:w-12 flex justify-center items-center cursor-pointer hover:bg-gray500 hover:text-gray100`}
                    >
                      -
                    </div>
                    <div className="h-full w-28 sm:w-12 flex justify-center items-center pointer-events-none">
                      {currentQty}
                    </div>
                    <div
                      onClick={() =>
                        setCurrentQty((prevState) => prevState + 1)
                      }
                      className="h-full w-full sm:w-12 flex justify-center items-center cursor-pointer hover:bg-gray500 hover:text-gray100"
                    >
                      +
                    </div>
                  </div>
                  <div className="flex h-12 space-x-4 w-full">
                    <Button
                      value={t("add_to_cart")}
                      size="lg"
                      disabled={isEmpty(model) || isNil(model)}
                      extraClass={`flex-grow text-center whitespace-nowrap hover:bg-gray200`}
                      onClick={() => size && addItem!(currentItem)}
                    />
                    <Button
                      value={t("PlacerVotreCommande")}
                      size="lg"
                      disabled={isEmpty(model) || isNil(model)}
                      extraClass={`flex-grow text-center whitespace-nowrap hover:bg-gray200`}
                      onClick={() => {
                        size && addItem!(currentItem);
                        router.push(`/checkout`);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="py-2 focus:outline-none text-left mb-4 border-b-2 border-gray200 flex items-center justify-between">
                    <span>{t("details")}</span>
                    <DownArrow
                      extraClass={`${
                        open ? "" : "transform rotate-180"
                      } w-5 h-5 text-purple-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel
                    className={`text-gray400 animate__animated animate__bounceIn`}
                  >
                    {product.detail}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            {product?.detail.includes("https://www.youtube.com") && (
              <div className="flex items-center mt-4">
                <iframe width="550" height="315" src={product?.detail}></iframe>
              </div>
            )}
          </div>
        </div>
        {/* ===== Horizontal Divider ===== */}
        <div className="border-b-2 border-gray200"></div>

        {/* ===== You May Also Like Section ===== */}
        <div className="recSection my-8 app-max-width app-x-padding">
          <h2 className="text-3xl mb-6">{t("you_may_also_like")}</h2>
          <Swiper
            slidesPerView={2}
            centeredSlides={true}
            spaceBetween={10}
            loop={true}
            grabCursor={true}
            // pagination={{
            //   clickable: true,
            //   type: "bullets",
            // }}
            className="mySwiper card-swiper sm:hidden"
          >
            {products.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="mb-6">
                  <Card key={item.id} item={item} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-10 sm:gap-y-6 mb-10">
            {products.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        </div>
      </main>

      {/* ===== Footer Section ===== */}
      <Footer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
  req,
}) => {
  const paramId = params!.id as string;
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_PRODUCTS_MODULE}/${paramId}`
  );

  const fetchedProduct: any = res.data.data;

  const resProduct = await axios.get(
    `${process.env.NEXT_PUBLIC_PRODUCTS_MODULE}/col/${fetchedProduct?.collectionId}`
  );

  const products: any = resProduct.data.data;

  return {
    props: {
      product: {
        ...fetchedProduct,
        mainImg: fetchedProduct.option[0]?.images?.split(",")[0],
      },
      products: products.map((el: any) => ({
        id: el?.id,
        name: el?.name,
        price: el?.option[0]?.price,
        detail: el?.detail,
        img1: el?.option[0]?.images?.split(",")[0],
        img2:
          el?.option[0]?.images?.split(",")?.length > 1
            ? el?.option[0]?.images?.split(",")[1]
            : el?.option[0]?.images?.split(",")[0],
        // categoryName: "Shirts",
        stock: el?.option[0]?.stock,
        option: el?.option[0]?.id,
        size: el?.option[0].size.split(",")[0],
      })),
      messages: (await import(`../../messages/common/${locale}.json`)).default,
      url: req?.headers?.host + req?.url,
    },
  };
};

export default Product;

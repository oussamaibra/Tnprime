import { FC, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

import Heart from "../../public/icons/Heart";
import styles from "./Card.module.css";
import HeartSolid from "../../public/icons/HeartSolid";
import { itemType } from "../../context/cart/cart-types";
import { useCart } from "../../context/cart/CartProvider";
import { useWishlist } from "../../context/wishlist/WishlistProvider";
import Resize from "../../public/icons/Resize";
import ResizeFull from "../../public/icons/ResizeFull";
import Modal from "@leafygreen-ui/modal";
import { Swiper, SwiperSlide } from "swiper/react";
import Button from "../Buttons/Button";
import GhostButton from "../Buttons/GhostButton";
import { Disclosure } from "@headlessui/react";
import DownArrow from "../../public/icons/DownArrow";
import copy from "copy-to-clipboard";
import Select from "react-select";
import Input from "../../components/Input/Input";
import { isEmpty, isNil, values } from "lodash";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
type Props = {
  item: itemType;
  outStock?: boolean;
  isInsta?: boolean;
};

const Card: FC<Props> = ({
  item,
  outStock = false,
  isInsta = false,
  acc = false,
  frompage,
}) => {
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

  const { addItem } = useCart();

  const t = useTranslations("CartWishlist");
  const { wishlist, addToWishlist, deleteWishlistItem } = useWishlist();
  const { addOne } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWLHovered, setIsWLHovered] = useState(false);
  const [open, setopen] = useState(false);
  const [size, setSize] = useState(null);
  const [currentQty, setCurrentQty] = useState(1);
  const [copied, setcopied] = useState(false);

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

  const currentItem = {
    ...item,
    qty: currentQty,
    size: model?.value ?? listIphone[0].value,
  };
  const { id, name, price, img1, img2 } = item;

  const itemLink =
    Number(item?.stock) <= 0 ? "" : !acc ? `/products/${encodeURIComponent(id)}` :`/${encodeURIComponent(id)}`;

  const alreadyWishlisted =
    wishlist.filter((wItem) => wItem.id === id).length > 0;

  const handleWishlist = () => {
    alreadyWishlisted
      ? deleteWishlistItem!(currentItem)
      : addToWishlist!(currentItem);
  };

  const handleModal = () => {
    setopen(true);
  };

  const handleSize = (value: string) => {
    setSize(value);
    setmodel({});
  };

  return (
    <div className={styles.card}>
      <div
        className={isInsta ? styles.imageContainerInsta : styles.imageContainer}
      >
        {!frompage &&
          Number(item?.discount) !== 2 &&
          Number(item?.discount) !== 0 && (
            <div
              style={{
                backgroundColor: "red",
              }}
              className="absolute top-2 left-2 from-orange-500 text-white text-xs font-bold px-3 py-1 z-10 shadow-md animate-pulse mt-5"
            >
              {Number(item?.discount) === 1
                ? t("Out Of Stock")
                : Number(item?.discount) === 3
                ? t("New Collection")
                : ""}
            </div>
          )}

        <Link href={itemLink}>
          <a
            tabIndex={-1}
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {!isHovered && (
              // <Image
              //   src={img1 as string}
              //   alt={name}
              //   width={230}
              //   height={400}
              //   layout="responsive"
              // />

              <LazyLoadImage
                effect="blur"
                src={img1 as string}
                className="lazy-image"
                placeholderSrc="/bg-img/skeleton-loading.gif"
              />
            )}
            {isHovered && (
              // <Image
              //   className="transition-transform transform hover:scale-110 duration-1000"
              //   src={img2 as string}
              //   alt={name}
              //   width={230}
              //   height={400}
              //   layout="responsive"
              // />

              <Image
                className="transition-transform transform hover:scale-110 duration-1000"
                src={img2 as string}
                alt={name}
                layout="fill"
              />

              // <LazyLoadImage
              //   effect="blur"
              //   src={img2 as string}
              //   className="lazy-image"
              // />
            )}
          </a>
        </Link>
        <button
          type="button"
          className="absolute top-2 right-2 p-1 rounded-full"
          aria-label="Wishlist"
          onClick={handleWishlist}
          onMouseOver={() => setIsWLHovered(true)}
          onMouseLeave={() => setIsWLHovered(false)}
        >
          {isWLHovered || alreadyWishlisted ? <HeartSolid /> : <Heart />}
        </button>
        {/* <button
          type="button"
          onClick={() => addOne!(item)}
          className={!outStock ? styles.addBtn : styles.addBtnDisabled}
          disabled={outStock}
        >
          {!outStock ? t("add_to_cart") : <>Non disponible</>}
        </button> */}
      </div>

      <div className="content">
        <Link href={itemLink}>
          <a className={styles.itemName}>{name}</a>
        </Link>
        <div className="text-gray400">
          {" "}
          <strong>
            {" "}
            {price} {currency}{" "}
          </strong>
        </div>
        {/* <button
          type="button"
          onClick={() => addOne!(item)}
          className="uppercase font-bold text-sm sm:hidden"
          disabled={outStock}
        >
          {!outStock ? t("add_to_cart") : <>Non disponible</>}
        </button> */}
      </div>
      <Modal
        open={open}
        setOpen={() => {
          setopen(false);
          setIsHovered(false);
        }}
        className="z-50 p-0"
        contentClassName={styles.contentClass}
      >
        <div className="w-full">
          <Swiper
            slidesPerView={1}
            spaceBetween={0}
            loop={true}
            pagination={{
              clickable: true,
            }}
            className="w-full"
          >
            <SwiperSlide>
              <Image
                className="w-full"
                src={item?.img1 as string}
                width={420}
                height={720}
                alt={item.name}
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                className="w-full"
                src={item?.img2 as string}
                width={420}
                height={720}
                alt={item.name}
              />
            </SwiperSlide>
          </Swiper>
          {/* <Image className="w-full" src={mainImg as string} width={1000} height={1282} alt={product.name} /> */}
        </div>
        <div className=" h-auto py-8 sm:pl-4 flex flex-col">
          <h1 className="text-3xl mb-4">{item.name}</h1>
          <span className="text-2xl text-gray400 mb-2">
            {item.price} {currency}
          </span>
          <span className="mb-2 text-justify break-words">
            {item.description}
          </span>
          <span className="mb-2">
            {t("availability")}: {t("in_stock")}
          </span>
          <span className="mb-2">
            {t("size")}: {size}
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
                  className="w-full focus:border-gray500 mb-4 z-10"
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
                    onClick={() => setCurrentQty((prevState) => prevState - 1)}
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
                    onClick={() => setCurrentQty((prevState) => prevState + 1)}
                    className="h-full w-full sm:w-12 flex justify-center items-center cursor-pointer hover:bg-gray500 hover:text-gray100"
                  >
                    +
                  </div>
                </div>
                <div className="flex h-12 space-x-4 w-full">
                  <Button
                    value={t("add_to_cart")}
                    size="lg"
                    disabled={
                      isEmpty(model) || isNil(model) || Number(item?.stock) <= 0
                    }
                    extraClass={`flex-grow text-center whitespace-nowrap hover:bg-gray200`}
                    onClick={() => size && addItem!(currentItem)}
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
                  className={`text-gray400 animate__animated animate__bounceIn break-words`}
                >
                  {item.detail}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <div className="flex items-center mt-4">
            <span>{t("shareLink")}</span>
            <div
              className="ml-3 cursor-pointer rounded-full h-10 w-10 p-2 flex items-center justify-center hover:bg-gray200"
              onClick={() => {
                copy(window.location.href + "/products/" + item.id);
                setcopied(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 50 50"
                className={`svg-inline--fa fa-instagram fa-w-14`}
              >
                <path d="M 40 0 C 34.53125 0 30.066406 4.421875 30 9.875 L 15.90625 16.9375 C 14.25 15.71875 12.207031 15 10 15 C 4.488281 15 0 19.488281 0 25 C 0 30.511719 4.488281 35 10 35 C 12.207031 35 14.25 34.28125 15.90625 33.0625 L 30 40.125 C 30.066406 45.578125 34.53125 50 40 50 C 45.511719 50 50 45.511719 50 40 C 50 34.488281 45.511719 30 40 30 C 37.875 30 35.902344 30.675781 34.28125 31.8125 L 20.625 25 L 34.28125 18.1875 C 35.902344 19.324219 37.875 20 40 20 C 45.511719 20 50 15.511719 50 10 C 50 4.488281 45.511719 0 40 0 Z M 40 2 C 44.429688 2 48 5.570313 48 10 C 48 14.429688 44.429688 18 40 18 C 38.363281 18 36.859375 17.492188 35.59375 16.65625 C 35.46875 16.238281 35.089844 15.949219 34.65625 15.9375 C 34.652344 15.933594 34.628906 15.941406 34.625 15.9375 C 33.230469 14.675781 32.292969 12.910156 32.0625 10.9375 C 32.273438 10.585938 32.25 10.140625 32 9.8125 C 32.101563 5.472656 35.632813 2 40 2 Z M 30.21875 12 C 30.589844 13.808594 31.449219 15.4375 32.65625 16.75 L 19.8125 23.1875 C 19.472656 21.359375 18.65625 19.710938 17.46875 18.375 Z M 10 17 C 11.851563 17 13.554688 17.609375 14.90625 18.65625 C 14.917969 18.664063 14.925781 18.679688 14.9375 18.6875 C 14.945313 18.707031 14.957031 18.730469 14.96875 18.75 C 15.054688 18.855469 15.160156 18.9375 15.28125 19 C 15.285156 19.003906 15.308594 18.996094 15.3125 19 C 16.808594 20.328125 17.796875 22.222656 17.96875 24.34375 C 17.855469 24.617188 17.867188 24.925781 18 25.1875 C 17.980469 25.269531 17.96875 25.351563 17.96875 25.4375 C 17.847656 27.65625 16.839844 29.628906 15.28125 31 C 15.1875 31.058594 15.101563 31.132813 15.03125 31.21875 C 13.65625 32.332031 11.914063 33 10 33 C 5.570313 33 2 29.429688 2 25 C 2 20.570313 5.570313 17 10 17 Z M 19.8125 26.8125 L 32.65625 33.25 C 31.449219 34.5625 30.589844 36.191406 30.21875 38 L 17.46875 31.625 C 18.65625 30.289063 19.472656 28.640625 19.8125 26.8125 Z M 40 32 C 44.429688 32 48 35.570313 48 40 C 48 44.429688 44.429688 48 40 48 C 35.570313 48 32 44.429688 32 40 C 32 37.59375 33.046875 35.433594 34.71875 33.96875 C 34.742188 33.949219 34.761719 33.929688 34.78125 33.90625 C 34.785156 33.902344 34.808594 33.910156 34.8125 33.90625 C 34.972656 33.839844 35.113281 33.730469 35.21875 33.59375 C 36.554688 32.597656 38.199219 32 40 32 Z"></path>
              </svg>
            </div>
            {copied && <p className="text-blue">{t("copié!")}</p>}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Card;

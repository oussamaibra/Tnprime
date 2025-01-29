import { FC, useState } from "react";
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

type Props = {
  item: itemType;
  outStock?: boolean;
};

const Card: FC<Props> = ({ item, outStock = false }) => {


    const [location, setlocation] = useState({});
    const [currency, setcurrency] = useState("TND");
    
    const checkLocation = async () => {
      const loc = JSON.parse(localStorage.getItem("location") ?? "");
      setlocation(loc);
      setcurrency(loc.currency)
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

  const itemLink = `/products/${encodeURIComponent(id)}`;

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
      <div className={styles.imageContainer}>
        <Link href={itemLink}>
          <a
            tabIndex={-1}
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {!isHovered && (
              <Image
                src={img1 as string}
                alt={name}
                width={230}
                height={400}
                layout="responsive"
              />
            )}
            {isHovered && (
              <Image
                className="transition-transform transform hover:scale-110 duration-1000"
                src={img2 as string}
                alt={name}
                width={230}
                height={400}
                layout="responsive"
              />
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
        {isHovered && (
          <button
            type="button"
            className="h-10 w-10 flex items-center justify-center hover:bg-gray200 transition-transform transform hover:scale-220 duration-2000 absolute top-12 right-1 p-1 rounded-full"
            aria-label="Wishlist"
            onClick={handleModal}
          >
            <Resize />
          </button>
        )}
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
          <strong> {price} {currency} </strong>
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
          <span className="text-2xl text-gray400 mb-2">{item.price} {currency}</span>
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
                color: "red",
              }}
            >
              {" "}
              1 - Selectionner Votre Marque de Télephone
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
                          ? "https://www.pngarts.com/files/8/Apple-iPhone-11-PNG-Photo.png"
                          : el === "SAMSUNG"
                          ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUzCeKfBzO6CgrJc_t3XcS0VLhtZ-N7gKzvQ&s"
                          : "https://image.oppo.com/content/dam/oppo/common/mkt/v2-2/oppo-a3-pro-5g-en/featured/640_640-purple.png.thumb.webp"
                      }
                      height={100}
                      width={100}
                    />
                    <p className="text-center">{el} </p>
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
                  color: "red",
                }}
              >
                2 - Selectionner Votre Model de Télephone
              </strong>

              {["IPHONE", "SAMSUNG"].includes(size) ? (
                <Select
                  className="w-full focus:border-gray500 mb-4"
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
                  color: "red",
                }}
              >
                3 - Placer Votre Commande
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
                    disabled={isEmpty(model) || isNil(model)}
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
              className="ml-3 cursor-pointer rounded-full h-10 w-10 flex items-center justify-center hover:bg-gray200"
              onClick={() => {
                copy(window.location.href + "products/" + item.id);
                setcopied(true);
              }}
            ></div>
            {copied && <p className="text-blue">copié!</p>}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Card;

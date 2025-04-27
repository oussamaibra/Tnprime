/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";
import { useTranslations } from "next-intl";
import axios from "axios";
import { useRouter } from "next/router";
import Heart from "../../../public/icons/Heart";
import DownArrow from "../../../public/icons/DownArrow";
import FacebookLogo from "../../../public/icons/FacebookLogo";
import InstagramLogo from "../../../public/icons/InstagramLogo";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import GhostButton from "../../../components/Buttons/GhostButton";
import Button from "../../../components/Buttons/Button";
import Card from "../../../components/Card/Card";
import Circle from "@uiw/react-color-circle";
import _, { isEmpty, isNil, values } from "lodash";
import emailjs from "@emailjs/browser";
import { Toaster, toast } from "react-hot-toast";
// swiperjs
import { Swiper, SwiperSlide } from "swiper/react";

// import Swiper core and required modules
import SwiperCore, { Pagination } from "swiper/core";
import { apiProductsType, itemType } from "../../../context/cart/cart-types";
import { useWishlist } from "../../../context/wishlist/WishlistProvider";
import { useCart } from "../../../context/cart/CartProvider";
import HeartSolid from "../../../public/icons/HeartSolid";
import { EasyZoomOnMove } from "easy-magnify";
import copy from "copy-to-clipboard";
import Select from "react-select";
import Input from "../../../components/Input/Input";
import { LazyLoadImage } from "react-lazy-load-image-component";
import CardIG from "../../../components/Card/CardIG";
import { useAuth } from "../../../context/AuthContext";
import { roundDecimal } from "../../../components/Util/utilFunc";
import moment from "moment";
import { fbPixelAddToCart, fbPixelPurchase } from "../../../context/Util/fb";

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

const ProductIG: React.FC<Props> = ({ product, products, url, paramId }) => {
  const { cart, clearCart } = useCart();
  const [location, setlocation] = useState({});
  const [currency, setcurrency] = useState("TND");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const auth = useAuth();

  const checkLocation = async () => {
    const loc = JSON.parse(localStorage.getItem("location") ?? "");
    setlocation(loc);
    setcurrency(loc.currency);
  };
  useEffect(() => {
    checkLocation();
  }, []);

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [shippingAddress, setShippingAddress] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  // const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [orderError, setOrderError] = useState("");
  const [sendEmail, setSendEmail] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);
  const [paymentSuccess, setpaymentSuccess] = useState(false);

  // const products = cart.map((item) => ({
  //   id: Number(_.uniqueId()),
  //   quantity: item.qty,
  //   option: item?.option,
  //   size: item?.size,
  // }));

  const isMobile = useMobileDetection();
  const router = useRouter();
  // const img1 = product?.option[0]?.images?.split(",")[0];
  // const img2 = product?.option[1]?.images?.split(",")[0];

  const { addItem } = useCart();
  const { wishlist, addToWishlist, deleteWishlistItem } = useWishlist();
  const [size, setSize] = useState(null);
  // const [mainImg, setMainImg] = useState(product?.mainImg);
  const [currentQty, setCurrentQty] = useState(1);
  // const [copied, setcopied] = useState(false);
  // const [color, setcolor] = useState(product?.option[0]?.color);
  // const [productOption, setproductOption] = useState(product?.option[0]);

  const [model, setmodel] = useState({
    value: "iPhone 16 Pro Max",
    label: "iPhone 16 Pro Max",
  });
  const [selectedColor, setselectedColor] = useState("#77B5FE");
  const [images, setimages] = useState([
    "https://www.tnprime.shop:6443/images/newProd (6).jpeg",
    "https://www.tnprime.shop:6443/images/newProd (1).jpeg",
  ]);

  const colorOptions = ["#77B5FE", "#000", "red"];

  const t = useTranslations("Category");
  const t2 = useTranslations("CartWishlist");

  const alreadyWishlisted =
    wishlist.filter((wItem) => wItem.id === product.id).length > 0;

  const images1 = [
    "https://www.tnprime.shop:6443/images/newProd (6).jpeg",
    "https://www.tnprime.shop:6443/images/newProd (1).jpeg",
  ];
  const images2 = [
    "https://www.tnprime.shop:6443/images/newProd (2).jpeg",
    "https://www.tnprime.shop:6443/images/newProd (3).jpeg",
  ];
  const images3 = [
    "https://www.tnprime.shop:6443/images/newProd (4).jpeg",
    "https://www.tnprime.shop:6443/images/newProd (5).jpeg",
  ];

  const imagesList = [images1, images2, images3];

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
  ];

  const currentItem = {
    price: 49,
    img1: images[0],
    option: 1,
    size: `${model?.value} & ${
      selectedColor === "#77B5FE"
        ? "Blue"
        : selectedColor === "#000"
        ? "Black"
        : "Red"
    }`,
    qty: currentQty,
  };

  const Ordering = () => {
    let HTMT = `<table
          style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0;"
          role="presentation">

          <tbody>

          <tr>

          <td style="padding:20px; color: #000; background:#00aaa8;"> Name of Client
          </td>

           <td style="padding:20px; color: #000; background:#00aaa8;"> Email of Client
          </td>

            <td style="padding:20px; color: #000; background:#00aaa8;"> Phone of Client
          </td>

            <td style="padding:20px; color: #000; background:#00aaa8;"> Product Link
          </td>

                 <td style="padding:20px; color: #000; background:#00aaa8;"> Product QTY
          </td>

                  <td style="padding:20px; color: #000; background:#00aaa8;"> Product Size
          </td>

          </tr>`;

    HTMT = `${HTMT}

             <tr>

          <td style="padding:20px; color: #000; background:#00aaa8;"> ${name}
          </td>

           <td style="padding:20px; color: #000; background:#00aaa8;">
          </td>

            <td style="padding:20px; color: #000; background:#00aaa8;">${phone}
          </td>

            <td style="padding:20px; color: #000; background:#00aaa8;">
            <div>
            <img src=${images[0]} alt="IMAGE" width={50} height={50}/>
            <div/>
          </td>

                 <td style="padding:20px; color: #000; background:#00aaa8;"> ${currentQty}
          </td>

                  <td style="padding:20px; color: #000; background:#00aaa8;">${
                    model?.value
                  } & ${
      selectedColor === "#77B5FE"
        ? "Blue"
        : selectedColor === "#000"
        ? "Black"
        : "Red"
    }
          </td>

          </tr>
            `;

    HTMT = `${HTMT}
      </tbody>
     <table />`;

    const templateParams = {
      email: "iskande.mtir112@gmail.com",
      subject: "NEW ORDER TN PRIME ",
      message: HTMT,
    };

    const serviceID = "service_mhtcnzr";
    const templateID = "template_lnq0ocu";
    const publicKey = "T1Ae1JmubELMx5-RX";

    emailjs
      .send(serviceID, templateID, templateParams, publicKey)
      .then(() => {
        console.error("zszzzzzzzz");
      })
      .catch((res) => {
        console.error("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", res.message);
      });

    // if not logged in, register the user
    const registerUser = async () => {
      const regResponse = await auth.register!(
        `client${Date.now()}@client.com`,
        name,
        "12345667889",
        shippingAddress,
        phone,
        phone
      );
      if (!regResponse.success) {
        return false;
      }
    };

    registerUser();

    const products = [
      {
        id: Number(_.uniqueId()),
        quantity: currentQty,
        image: images[0],
        size: `${model?.value} & ${
          selectedColor === "#77B5FE"
            ? "Blue"
            : selectedColor === "#000"
            ? "Black"
            : "Red"
        }`,
      },
    ];

    const makeOrder = async () => {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_ORDERS_MODULE}`, {
        customerName: name,
        customerPhone: phone,
        shippingAddress: shippingAddress,
        ville: moment().format("YYYY-MM-DD HH:mm"),
        gouvernorat: moment().format("YYYY-MM-DD HH:mm"),
        totalPrice:
          currentQty === 1
            ? Number(roundDecimal(Number(49) * Number(currentQty))) + 8
            : Number(
                roundDecimal(
                  Number(49) * Number(currentQty) - Number(currentQty - 1) * 8
                )
              ) + 8,
        deliveryDate: new Date().setDate(new Date().getDate() + 2),
        paymentType: "OTHERS",
        deliveryType: "DOMICILE",
        orderDate: moment().format("YYYY-MM-DD HH:mm"),
        products,
        sendEmail,
      });
      if (res?.data?.success) {
        toast.success(t("Order Passed")); // Displays a success message

        fbPixelPurchase(
          currentQty === 1
            ? Number(roundDecimal(Number(49) * Number(currentQty))) + 8
            : Number(
                roundDecimal(
                  Number(49) * Number(currentQty) - Number(currentQty - 1) * 8
                )
              ) + 8
        );

        router.push("/coming-soon");
        setName("");
        setPhone("");
        setShippingAddress("");
      } else {
        setName("");
        setPhone("");
        setShippingAddress("");
      }
    };

    makeOrder();
  };

  return (
    <div>
      <Toaster position="top-center" />

      {/* ===== Head Section ===== */}
      <Header title={`Peace Case 3D - TN Prime`} />

      <main id="main-content">
        {/* ===== Breadcrumb Section ===== */}
        <div className="bg-lightgreen h-16 w-full flex items-center border-t-2 border-gray200">
          <div className="app-x-padding app-max-width w-full">
            <div className="breadcrumb">
              <Link href="/">
                <a className="text-gray400">{t("home")}</a>
              </Link>{" "}
              /{" "}
              <Link href={`/fr/products/cover/1`}>
                <a className="text-gray400 capitalize">products/cover</a>
              </Link>{" "}
              / <span>Peace Case 3D</span>
            </div>
          </div>
        </div>
        {/* ===== Main Content Section ===== */}
        <div className="itemSection app-max-width app-x-padding flex flex-col md:flex-row">
          <div className="imgSection w-full md:w-1/2 h-full flex">
            <Swiper
              slidesPerView={1}
              spaceBetween={0}
              loop={true}
              pagination={{
                clickable: true,
              }}
            >
              {" "}
              {images.map((el: any) => (
                <SwiperSlide>
                  <LazyLoadImage
                    effect="blur"
                    src={el}
                    className="lazy-image"
                    alt={"Peace Case 3D"}
                    placeholderSrc="/bg-img/skeleton-loading.gif"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="infoSection w-full md:w-1/2 h-auto py-8 sm:pl-4 flex flex-col">
            <h1 className="text-3xl mb-4">{"Peace Case 3D"}</h1>

            {/* <span className="text-2xl text-red mb-2 animate-pulse">
              <Link href="/">
                <a className="animate-pulse">
                  {" "}
                  {t("See more products click here")}
                </a>
              </Link>{" "}
            </span> */}

            <span className="text-2xl text-gray400 mb-2">
              {49} {currency}
            </span>

            <div className="mb-2 mt-2">
              <strong
                style={{
                  color: "#F14A00",
                }}
              >
                {" "}
                1 - {"Selectionner le Color"}
              </strong>

              <div className="colorContainer flex space-x-4 text-sm mb-4 mt-3">
                {colorOptions?.map((color: string, index) => (
                  <div
                    key={color}
                    onClick={() => {
                      setselectedColor(color);
                      setimages(imagesList[index]);
                    }}
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      selectedColor === color
                        ? "border-red-500"
                        : "border-gray-300"
                    } cursor-pointer`}
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    {selectedColor === color && (
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-2 mt-2">
              <strong
                style={{
                  color: "#F14A00",
                }}
              >
                {" "}
                2 - {"Selectionner le Model"}
              </strong>

              <div className="colorContainer flex space-x-4 text-sm mb-4 mt-3">
                <Select
                  className="w-auto focus:border-gray500 mb-4 z-10"
                  value={model}
                  onChange={(e: any) => {
                    setmodel(e);
                  }}
                  options={listIphone}
                />
              </div>
            </div>

            <span className="mb-2 mt-2 text-justify break-words">
              {`•	Impression 3D de haute précision : finition lisse et durable
	              •	Matériau écologique PLA Premium
	              •	Design exclusif “Peace & Victory”
	              •	Protection intégrale contre les chocs et les rayures
	              •	Prise en main confortable`
                .split("•")
                .map(
                  (el, index) =>
                    index > 0 && (
                      <>
                        <div> ✅ {el} </div> <br />
                      </>
                    )
                )}
            </span>
            <span className="mb-2">
              {t("availability")}: {t("in_stock")}
            </span>

            {/* <div className="mb-2 mt-2">
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
                    disabled={isEmpty(selectedColor) || isNil(selectedColor)}
                    extraClass={`flex-grow text-center whitespace-nowrap hover:bg-gray200`}
                    onClick={() => {
                      addItem!(currentItem);
                      fbPixelAddToCart();
                    }}
                  />
                </div>
              </div>
            </div> */}

            <div
              style={{
                //  border:"1px solid",
                //  padding:"10px",
                marginBottom: "20px",
              }}
            >
              <div className="mb-2">
                <div className="my-4">
                  <label htmlFor="name" className="text-lg">
                    {t2("NometPrénom")}
                  </label>
                  <Input
                    name="name"
                    type="text"
                    extraClass="w-full mt-1 mb-2"
                    border="border-2 border-gray400"
                    value={name}
                    onChange={(e) =>
                      setName((e.target as HTMLInputElement).value)
                    }
                    required
                  />
                </div>

                <div className="my-4">
                  <label htmlFor="phone" className="text-lg">
                    {t2("phone")}
                  </label>
                  <Input
                    placeholder="exp : 99 999 999"
                    name="phone"
                    type="number"
                    extraClass="w-full mt-1 mb-2"
                    border="border-2 border-gray400"
                    value={phone}
                    onChange={(e) =>
                      setPhone((e.target as HTMLInputElement).value)
                    }
                    required
                  />
                </div>

                <div className="my-4">
                  <label htmlFor="shipping_address" className="text-lg">
                    {t2("shipping_address")}
                  </label>

                  <textarea
                    id="shipping_address"
                    aria-label="shipping address"
                    className="w-full mt-1 mb-2 border-2 border-gray400 p-4 outline-none"
                    rows={4}
                    value={shippingAddress}
                    onChange={(e) =>
                      setShippingAddress(
                        (e.target as HTMLTextAreaElement).value
                      )
                    }
                  />
                </div>
              </div>

              <div className="py-3 flex justify-between">
                <span className="uppercase">{t2("subtotal")}</span>
                <span>
                  {" "}
                  {Number(roundDecimal(Number(49) * Number(currentQty)))}
                  {currency}{" "}
                </span>
              </div>

              {currentQty > 1 && (
                <div
                  className="py-3 flex justify-between"
                  style={{
                    color: "red",
                  }}
                >
                  <span className="uppercase">
                    {"Disount (pour plus 2eme Skin)"}
                  </span>
                  <span>
                    {" "}
                    {Number(currentQty - 1) * 8} {currency}
                  </span>
                </div>
              )}

              <div className="py-3 flex justify-between">
                <span className="uppercase">{"Livraison"}</span>
                <span>
                  {" "}
                  {8} {currency}
                </span>
              </div>

              <hr />
              <div>
                <div className="flex justify-between py-3">
                  <span>{t2("grand_total")}</span>
                  <span>
                    {" "}
                    {currentQty === 1
                      ? Number(roundDecimal(Number(49) * Number(currentQty))) +
                        8
                      : Number(
                          roundDecimal(
                            Number(49) * Number(currentQty) -
                              Number(currentQty - 1) * 8
                          )
                        ) + 8}{" "}
                    {currency}{" "}
                  </span>
                </div>
              </div>

              {(isEmpty(name) ||
                isEmpty(phone) ||
                phone.length !== 8 ||
                isEmpty(shippingAddress)) && (
                <div
                  className="text-center"
                  style={{
                    color: "red",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <strong>
                    {t(
                      "Saisir tous les données : Nom et Prénom ,Téléphone (8 chiffers), Adresse"
                    )}
                  </strong>
                </div>
              )}

              <div className="flex h-12 space-x-4 w-full">
                <Button
                  value={t("PlacerVotreCommande")}
                  size="lg"
                  disabled={
                    isEmpty(name) ||
                    isEmpty(phone) ||
                    isEmpty(selectedColor) ||
                    phone.length !== 8 ||
                    isEmpty(shippingAddress)
                  }
                  extraClass={`flex-grow text-center whitespace-nowrap hover:bg-gray200`}
                  onClick={() => {
                    setShowConfirmationModal(true);
                  }}
                />
              </div>
            </div>

            {showConfirmationModal && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
                <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4 shadow-2xl border border-gray-100">
                  <div className="flex flex-col items-center">
                    <div className="bg-yellow-50 p-3 rounded-full mb-4">
                      <img
                        src={"/bg-img/tanbih.png"}
                        alt="تنبيه"
                        width={300}
                        height={300}
                        className="animate-pulse"
                      />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 text-center mb-3">
                      تأكيد الطلب
                    </h3>

                    <div className="bg-yellow-50 p-4 rounded-lg mb-6 w-full border border-yellow-100">
                      <p
                        className="text-gray-700 text-center text-sm leading-relaxed"
                        dir="rtl"
                      >
                        <span className="font-bold block mb-2 text-yellow-600">
                          مهم برشة !!{" "}
                        </span>
                        قبل ما تعدي الكوموند، خذ دقيقة و ثبت روحك مليح. كل كولي
                        يرجع، راهو موش كان خسارة في المصروف، أما زادة تعب في
                        التحضير و الوقت اللي نخصصوه ليك.
                      </p>
                      <p
                        className="text-gray-700 text-center text-sm mt-3 leading-relaxed"
                        dir="rtl"
                      >
                        نحب نخدمك بأحسن جودة و نعملك حاجة تليق بيك، و الكوموند
                        متاعنا نخدموها على الطلب – خاصة ليك، بالشكل اللي تحب
                        عليه
                      </p>
                      <p
                        className="text-gray-700 text-center text-sm mt-3 leading-relaxed"
                        dir="rtl"
                      >
                        متأكد من الكوموند، نحبك تعرف إلي نجم تبدل أو ترجع، أما
                        تحت شروط واضحة وبأجل محدد. المسؤولية تبدأ منّا و تكمل
                        بيك. خلي ديما خدمتك و خدمتنا تمشي في بلاصتها. يعطيك
                        الصحة على ثقتك وتفهمك، ومرحبا بيك ديما بكل حب واحترام
                      </p>
                    </div>

                    <div className="flex justify-between w-full gap-3">
                      <Button
                        value={"إلغاء"}
                        size="lg"
                        extraClass={`flex-grow text-center whitespace-nowrap hover:bg-gray200`}
                        onClick={() => {
                          setShowConfirmationModal(true);
                        }}
                      />

                      <Button
                        value={"تأكيد الطلب"}
                        size="lg"
                        extraClass={`flex-grow text-center whitespace-nowrap hover:bg-gray200`}
                        onClick={() => {
                          setShowConfirmationModal(false);
                          Ordering();
                        }}
                      />

                      {/* <button
                        className="flex-1 py-3 px-4 bg-white text-red-600 border border-red-300 rounded-lg font-medium hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-200"
                        onClick={() => setShowConfirmationModal(false)}
                      >
                        إلغاء
                      </button> */}
                      {/* 
                      <button
                        className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-200"
                        onClick={() => {
                          setShowConfirmationModal(false);
                          Ordering();
                        }}
                      >
                        تأكيد الطلب
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* ===== Horizontal Divider ===== */}
        <div className="border-b-2 border-gray200"></div>

        {/* ===== You May Also Like Section ===== */}
        {/* <div className="recSection my-8 app-max-width app-x-padding">
          <h2 className="text-3xl mb-6">{t("you_may_also_like")}</h2>
          <Swiper
            slidesPerView={2}
            // centeredSlides={true}
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
                  <CardIG key={item.id} item={item} frompage={true} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-10 sm:gap-y-6 mb-10">
            {products.map((item) => (
              <CardIG key={item.id} item={item} frompage={true} />
            ))}
          </div>
        </div> */}
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

  return {
    props: {
      paramId,
      messages: (await import(`../../../messages/common/${locale}.json`))
        .default,
    },
  };
};

export default ProductIG;

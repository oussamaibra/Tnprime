/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";
import { useTranslations } from "next-intl";
import axios from "axios";
import { useRouter } from "next/router";
import emailjs from "@emailjs/browser";
import _, { isEmpty } from "lodash";
import moment from "moment";
import { Toaster, toast } from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { EasyZoomOnMove } from "easy-magnify";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/wishlist/WishlistProvider";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Input from "../components/Input/Input";
import Button from "../components/Buttons/Button";
import DownArrow from "../public/icons/DownArrow";
import Card from "../components/Card/Card";
import { fbPixelPurchase } from "../context/Util/fb";

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

type Props = {
  product: Product;
  products: Product[];
  paramId: string;
  url: string;
};

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return isMobile;
};

const ProductPage: React.FC<Props> = ({ product, products, paramId, url }) => {
  const router = useRouter();
  const t = useTranslations("Category");
  const t2 = useTranslations("CartWishlist");
  const isMobile = useMobileDetection();
  const auth = useAuth();
  const { wishlist, addToWishlist, deleteWishlistItem } = useWishlist();
  const [currency, setCurrency] = useState("TND");

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [mainImg, setMainImg] = useState(
    product.varient[0].images.split(",")[0]
  );
  const [currentQty, setCurrentQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(product.varient[0]);

  const alreadyWishlisted = wishlist.some((wItem) => wItem.id === product._id);

  useEffect(() => {
    const loc = JSON.parse(
      localStorage.getItem("location") || { currency: "TND" }
    );
    setCurrency(loc.currency);
  }, []);

  const currentItem = {
    id: product._id,
    name: product.name,
    price: selectedVariant.price,
    discount: product.discount,
    img1: selectedVariant.images.split(",")[0],
    img2:
      selectedVariant.images.split(",")[1] ||
      selectedVariant.images.split(",")[0],
    option: selectedVariant.name,
    size: selectedVariant.name,
    qty: currentQty,
    detail: product.details,
    stock: product.stock,
  };

  const handleWishlist = () => {
    alreadyWishlisted
      ? deleteWishlistItem!(currentItem)
      : addToWishlist!(currentItem);
  };

  const handleVariantChange = (variant: (typeof product.varient)[0]) => {
    setSelectedVariant(variant);
    setMainImg(variant.images.split(",")[0]);
  };

  const handleOrder = async () => {
    setIsOrdering(true);
    try {
      // Prepare order data
      const orderData = {
        customerName: name,
        customerPhone: phone,
        shippingAddress,
        ville: moment().format("YYYY-MM-DD HH:mm"),
        gouvernorat: moment().format("YYYY-MM-DD HH:mm"),
        totalPrice: Number(selectedVariant.price) + 8, // Base price + shipping
        deliveryDate: new Date().setDate(new Date().getDate() + 2),
        paymentType: "OTHERS",
        deliveryType: "DOMICILE",
        orderDate: moment().format("YYYY-MM-DD HH:mm"),
        products: [
          {
            id: product._id,
            quantity: currentQty,
            image: selectedVariant.images.split(",")[0],
            size: selectedVariant.name,
          },
        ],
      };

      // Register user if not logged in
      if (!auth.user) {
        await auth.register!(
          `client${Date.now()}@client.com`,
          name,
          "12345667889",
          shippingAddress,
          phone,
          phone
        );
      }

      // Create order
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_ORDERS_MODULE}`,
        orderData
      );

      if (res.data.success) {
        toast.success(t("Order Passed"));
        fbPixelPurchase(Number(selectedVariant.price) + 8);
        router.push("/coming-soon");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error(t("Order Failed"));
    } finally {
      setIsOrdering(false);
      setShowConfirmationModal(false);
    }
  };

  return (
    <div>
      <Toaster position="top-center" />
      <Header title={`${product.name} - TN Prime`} />

      <main id="main-content">
        {/* Breadcrumb Section */}
        <div className="bg-lightgreen h-16 w-full flex items-center border-t-2 border-gray200">
          <div className="app-x-padding app-max-width w-full">
            <div className="breadcrumb">
              <Link href="/">
                <a className="text-gray400">{t("home")}</a>
              </Link>{" "}
              / <span>{product.name}</span>
            </div>
          </div>
        </div>

        {/* Product Section */}
        <div className="itemSection app-max-width app-x-padding flex flex-col md:flex-row">
          {/* Image Gallery */}
          <div className="imgSection w-full md:w-1/2 h-full flex">
            {!isMobile ? (
              <>
                <div className="hidden sm:block w-full sm:w-1/4 h-full space-y-4 my-4">
                  {selectedVariant.images.split(",").map((img, index) => (
                    <Image
                      key={index}
                      className={`cursor-pointer ${
                        mainImg === img
                          ? "opacity-100 border border-gray300"
                          : "opacity-50"
                      }`}
                      onClick={() => setMainImg(img)}
                      src={img}
                      alt={product.name}
                      width={1000}
                      height={1482}
                    />
                  ))}
                </div>

                <div className="w-full sm:w-3/4 h-full m-0 sm:m-4 ps-5 pe-5">
                  <EasyZoomOnMove
                    loadingIndicator
                    mainImage={{
                      src: mainImg,
                      alt: product.name,
                      width: 600,
                      height: 700,
                    }}
                    zoomImage={{
                      src: mainImg,
                      alt: product.name,
                    }}
                  />
                </div>
              </>
            ) : (
              <Swiper slidesPerView={1} spaceBetween={0} loop={true}>
                {selectedVariant.images.split(",").map((img, index) => (
                  <SwiperSlide key={index}>
                    <LazyLoadImage
                      effect="blur"
                      src={img}
                      className="lazy-image"
                      alt={product.name}
                      placeholderSrc="/bg-img/skeleton-loading.gif"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* Product Info */}
          <div className="infoSection w-full md:w-1/2 h-auto py-8 sm:pl-4 flex flex-col">
            <h1 className="text-3xl mb-4">{product.name}</h1>

            <span className="text-2xl text-gray400 mb-2">
              {selectedVariant.price} {currency}
            </span>

            {/* Variant Selection */}
            <div className="mb-4">
              <h3 className="text-lg mb-2">Options:</h3>
              <div className="flex flex-wrap gap-2">
                {product.varient.map((variant, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 border rounded ${
                      selectedVariant.name === variant.name
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleVariantChange(variant)}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>

            <span className="mb-2">
              {t("availability")}:{" "}
              {Number(product.stock) > 0 ? t("in_stock") : t("out_of_stock")}
            </span>

            <span className="mb-2">{product.details}</span>

            {/* Order Form */}
            {Number(product.stock) > 0 && (
              <div className="mb-6">
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
                    onChange={(e) => setName(e.target.value)}
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
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="my-4">
                  <label htmlFor="shipping_address" className="text-lg">
                    {t2("shipping_address")}
                  </label>
                  <textarea
                    id="shipping_address"
                    className="w-full mt-1 mb-2 border-2 border-gray400 p-4 outline-none"
                    rows={4}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                  />
                </div>

                <div className="py-3 flex justify-between">
                  <span className="uppercase">{t2("subtotal")}</span>
                  <span>
                    {selectedVariant.price} {currency}
                  </span>
                </div>

                <div className="py-3 flex justify-between">
                  <span className="uppercase">{"Livraison"}</span>
                  <span>8 {currency}</span>
                </div>

                <hr />
                <div className="flex justify-between py-3">
                  <span>{t2("grand_total")}</span>
                  <span>
                    {Number(selectedVariant.price) + 8} {currency}
                  </span>
                </div>

                {(isEmpty(name) ||
                  isEmpty(phone) ||
                  phone.length !== 8 ||
                  isEmpty(shippingAddress)) && (
                  <div className="text-center text-red-600 my-2">
                    <strong>
                      {t(
                        "Saisir tous les données : Nom et Prénom ,Téléphone (8 chiffers), Adresse"
                      )}
                    </strong>
                  </div>
                )}

                <Button
                  value={
                    isOrdering ? t("Processing...") : t("PlacerVotreCommande")
                  }
                  size="lg"
                  disabled={
                    isEmpty(name) ||
                    isEmpty(phone) ||
                    phone.length !== 8 ||
                    isEmpty(shippingAddress) ||
                    isOrdering
                  }
                  extraClass="flex-grow text-center whitespace-nowrap hover:bg-gray200"
                  onClick={() => setShowConfirmationModal(true)}
                />
              </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmationModal && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
                <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4 shadow-2xl border border-gray-100">
                  <div className="flex flex-col items-center">
                    <div className="bg-yellow-50 p-3 rounded-full mb-4">
                      <img
                        src="/bg-img/tanbih.png"
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
                          مهم برشة !!
                        </span>
                        قبل ما تعدي الكوموند، خذ دقيقة و ثبت روحك مليح. كل كولي
                        يرجع، راهو موش كان خسارة في المصروف، أما زادة تعب في
                        التحضير و الوقت اللي نخصصوه ليك.
                      </p>
                    </div>

                    <div className="flex justify-between w-full gap-3">
                      <Button
                        value={"إلغاء"}
                        size="lg"
                        extraClass="flex-grow text-center whitespace-nowrap hover:bg-gray200"
                        onClick={() => setShowConfirmationModal(false)}
                      />
                      <Button
                        value={"تأكيد الطلب"}
                        size="lg"
                        extraClass="flex-grow text-center whitespace-nowrap hover:bg-gray200"
                        onClick={handleOrder}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Product Details */}
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
                  <Disclosure.Panel className="text-gray400">
                    {product.details.split("✔").map(
                      (detail, index) =>
                        index > 0 && (
                          <div key={index}>
                            ✅ {detail} <br />
                          </div>
                        )
                    )}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>

        {/* Related Products */}
        <div className="recSection my-8 app-max-width app-x-padding">
          <h2 className="text-3xl mb-6">{t("you_may_also_like")}</h2>
          <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-10 sm:gap-y-6 mb-10">
            {products.map((item) => (
              <Card
                key={item._id}
                item={{
                  id: item._id,
                  name: item.name,
                  price: item.varient[0].price,
                  img1: item.varient[0].images.split(",")[0],
                  img2:
                    item.varient[0].images.split(",")[1] ||
                    item.varient[0].images.split(",")[0],
                  detail: item.details,
                  stock: item.stock,
                }}
                frompage={true}
              />
            ))}
          </div>
        </div>
      </main>

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

  try {
    // Fetch the current product
    const productRes = await axios.get(
      `${process.env.NEXT_PUBLIC_ACC_MODULE}/${paramId}`
    );
    const product = productRes.data;

    // Fetch related products
    const productsRes = await axios.get(
      `${process.env.NEXT_PUBLIC_ACC_MODULE}`
    );
    const products = productsRes.data.data;

    return {
      props: {
        product,
        products: products
          ?.filter((p: Product) => p._id !== product._id)
          ?.slice(0, 5),
        paramId,
        messages: (await import(`../messages/common/${locale}.json`))
          .default,
      },
    };
  } catch (error) {
    console.error("Error fetching product data:", error);
    return {
      notFound: true,
    };
  }
};

export default ProductPage;

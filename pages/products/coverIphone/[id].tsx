/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { useTranslations } from "next-intl";
import axios from "axios";
import { useRouter } from "next/router";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import Button from "../../../components/Buttons/Button";
import _, { isEmpty, isNil } from "lodash";
import emailjs from "@emailjs/browser";
import { Toaster, toast } from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCart } from "../../../context/cart/CartProvider";
import Select from "react-select";
import Input from "../../../components/Input/Input";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useAuth } from "../../../context/AuthContext";
import { roundDecimal } from "../../../components/Util/utilFunc";
import moment from "moment";
import { fbPixelPurchase } from "../../../context/Util/fb";
import { HexColorPicker } from "react-colorful";

type Variant = {
  compatibleDevices: string;
  color: string;
  price: number;
  images: string;
  _id: string;
};

type Product = {
  _id: string;
  name: string;
  stock: number;
  discount: string;
  details: string;
  varient: Variant[];
  createdAt: string;
  updatedAt: string;
};

type Props = {
  product: Product;
  paramId: string;
};

const ProductIG: React.FC<Props> = ({ paramId }) => {
  const [location, setLocation] = useState({});
  const [currency, setCurrency] = useState("TND");
  const [product, setproduct] = useState<Product | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const auth = useAuth();

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [currentQty, setCurrentQty] = useState(1);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const fetchPro = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://www.tnprime.shop:6443/api/v1/cases`
      );
      const productList = response.data.data;
      const fetchedProduct = productList[0];

      setproduct(fetchedProduct);
      if (fetchedProduct?.varient && fetchedProduct.varient.length > 0) {
        setSelectedColor(fetchedProduct.varient[0].color);
      }
    } catch (error) {
      console.error("Error fetching pro:", error);
      toast.error("فشل تحميل المنتج");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPro();
  }, [paramId]);

  const router = useRouter();
  const { addItem } = useCart();

  const t = useTranslations("Category");
  const t2 = useTranslations("CartWishlist");

  const currentVariant =
    product?.varient?.find((variant) => variant.color === selectedColor) ||
    product?.varient?.[0];

  const images = currentVariant?.images?.split(",") || [];
  const colorOptions = product?.varient
    ? [...new Set(product.varient.map((v) => v.color))]
    : [];

  const compatibleDevicesOptions =
    currentVariant?.compatibleDevices?.split(",").map((device) => ({
      value: device.trim(),
      label: device.trim(),
    })) || [];

  const currentItem = {
    id: product?._id,
    price: currentVariant?.price || 0,
    img1: images[0],
    option: currentVariant?._id,
    size: selectedDevice?.value || "",
    qty: currentQty,
    name: product?.name || "",
    color: currentVariant?.color || "",
  };

  const checkLocation = async () => {
    const loc = JSON.parse(localStorage.getItem("location") ?? "{}");
    setLocation(loc);
    setCurrency(loc.currency || "TND");
  };

  useEffect(() => {
    checkLocation();
  }, []);

  useEffect(() => {
    setSelectedDevice(null);
  }, [selectedColor]);

  const Ordering = () => {
    if (!product || !currentVariant) return;

    setIsOrdering(true);

    const HTMT = `
      <table style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0;" role="presentation">
        <tbody>
          <tr>
            <td style="padding:20px; color: #000; background:#00aaa8;">Name</td>
            <td style="padding:20px; color: #000; background:#00aaa8;">Phone</td>
            <td style="padding:20px; color: #000; background:#00aaa8;">Product</td>
            <td style="padding:20px; color: #000; background:#00aaa8;">QTY</td>
            <td style="padding:20px; color: #000; background:#00aaa8;">Device</td>
            <td style="padding:20px; color: #000; background:#00aaa8;">Color</td>
          </tr>
          <tr>
            <td style="padding:20px; color: #000; background:#00aaa8;">${name}</td>
            <td style="padding:20px; color: #000; background:#00aaa8;">${phone}</td>
            <td style="padding:20px; color: #000; background:#00aaa8;">
              <img src=${images[0]} alt="Product" width="50" height="50"/>
            </td>
            <td style="padding:20px; color: #000; background:#00aaa8;">${currentQty}</td>
            <td style="padding:20px; color: #000; background:#00aaa8;">${
              selectedDevice?.value || ""
            }</td>
            <td style="padding:20px; color: #000; background:#00aaa8;">${selectedColor}</td>
          </tr>
        </tbody>
      </table>
    `;

    const templateParams = {
      email: "iskande.mtir112@gmail.com",
      subject: "NEW ORDER TN PRIME",
      message: HTMT,
    };

    emailjs
      .send(
        "service_mhtcnzr",
        "template_lnq0ocu",
        templateParams,
        "T1Ae1JmubELMx5-RX"
      )
      .catch(console.error);

    const registerUser = async () => {
      const regResponse = await auth.register!(
        `client${Date.now()}@client.com`,
        name,
        "12345667889",
        shippingAddress,
        phone,
        phone
      );
      return regResponse.success;
    };

    const makeOrder = async () => {
      const products = [
        {
          id: product._id,
          quantity: currentQty,
          image: images[0],
          size: selectedDevice?.value || "",
          price: currentVariant.price,
          name: product.name,
          color: currentVariant.color,
        },
      ];

      const totalPrice =
        Number(roundDecimal(currentVariant.price * currentQty)) + 8;

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_ORDERS_MODULE}`,
          {
            customerName: name,
            customerPhone: phone,
            shippingAddress,
            ville: moment().format("YYYY-MM-DD HH:mm"),
            gouvernorat: moment().format("YYYY-MM-DD HH:mm"),
            totalPrice,
            deliveryDate: new Date().setDate(new Date().getDate() + 2),
            paymentType: "OTHERS",
            deliveryType: "DOMICILE",
            orderDate: moment().format("YYYY-MM-DD HH:mm"),
            products,
            sendEmail: false,
          }
        );

        if (res?.data?.success) {
          toast.success("تم تقديم الطلب بنجاح", {
            duration: 4000,
            style: {
              background: "#10B981",
              color: "white",
            },
          });
          fbPixelPurchase(totalPrice);
          router.push("/coming-soon");
          setName("");
          setPhone("");
          setShippingAddress("");
        }
      } catch (error) {
        console.error("Order failed:", error);
        toast.error("فشل الطلب. يرجى المحاولة مرة أخرى.");
      } finally {
        setIsOrdering(false);
      }
    };

    registerUser().then(() => makeOrder());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="app-max-width app-x-padding py-16">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2">
              <div className="bg-gray-300 animate-pulse rounded-2xl h-96"></div>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="bg-gray-300 animate-pulse rounded-lg h-8 w-3/4"></div>
              <div className="bg-gray-300 animate-pulse rounded-lg h-6 w-1/2"></div>
              <div className="bg-gray-300 animate-pulse rounded-lg h-32 w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            المنتج غير موجود
          </h2>
          <p className="text-gray-600">المنتج الذي تبحث عنه غير موجود.</p>
        </div>
      </div>
    );
  }

  const subtotal = Number(
    roundDecimal((currentVariant?.price || 0) * currentQty)
  );
  const shipping = 8;
  const total = subtotal + shipping;

  const isFormValid =
    !isEmpty(name) &&
    !isEmpty(phone) &&
    phone.length === 8 &&
    !isEmpty(shippingAddress) &&
    selectedDevice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#363636",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            borderRadius: "12px",
          },
        }}
      />
      <Header title={`${product?.name} - TN Prime`} />

      <main id="main-content" className="relative">
        <div className="bg-white shadow-sm">
          <div className="app-x-padding app-max-width py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/">
                <a className="text-blue-600 hover:text-blue-800 transition-colors font-medium">
                  الرئيسية
                </a>
              </Link>
              <span className="text-gray-400">/</span>
              <Link href={`/fr/products/cases/1`}>
                <a className="text-blue-600 hover:text-blue-800 transition-colors font-medium capitalize">
                  المنتجات
                </a>
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-700 font-semibold">
                {product.name}
              </span>
            </nav>
          </div>
        </div>

        <div className="app-max-width app-x-padding py-8 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="relative">
              <div className="sticky top-8">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                    {/* Main Image Slider */}
                    <Swiper
                      slidesPerView={1}
                      spaceBetween={0}
                      loop={images.length > 1}
                      // className="rounded-2xl overflow-hidden mb-4"
                      onSlideChange={(swiper) =>
                        setActiveImageIndex(swiper.realIndex)
                      }
                    >
                      {images.map((image, index) => (
                        <SwiperSlide key={index}>
                          <div
                            className="aspect-square relative group flex items-center justify-center"
                            style={{ maxHeight: "450px" }}
                          >
                            <LazyLoadImage
                              effect="blur"
                              src={image}
                              className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                              alt={product.name}
                              placeholderSrc="/bg-img/skeleton-loading.gif"
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    {/* Thumbnail Images */}
                    <div className="flex justify-center space-x-2 mt-4">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                            activeImageIndex === index
                              ? "ring-2 ring-orange-500"
                              : "opacity-70 hover:opacity-100"
                          }`}
                        >
                          <LazyLoadImage
                            src={image}
                            className="w-full h-full object-cover"
                            alt={`Thumbnail ${index + 1}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <div className="pb-6">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {product.name}
                  </h1>
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-blue-600">
                      {currentVariant?.price} {currency}
                    </span>
                    {product.discount !== "0" && (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="py-6">
                  <label className="block text-lg font-semibold text-gray-900 mb-4">
                    <span className="text-orange-500">1.</span> اختر اللون
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`relative w-12 h-12 rounded-full transition-all duration-300 hover:scale-110 ${
                          selectedColor === color
                            ? "shadow-lg ring-4 ring-orange-100"
                            : "hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: color }}
                        title={`اللون: ${color}`}
                      >
                        {activeImageIndex === color && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="py-6">
                  <label className="block text-lg font-semibold text-gray-900 mb-4">
                    <span className="text-orange-500">2.</span> اختر نموذج
                    الجهاز
                  </label>
                  <Select
                    className="w-full"
                    classNamePrefix="select"
                    value={selectedDevice}
                    onChange={setSelectedDevice}
                    options={compatibleDevicesOptions}
                    placeholder="اختر جهازك..."
                    isDisabled={!selectedColor}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                        padding: "8px",
                        "&:hover": {
                          borderColor: "#F97316",
                        },
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? "#F97316"
                          : state.isFocused
                          ? "#FED7AA"
                          : "white",
                        color: state.isSelected ? "white" : "#374151",
                        padding: "12px 16px",
                      }),
                    }}
                  />
                </div>

                <div className="py-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    تفاصيل المنتج
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.details}
                  </p>
                </div>

                <div className="py-6">
                  <label className="block text-lg font-semibold text-gray-900 mb-4">
                    الكمية
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                      <button
                        onClick={() =>
                          setCurrentQty((prev) => Math.max(1, prev - 1))
                        }
                        className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors font-semibold text-gray-700"
                      >
                        −
                      </button>
                      <div className="w-16 h-12 flex items-center justify-center font-semibold text-gray-900 bg-white border-x border-gray-300">
                        {currentQty}
                      </div>
                      <button
                        onClick={() => setCurrentQty((prev) => prev + 1)}
                        className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors font-semibold text-gray-700"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {product.stock} عنصر متاح
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  معلومات الطلب
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                      placeholder="99 999 999"
                      maxLength={8}
                    />
                    {phone && phone.length !== 8 && (
                      <p className="text-red-500 text-sm mt-1">
                        يجب أن يتكون رقم الهاتف من 8 أرقام
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      عنوان الشحن *
                    </label>
                    <textarea
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none resize-none"
                      placeholder="أدخل عنوانك الكامل"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  ملخص الطلب
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">
                      المجموع ({currentQty} عناصر)
                    </span>
                    <span className="font-semibold text-gray-900">
                      {subtotal} {currency}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">الشحن</span>
                    <span className="font-semibold text-gray-900">
                      {shipping} {currency}
                    </span>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="flex justify-between items-center py-2">
                    <span className="text-xl font-bold text-gray-900">
                      الإجمالي
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {total} {currency}
                    </span>
                  </div>
                </div>

                {!isFormValid && (
                  <div className="mt-6 p-4 bg-red-50 rounded-xl">
                    <p className="text-red-600 text-sm font-medium text-center">
                      يرجى إكمال جميع الحقول المطلوبة للمتابعة
                    </p>
                  </div>
                )}

                <Button
                  value={
                    isOrdering ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>جاري المعالجة...</span>
                      </div>
                    ) : (
                      "تقديم الطلب الآن"
                    )
                  }
                  size="lg"
                  disabled={!isFormValid || isOrdering}
                  extraClass={`w-full flex-grow text-center whitespace-nowrap hover:bg-gray200`}
                  onClick={() => {
                    setShowConfirmationModal(true);
                  }}
                />

                <p className="text-center text-xs text-gray-500 mt-4">
                  دفع آمن • إرجاع مجاني • دعم على مدار الساعة
                </p>
              </div>
            </div>
          </div>
        </div>

        {showConfirmationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden">
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    تأكيد طلبك
                  </h3>
                  <p className="text-gray-600">
                    يرجى مراجعة تفاصيل طلبك قبل المتابعة
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">المنتج:</span>
                      <span className="font-semibold">{product.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">اللون:</span>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: selectedColor }}
                        ></div>
                        <span className="font-semibold">{selectedColor}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الجهاز:</span>
                      <span className="font-semibold">
                        {selectedDevice?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الكمية:</span>
                      <span className="font-semibold">{currentQty}</span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">الإجمالي:</span>
                      <span className="font-bold text-blue-600">
                        {total} {currency}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between w-full gap-2 sm:gap-3 mt-auto">
                  <Button
                    value={"إلغاء"}
                    size="md sm:lg"
                    extraClass={`flex-grow text-center whitespace-nowrap hover:bg-gray-200 text-sm sm:text-base`}
                    onClick={() => {
                      setShowConfirmationModal(false);
                    }}
                  />

                  <Button
                    value={"تأكيد الطلب"}
                    size="md sm:lg"
                    extraClass={`flex-grow text-center whitespace-nowrap hover:bg-gray-200 text-sm sm:text-base`}
                    onClick={() => {
                      setShowConfirmationModal(false);
                      Ordering();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
}) => {
  const paramId = params!.id as string;

  try {
    return {
      props: {
        paramId,
        messages: (await import(`../../../messages/common/${locale}.json`))
          .default,
      },
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      notFound: true,
    };
  }
};

export default ProductIG;

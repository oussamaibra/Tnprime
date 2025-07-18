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
import { Star, StarIcon } from "lucide-react";

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

const ProductOptions = ({
  product,
  currency,
  packageOptions,
  pairSelections,
  setPairSelections,
  setSelectedPackage,
  selectedPackage,
  products,
}) => {
  const handleModelChange = (index, value) => {
    const updatedSelections = {
      ...pairSelections,
      [index]: {
        ...pairSelections[index],
        model: value,
      },
    };
    setPairSelections(updatedSelections);
  };

  const handleProductChange = (index, selectedOption) => {
    const updatedSelections = {
      ...pairSelections,
      [index]: {
        ...pairSelections[index],
        product: selectedOption ? selectedOption.value : null,
      },
    };
    setPairSelections(updatedSelections);
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#10b981" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(16, 185, 129, 0.1)" : "none",
      "&:hover": {
        borderColor: "#10b981",
      },
      minHeight: "48px",
      borderRadius: "0.5rem",
      backgroundColor: "white",
      fontSize: "14px",
      cursor: "pointer",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#10b981"
        : state.isFocused
        ? "#f0fdf4"
        : "white",
      color: state.isSelected ? "white" : "#374151",
      padding: "12px",
      fontSize: "14px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: !state.isSelected ? "#f0fdf4" : "#10b981",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
      fontSize: "14px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#9ca3af",
      "&:hover": {
        color: "#6b7280",
      },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: "#9ca3af",
      "&:hover": {
        color: "#ef4444", // Red on hover for clear button
      },
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: "#e5e7eb", // Lighter separator
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#1f2937", // Darker text for selected value
      fontWeight: "500",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
      zIndex: 9999, // Ensure dropdown appears above other elements
    }),
    input: (provided) => ({
      ...provided,
      color: "#1f2937",
      fontSize: "14px",
    }),
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {packageOptions.map((option) => (
          <div
            key={option.id}
            className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
              selectedPackage === option.id
                ? "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg transform scale-[1.02]"
                : "border-gray-200 hover:border-green-300 hover:shadow-md"
            }`}
          >
            <div
              className="flex items-center justify-between"
              onClick={() => {
                setSelectedPackage(option.id);
                setPairSelections([
                  {
                    model: "",
                    product: product,
                  },
                ]);
              }}
            >
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  checked={selectedPackage === option.id}
                  readOnly
                  className="w-5 h-5 text-green-600 border-2 border-gray-300 focus:ring-green-500 focus:ring-2"
                />
                <div className="font-semibold text-gray-800">
                  {option.label}
                  {option.offer && (
                    <span className="ml-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm animate-pulse">
                      {option.description}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl text-green-600">
                  {option.price.toFixed(3)} {currency}
                </div>
                {option.id > 1 && (
                  <div className="text-sm text-gray-500">
                    {option.description}
                  </div>
                )}
              </div>
            </div>

            {selectedPackage === option.id && (
              <div className="mt-8 animate-fadeIn">
                {Array.from({ length: option.id === 3 ? 4 : option.id }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="mb-8 p-6 bg-white rounded-lg border border-gray-100 shadow-sm last:mb-0"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-bold text-gray-800 flex items-center">
                          {/* <span className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                          {index + 1}
                        </span> */}
                        </h4>
                        {pairSelections[index]?.product && (
                          <div className="text-sm text-green-600 font-medium">
                            ✓ تم الاختيار
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            اكتب موديل الهاتف{" "}
                          </label>
                          <input
                            type="text"
                            placeholder="(Iphone 16 pro , SAMSUNG s20) اكتب موديل الهاتف هنا..."
                            value={pairSelections[index]?.model || ""}
                            onChange={(e) =>
                              handleModelChange(index, e.target.value)
                            }
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 text-right placeholder-gray-400"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            اختر المنتج
                          </label>
                          <Select
                            menuPortalTarget={document.body}
                            value={
                              pairSelections[index]?.product
                                ? {
                                    value: pairSelections[index].product,
                                    label: pairSelections[index].product.name,
                                    image: pairSelections[index].product.img1,
                                  }
                                : null
                            }
                            onChange={(selectedOption) =>
                              handleProductChange(index, selectedOption)
                            }
                            options={products.map((el) => ({
                              value: el,
                              label: el.name,
                              image: el.img1,
                            }))}
                            formatOptionLabel={(option) => (
                              <div className="flex items-center gap-4 py-2 z-10">
                                <img
                                  src={option.image}
                                  alt={option.label}
                                  className="w-20 h-16 object-cover rounded-lg border-2 border-gray-100"
                                />
                                <div className="flex-1">
                                  <span className="text-sm font-medium text-gray-800">
                                    {option.label}
                                  </span>
                                </div>
                              </div>
                            )}
                            placeholder="اختر المنتج المناسب..."
                            noOptionsMessage={() => "لا توجد خيارات متاحة"}
                            styles={{
                              ...customSelectStyles,
                              input: (provided) => ({
                                ...provided,
                                caretColor: "transparent", // Hide text cursor
                              }),
                            }}
                            className="react-select-container z-999"
                            classNamePrefix="react-select"
                            blurInputOnSelect={false}
                            isSearchable={false} // 🔴 disables text input and thus keyboard
                            isClearable
                          />
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
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

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_REV_MODULE}/${paramId}`
      );
      setReviews(res.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const checkLocation = async () => {
    const loc = JSON.parse(localStorage.getItem("location") ?? "");
    setlocation(loc);
    setcurrency(loc.currency);
  };

  useEffect(() => {
    fetchReviews();
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
  const [mainImg, setMainImg] = useState(product?.mainImg);
  const [currentQty, setCurrentQty] = useState(1);
  const [copied, setcopied] = useState(false);
  const [color, setcolor] = useState(product?.option[0]?.color);
  const [productOption, setproductOption] = useState(product?.option[0]);

  const [model, setmodel] = useState(null);

  // Review state
  const [reviews, setReviews] = useState<any[]>(product.reviews || []);
  const [newReview, setNewReview] = useState({
    productId: paramId,
    rating: 5,
    message: "",
    name: "",
    email: "",
    image: "",
  });

  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const handleReviewChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating: number) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);

    try {
      // Add new review
      await axios.post(`${process.env.NEXT_PUBLIC_REV_MODULE}`, {
        ...newReview,
        image: imageFile?.name,
        productId: paramId,
      });
      toast.success("Review submitted successfully!");

      // Refresh reviews
      await fetchReviews();
      setImageFile(null);
      // Reset form
      setNewReview({
        productId: paramId,
        rating: 5,
        message: "",
        name: "",
        email: "",
        image: "",
      });
      setEditingReviewId(null);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // const listMark = ["IPHONE", "SAMSUNG", "OTHERS"];

  // const listIphone = [
  //   { value: "iPhone 16 Pro Max", label: "iPhone 16 Pro Max" },
  //   { value: "iPhone 16 Pro", label: "iPhone 16 Pro" },
  //   { value: "iPhone 16 Plus", label: "iPhone 16 Plus" },
  //   { value: "iPhone 16", label: "iPhone 16" },

  //   { value: "iPhone 15 Pro Max", label: "iPhone 15 Pro Max" },
  //   { value: "iPhone 15 Pro", label: "iPhone 15 Pro" },
  //   { value: "iPhone 15 Plus", label: "iPhone 15 Plus" },
  //   { value: "iPhone 15", label: "iPhone 15" },

  //   { value: "iPhone 14 Pro Max", label: "iPhone 14 Pro Max" },
  //   { value: "iPhone 14 Pro", label: "iPhone 14 Pro" },
  //   { value: "iPhone 14 Plus", label: "iPhone 14 Plus" },
  //   { value: "iPhone 14", label: "iPhone 14" },
  //   { value: "iPhone 13 Pro Max", label: "iPhone 13 Pro Max" },
  //   { value: "iPhone 13 Pro", label: "iPhone 13 Pro" },
  //   { value: "iPhone 13 Mini", label: "iPhone 13 Mini" },
  //   { value: "iPhone 13", label: "iPhone 13" },
  //   { value: "iPhone 12 Pro Max", label: "iPhone 12 Pro Max" },
  //   { value: "iPhone 12 Pro", label: "iPhone 12 Pro" },
  //   { value: "iPhone 12 Mini", label: "iPhone 12 Mini" },
  //   { value: "iPhone 12", label: "iPhone 12" },
  //   { value: "iPhone 11 Pro Max", label: "iPhone 11 Pro Max" },
  //   { value: "iPhone 11 Pro", label: "iPhone 11 Pro" },
  //   { value: "iPhone 11", label: "iPhone 11" },
  //   {
  //     value: "iPhone SE (3rd generation)",
  //     label: "iPhone SE (3rd generation)",
  //   },
  //   {
  //     value: "iPhone SE (2nd generation)",
  //     label: "iPhone SE (2nd generation)",
  //   },
  //   { value: "iPhone XR", label: "iPhone XR" },
  //   { value: "iPhone XS Max", label: "iPhone XS Max" },
  //   { value: "iPhone XS", label: "iPhone XS" },
  //   { value: "iPhone X", label: "iPhone X" },
  //   { value: "iPhone 8 Plus", label: "iPhone 8 Plus" },
  //   { value: "iPhone 8", label: "iPhone 8" },
  //   { value: "iPhone 7 Plus", label: "iPhone 7 Plus" },
  // ];
  // const listSam = [
  //   { value: "Samsung Galaxy S6", label: "Samsung Galaxy S6" },
  //   { value: "Samsung Galaxy S6 Edge", label: "Samsung Galaxy S6 Edge" },
  //   { value: "Samsung Galaxy Note 5", label: "Samsung Galaxy Note 5" },
  //   { value: "Samsung Galaxy A3 (2015)", label: "Samsung Galaxy A3 (2015)" },
  //   { value: "Samsung Galaxy A5 (2015)", label: "Samsung Galaxy A5 (2015)" },
  //   { value: "Samsung Galaxy A7 (2015)", label: "Samsung Galaxy A7 (2015)" },
  //   { value: "Samsung Galaxy J1", label: "Samsung Galaxy J1" },
  //   { value: "Samsung Galaxy J5", label: "Samsung Galaxy J5" },
  //   { value: "Samsung Galaxy J7", label: "Samsung Galaxy J7" },
  //   { value: "Samsung Galaxy S7", label: "Samsung Galaxy S7" },
  //   { value: "Samsung Galaxy S7 Edge", label: "Samsung Galaxy S7 Edge" },
  //   { value: "Samsung Galaxy Note 7", label: "Samsung Galaxy Note 7" },
  //   { value: "Samsung Galaxy A3 (2016)", label: "Samsung Galaxy A3 (2016)" },
  //   { value: "Samsung Galaxy A5 (2016)", label: "Samsung Galaxy A5 (2016)" },
  //   { value: "Samsung Galaxy A7 (2016)", label: "Samsung Galaxy A7 (2016)" },
  //   { value: "Samsung Galaxy A8 (2016)", label: "Samsung Galaxy A8 (2016)" },
  //   { value: "Samsung Galaxy J2", label: "Samsung Galaxy J2" },
  //   { value: "Samsung Galaxy J3", label: "Samsung Galaxy J3" },
  //   { value: "Samsung Galaxy J5 (2016)", label: "Samsung Galaxy J5 (2016)" },
  //   { value: "Samsung Galaxy J7 (2016)", label: "Samsung Galaxy J7 (2016)" },
  //   { value: "Samsung Galaxy S8", label: "Samsung Galaxy S8" },
  //   { value: "Samsung Galaxy S8+", label: "Samsung Galaxy S8+" },
  //   { value: "Samsung Galaxy Note 8", label: "Samsung Galaxy Note 8" },
  //   { value: "Samsung Galaxy A3 (2017)", label: "Samsung Galaxy A3 (2017)" },
  //   { value: "Samsung Galaxy A5 (2017)", label: "Samsung Galaxy A5 (2017)" },
  //   { value: "Samsung Galaxy A7 (2017)", label: "Samsung Galaxy A7 (2017)" },
  //   { value: "Samsung Galaxy A8 (2018)", label: "Samsung Galaxy A8 (2018)" },
  //   { value: "Samsung Galaxy J3 (2017)", label: "Samsung Galaxy J3 (2017)" },
  //   { value: "Samsung Galaxy J5 (2017)", label: "Samsung Galaxy J5 (2017)" },
  //   { value: "Samsung Galaxy J7 (2017)", label: "Samsung Galaxy J7 (2017)" },
  //   { value: "Samsung Galaxy S9", label: "Samsung Galaxy S9" },
  //   { value: "Samsung Galaxy S9+", label: "Samsung Galaxy S9+" },
  //   { value: "Samsung Galaxy Note 9", label: "Samsung Galaxy Note 9" },
  //   { value: "Samsung Galaxy A6", label: "Samsung Galaxy A6" },
  //   { value: "Samsung Galaxy A6+", label: "Samsung Galaxy A6+" },
  //   { value: "Samsung Galaxy A7 (2018)", label: "Samsung Galaxy A7 (2018)" },
  //   { value: "Samsung Galaxy A8 (2018)", label: "Samsung Galaxy A8 (2018)" },
  //   { value: "Samsung Galaxy A8+ (2018)", label: "Samsung Galaxy A8+ (2018)" },
  //   { value: "Samsung Galaxy A9 (2018)", label: "Samsung Galaxy A9 (2018)" },
  //   { value: "Samsung Galaxy J4", label: "Samsung Galaxy J4" },
  //   { value: "Samsung Galaxy J6", label: "Samsung Galaxy J6" },
  //   { value: "Samsung Galaxy J8", label: "Samsung Galaxy J8" },
  //   { value: "Samsung Galaxy S10e", label: "Samsung Galaxy S10e" },
  //   { value: "Samsung Galaxy S10", label: "Samsung Galaxy S10" },
  //   { value: "Samsung Galaxy S10+", label: "Samsung Galaxy S10+" },
  //   { value: "Samsung Galaxy S10 5G", label: "Samsung Galaxy S10 5G" },
  //   { value: "Samsung Galaxy Note 10", label: "Samsung Galaxy Note 10" },
  //   { value: "Samsung Galaxy Note 10+", label: "Samsung Galaxy Note 10+" },
  //   { value: "Samsung Galaxy A10", label: "Samsung Galaxy A10" },
  //   { value: "Samsung Galaxy A20", label: "Samsung Galaxy A20" },
  //   { value: "Samsung Galaxy A30", label: "Samsung Galaxy A30" },
  //   { value: "Samsung Galaxy A40", label: "Samsung Galaxy A40" },
  //   { value: "Samsung Galaxy A50", label: "Samsung Galaxy A50" },
  //   { value: "Samsung Galaxy A60", label: "Samsung Galaxy A60" },
  //   { value: "Samsung Galaxy A70", label: "Samsung Galaxy A70" },
  //   { value: "Samsung Galaxy A80", label: "Samsung Galaxy A80" },
  //   { value: "Samsung Galaxy A90 5G", label: "Samsung Galaxy A90 5G" },
  //   { value: "Samsung Galaxy M10", label: "Samsung Galaxy M10" },
  //   { value: "Samsung Galaxy M20", label: "Samsung Galaxy M20" },
  //   { value: "Samsung Galaxy M30", label: "Samsung Galaxy M30" },
  //   { value: "Samsung Galaxy S20", label: "Samsung Galaxy S20" },
  //   { value: "Samsung Galaxy S20+", label: "Samsung Galaxy S20+" },
  //   { value: "Samsung Galaxy S20 Ultra", label: "Samsung Galaxy S20 Ultra" },
  //   { value: "Samsung Galaxy Note 20", label: "Samsung Galaxy Note 20" },
  //   {
  //     value: "Samsung Galaxy Note 20 Ultra",
  //     label: "Samsung Galaxy Note 20 Ultra",
  //   },
  //   { value: "Samsung Galaxy A01", label: "Samsung Galaxy A01" },
  //   { value: "Samsung Galaxy A11", label: "Samsung Galaxy A11" },
  //   { value: "Samsung Galaxy A21", label: "Samsung Galaxy A21" },
  //   { value: "Samsung Galaxy A31", label: "Samsung Galaxy A31" },
  //   { value: "Samsung Galaxy A41", label: "Samsung Galaxy A41" },
  //   { value: "Samsung Galaxy A51", label: "Samsung Galaxy A51" },
  //   { value: "Samsung Galaxy A71", label: "Samsung Galaxy A71" },
  //   { value: "Samsung Galaxy A81", label: "Samsung Galaxy A81" },
  //   { value: "Samsung Galaxy A91", label: "Samsung Galaxy A91" },
  //   { value: "Samsung Galaxy M21", label: "Samsung Galaxy M21" },
  //   { value: "Samsung Galaxy M31", label: "Samsung Galaxy M31" },
  //   { value: "Samsung Galaxy M51", label: "Samsung Galaxy M51" },
  //   { value: "Samsung Galaxy Z Flip", label: "Samsung Galaxy Z Flip" },
  //   { value: "Samsung Galaxy Z Fold 2", label: "Samsung Galaxy Z Fold 2" },
  //   { value: "Samsung Galaxy S21", label: "Samsung Galaxy S21" },
  //   { value: "Samsung Galaxy S21+", label: "Samsung Galaxy S21+" },
  //   { value: "Samsung Galaxy S21 Ultra", label: "Samsung Galaxy S21 Ultra" },
  //   { value: "Samsung Galaxy A02", label: "Samsung Galaxy A02" },
  //   { value: "Samsung Galaxy A12", label: "Samsung Galaxy A12" },
  //   { value: "Samsung Galaxy A22", label: "Samsung Galaxy A22" },
  //   { value: "Samsung Galaxy A32", label: "Samsung Galaxy A32" },
  //   { value: "Samsung Galaxy A42", label: "Samsung Galaxy A42" },
  //   { value: "Samsung Galaxy A52", label: "Samsung Galaxy A52" },
  //   { value: "Samsung Galaxy A72", label: "Samsung Galaxy A72" },
  //   { value: "Samsung Galaxy M12", label: "Samsung Galaxy M12" },
  //   { value: "Samsung Galaxy M22", label: "Samsung Galaxy M22" },
  //   { value: "Samsung Galaxy M32", label: "Samsung Galaxy M32" },
  //   { value: "Samsung Galaxy M52", label: "Samsung Galaxy M52" },
  //   { value: "Samsung Galaxy Z Flip 3", label: "Samsung Galaxy Z Flip 3" },
  //   { value: "Samsung Galaxy Z Fold 3", label: "Samsung Galaxy Z Fold 3" },
  //   { value: "Samsung Galaxy S22", label: "Samsung Galaxy S22" },
  //   { value: "Samsung Galaxy S22+", label: "Samsung Galaxy S22+" },
  //   { value: "Samsung Galaxy S22 Ultra", label: "Samsung Galaxy S22 Ultra" },
  //   { value: "Samsung Galaxy A13", label: "Samsung Galaxy A13" },
  //   { value: "Samsung Galaxy A23", label: "Samsung Galaxy A23" },
  //   { value: "Samsung Galaxy A33", label: "Samsung Galaxy A33" },
  //   { value: "Samsung Galaxy A53", label: "Samsung Galaxy A53" },
  //   { value: "Samsung Galaxy A73", label: "Samsung Galaxy A73" },
  //   { value: "Samsung Galaxy M13", label: "Samsung Galaxy M13" },
  //   { value: "Samsung Galaxy M23", label: "Samsung Galaxy M23" },
  //   { value: "Samsung Galaxy M33", label: "Samsung Galaxy M33" },
  //   { value: "Samsung Galaxy M53", label: "Samsung Galaxy M53" },
  //   { value: "Samsung Galaxy Z Flip 4", label: "Samsung Galaxy Z Flip 4" },
  //   { value: "Samsung Galaxy Z Fold 4", label: "Samsung Galaxy Z Fold 4" },
  //   { value: "Samsung Galaxy S23", label: "Samsung Galaxy S23" },
  //   { value: "Samsung Galaxy S23+", label: "Samsung Galaxy S23+" },
  //   { value: "Samsung Galaxy S23 Ultra", label: "Samsung Galaxy S23 Ultra" },
  //   { value: "Samsung Galaxy A14", label: "Samsung Galaxy A14" },
  //   { value: "Samsung Galaxy A24", label: "Samsung Galaxy A24" },
  //   { value: "Samsung Galaxy A34", label: "Samsung Galaxy A34" },
  //   { value: "Samsung Galaxy A54", label: "Samsung Galaxy A54" },
  //   { value: "Samsung Galaxy A74", label: "Samsung Galaxy A74" },
  //   { value: "Samsung Galaxy M14", label: "Samsung Galaxy M14" },
  //   { value: "Samsung Galaxy M24", label: "Samsung Galaxy M24" },
  //   { value: "Samsung Galaxy M34", label: "Samsung Galaxy M34" },
  //   { value: "Samsung Galaxy M54", label: "Samsung Galaxy M54" },
  //   { value: "Samsung Galaxy Z Flip 5", label: "Samsung Galaxy Z Flip 5" },
  //   { value: "Samsung Galaxy Z Fold 5", label: "Samsung Galaxy Z Fold 5" },
  //   { value: "Samsung Galaxy S24", label: "Samsung Galaxy S24" },
  //   { value: "Samsung Galaxy S24+", label: "Samsung Galaxy S24+" },
  //   { value: "Samsung Galaxy S24 Ultra", label: "Samsung Galaxy S24 Ultra" },
  //   { value: "Samsung Galaxy A15", label: "Samsung Galaxy A15" },
  //   { value: "Samsung Galaxy A25", label: "Samsung Galaxy A25" },
  //   { value: "Samsung Galaxy A35", label: "Samsung Galaxy A35" },
  //   { value: "Samsung Galaxy A55", label: "Samsung Galaxy A55" },
  //   { value: "Samsung Galaxy M15", label: "Samsung Galaxy M15" },
  //   { value: "Samsung Galaxy M25", label: "Samsung Galaxy M25" },
  //   { value: "Samsung Galaxy M35", label: "Samsung Galaxy M35" },
  //   { value: "Samsung Galaxy M55", label: "Samsung Galaxy M55" },
  //   { value: "Samsung Galaxy Z Flip 6", label: "Samsung Galaxy Z Flip 6" },
  //   { value: "Samsung Galaxy Z Fold 6", label: "Samsung Galaxy Z Fold 6" },
  //   { value: "Samsung Galaxy S25", label: "Samsung Galaxy S25" },
  //   { value: "Samsung Galaxy S25+", label: "Samsung Galaxy S25+" },
  //   { value: "Samsung Galaxy S25 Ultra", label: "Samsung Galaxy S25 Ultra" },
  // ];
  const t = useTranslations("Category");
  const t2 = useTranslations("CartWishlist");

  const alreadyWishlisted =
    wishlist.filter((wItem) => wItem.id === product.id).length > 0;

  useEffect(() => {
    setMainImg(product?.mainImg);
    setcolor(product?.option[0]?.color);
    setproductOption(product?.option[0]);
  }, [paramId]);

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

  const [selectedPack, setSelectedPack] = useState<number | null>(null);
  const [packSelections, setPackSelections] = useState<any>([]);

  const packOptions = [
    {
      id: 1,
      label: "اطلب 1",
      description: "",
      price: Number(productOption?.price),
      offer: null,
    },
    {
      id: 2,
      label: "اطلب 2 واحصل توصيل مجاني",
      description: "Free delivery",
      price: Number(productOption?.price) * 2,
      offer: "delivery",
    },
    {
      id: 3,
      label: "اطلب 3 واحصل على 1 مجاني",
      description: "1 free item",
      price: Number(productOption?.price) * 3,
      offer: "1 free",
    },
  ];

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
            <img src=${
              productOption?.images?.split(",")[0]
            } alt="IMAGE" width={50} height={50}/>
            <div/>
          </td>

                 <td style="padding:20px; color: #000; background:#00aaa8;"> ${currentQty}
          </td>

                  <td style="padding:20px; color: #000; background:#00aaa8;"> ${size}
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

    const products = Object.values(packSelections).map((el: any) => ({
      id: Number(_.uniqueId()),
      quantity: 1,
      image: el.product.img1,
      size: el.model,
    }));

    const makeOrder = async () => {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_ORDERS_MODULE}`, {
        customerName: name,
        customerPhone: phone,
        shippingAddress: shippingAddress,
        ville: moment().format("YYYY-MM-DD HH:mm"),
        gouvernorat: moment().format("YYYY-MM-DD HH:mm"),
        totalPrice:
          Object.values(packSelections).length === 1
            ? Number(currentItem?.price) + 8
            : Object.values(packSelections).length === 2
            ? Number(currentItem?.price) * 2
            : Object.values(packSelections).length >= 3
            ? Number(currentItem?.price) * 3
            : 0,
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
            ? Number(
                roundDecimal(Number(currentItem?.price) * Number(currentQty))
              ) + 8
            : Number(
                roundDecimal(
                  Number(currentItem?.price) * Number(currentQty) -
                    Number(currentQty - 1) * 8
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
                    <LazyLoadImage
                      className={`cursor-pointer ${
                        mainImg === el
                          ? "opacity-100 border border-gray300"
                          : "opacity-50"
                      }`}
                      effect="blur"
                      onClick={() => setMainImg(el)}
                      src={el as string}
                      alt={product.name}
                      placeholderSrc="/bg-img/skeleton-loading.gif"
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
                  <LazyLoadImage
                    effect="blur"
                    src={mainImg}
                    className="lazy-image"
                    alt={product?.name}
                    placeholderSrc="/bg-img/skeleton-loading.gif"
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

            {/* Rating display */}
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating)
                        ? "text-yellow400"
                        : "text-gray300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray600">
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>

            <span className="text-2xl text-red mb-2 animate-pulse">
              <Link href="/">
                <a className="animate-pulse">
                  {" "}
                  {t("See more products click here")}
                </a>
              </Link>{" "}
            </span>

            <span className="text-2xl text-gray400 mb-2">
              {productOption.price} {currency}
            </span>

            <span className="mb-2">
              {t("availability")}: {t("in_stock")}
            </span>

            {/* <div className="my-4">
              <strong
                className="block mb-2 text-right"
                style={{ color: "#F14A00" }}
              >
                إختر العرض المناسب لك
              </strong>

              <div className="flex flex-col gap-3">
                {packOptions.map((pack) => (
                  <div
                    key={pack.id}
                    className={`flex items-center justify-between rounded-lg p-3 cursor-pointer border-2 ${
                      true
                        ? "bg-yellow-400 border-yellow-500"
                        : "bg-black text-white border-gray400"
                    }`}
                    dir="rtl"
                    onClick={() => {
                      setSelectedPack(pack.id);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={productOption?.images?.split(",")[0]}
                        alt="product"
                        className="w-14 h-14 rounded-md object-cover"
                      />
                      <span className="font-bold text-lg">{pack.label}</span>
                    </div>
                    <span className="font-bold text-lg">
                      {pack.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div> */}

            <ProductOptions
              product={{
                id: product?.id,
                name: product?.name,
                price: product?.option[0]?.price,
                detail: product?.detail,
                img1: product?.option[0]?.images?.split(",")[0],
                img2:
                  product?.option[0]?.images?.split(",")?.length > 1
                    ? product?.option[0]?.images?.split(",")[1]
                    : product?.option[0]?.images?.split(",")[0],
                // categoryName: "Shirts",
                stock: product?.option[0]?.stock,
                option: product?.option[0]?.id,
                size: product?.option[0].size.split(",")[0],
              }}
              currency={currency}
              packageOptions={packOptions}
              pairSelections={packSelections}
              setPairSelections={setPackSelections}
              setSelectedPackage={setSelectedPack}
              selectedPackage={selectedPack}
              products={products}
            />

            {/* 
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
    
                {listMark?.map((el: any) => (
                  <div
                    key={el}
                    onClick={() => {
                      handleSize(el);
                    }}
                    className={`flex items-center justify-center border ${
                      size === el ? "border-red" : "border-gray300 text-gray400"
                    } cursor-pointer `}
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
                      disabled={
                        isEmpty(model) ||
                        isNil(model) ||
                        Number(productOption?.stock) <= 0
                      }
                      extraClass={`flex-grow text-center whitespace-nowrap hover:bg-gray200`}
                      onClick={() => {
                        addItem!(currentItem);
                        fbPixelAddToCart();
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {model && Number(productOption?.stock) > 0 && (
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
                    {Number(
                      roundDecimal(
                        Number(currentItem?.price) * Number(currentQty)
                      )
                    )}
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
                        ? Number(
                            roundDecimal(
                              Number(currentItem?.price) * Number(currentQty)
                            )
                          ) + 8
                        : Number(
                            roundDecimal(
                              Number(currentItem?.price) * Number(currentQty) -
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
            )} */}

            {Number(productOption?.stock) > 0 && (
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
                    {Object.values(packSelections).length === 1
                      ? Number(currentItem?.price) + 8
                      : Object.values(packSelections).length === 2
                      ? Number(currentItem?.price) * 2
                      : Object.values(packSelections).length >= 3 &&
                        Number(currentItem?.price) * 3}{" "}
                    {currency}
                  </span>
                </div>

                <div className="py-3 flex justify-between">
                  <span className="uppercase">{"Livraison"}</span>
                  <span>
                    {" "}
                    {Object.values(packSelections).length === 1 ? 8 : 0}
                  </span>
                </div>

                <hr />
                <div>
                  <div className="flex justify-between py-3">
                    <span>{t2("grand_total")}</span>
                    <span>
                      {" "}
                      {Object.values(packSelections).length === 1
                        ? Number(currentItem?.price) + 8
                        : Object.values(packSelections).length === 2
                        ? Number(currentItem?.price) * 2
                        : Object.values(packSelections).length >= 3
                        ? Number(currentItem?.price) * 3
                        : 0}{" "}
                      {currency}
                    </span>
                  </div>
                </div>

                {(isEmpty(name) ||
                  isEmpty(phone) ||
                  phone.length !== 8 ||
                  !Object.values(packSelections).every(
                    (el) => el?.model?.length > 1
                  ) ||
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
                      !Object.values(packSelections).every(
                        (el) => el?.model?.length > 1
                      ) ||
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
            )}
            {showConfirmationModal && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                <div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-md mx-auto shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col">
                  <div className="flex flex-col items-center overflow-y-auto">
                    <div className="bg-yellow-50 p-2 sm:p-3 rounded-full mb-3 sm:mb-4">
                      <img
                        src={"/bg-img/tanbih.png"}
                        alt="تنبيه"
                        width={200}
                        height={200}
                        className="animate-pulse w-16 h-16 sm:w-20 sm:h-20"
                      />
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-2 sm:mb-3">
                      تأكيد الطلب
                    </h3>

                    <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 w-full border border-yellow-100 overflow-y-auto max-h-[50vh]">
                      <div className="space-y-2 sm:space-y-3">
                        <p
                          className="text-gray-700 text-center text-xs sm:text-sm leading-relaxed"
                          dir="rtl"
                        >
                          <span className="font-bold block mb-1 sm:mb-2 text-yellow-600">
                            مهم برشة !!{" "}
                          </span>
                          قبل ما تعدي الكوموند، خذ دقيقة و ثبت روحك مليح. كل
                          كولي يرجع، راهو موش كان خسارة في المصروف، أما زادة تعب
                          في التحضير و الوقت اللي نخصصوه ليك.
                        </p>
                        <p
                          className="text-gray-700 text-center text-xs sm:text-sm leading-relaxed"
                          dir="rtl"
                        >
                          نحب نخدمك بأحسن جودة و نعملك حاجة تليق بيك، و الكوموند
                          متاعنا نخدموها على الطلب – خاصة ليك، بالشكل اللي تحب
                          عليه
                        </p>
                        <p
                          className="text-gray-700 text-center text-xs sm:text-sm leading-relaxed"
                          dir="rtl"
                        >
                          متأكد من الكوموند، نحبك تعرف إلي نجم تبدل أو ترجع، أما
                          تحت شروط واضحة وبأجل محدد. المسؤولية تبدأ منّا و تكمل
                          بيك. خلي ديما خدمتك و خدمتنا تمشي في بلاصتها. يعطيك
                          الصحة على ثقتك وتفهمك، ومرحبا بيك ديما بكل حب واحترام
                        </p>
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
                    <span className="mb-2 mt-2 text-justify break-words">
                      {product.detail.split("✔").map(
                        (el, index) =>
                          index > 0 && (
                            <>
                              <div> ✅ {el} </div> <br />
                            </>
                          )
                      )}
                    </span>
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

        {/* Reviews Section */}

        <div className="app-max-width app-x-padding my-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Customer Reviews
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            {/* Review Summary */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray100 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-6 text-gray800">
                Review Summary
              </h3>
              <div className="flex items-center mb-6">
                <div className="text-5xl font-bold text-blue600 mr-6">
                  {averageRating.toFixed(1)}
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 transition-all duration-200 ${
                          star <= Math.round(averageRating)
                            ? "text-yellow400 fill-yellow400"
                            : "text-gray300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray600 mt-2">
                    Based on {reviews.length} review
                    {reviews.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => r.rating === star).length;
                const percentage =
                  reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center">
                    <div className="flex items-center w-20">
                      <span className="text-sm font-medium text-gray700 mr-1">
                        {star}
                      </span>
                      <Star className="w-4 h-4 text-yellow400 fill-yellow400" />
                    </div>
                    <div className="flex-1 mx-3">
                      <div className="h-3 bg-gray200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow400 to-yellow500 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-8 text-sm text-gray600 text-right font-medium">
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Review Form */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray100 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-6 text-gray800">
                Write a Review
              </h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating *
                    </label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 transition-all duration-200 ${
                              star <= newReview.rating
                                ? "text-yellow400 fill-yellow400"
                                : "text-gray300 hover:text-yellow200"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newReview.name}
                      onChange={handleReviewChange}
                      required
                      className="w-full px-4 py-3 border border-gray300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={newReview.email}
                      onChange={handleReviewChange}
                      required
                      className="w-full px-4 py-3 border border-gray300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray700 mb-1">
                      Review *
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={newReview.message}
                      onChange={handleReviewChange}
                      required
                      className="w-full px-4 py-3 border border-gray300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray700 mb-1">
                      Image (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      id="image"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          console.log(
                            "eeeeeeeeeeeeeeeeeeeeee",
                            e.target.files[0]
                          );
                          setImageFile(e.target.files[0]);
                          var bodyFormData = new FormData();
                          bodyFormData.append("images", e.target.files[0]);
                          let listOfPromise = [];
                          listOfPromise.push(
                            axios({
                              method: "post",
                              url: "https://www.tnprime.shop:6443/api/upload",
                              data: bodyFormData,
                              headers: {
                                "Content-Type": "multipart/form-data",
                              },
                            })
                          );

                          await Promise.all(listOfPromise);
                        }
                      }}
                      className="block w-full text-sm text-gray500 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue50 file:text-blue700 hover:file:bg-blue100"
                    />
                    {imageFile && (
                      <div className="mt-3">
                        <img
                          src={`https://www.tnprime.shop:6443/images/${imageFile.name}`}
                          alt="Preview"
                          className="h-24 w-24 object-cover rounded-lg border-2 border-gray200 shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full bg-gradient-to-r from-blue to-blue  py-3 px-6 rounded-lg font-semibold hover:from-blue hover:to-blue focus:outline-none focus:ring-2 focus:ring-blue disabled:opacity-50"
                  >
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            </div>

            {/* Reviews List */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Customer Reviews
              </h3>
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {reviews.map((review, index) => (
                    <div key={review._id} className="border-b pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? "text-yellow400 fill-yellow400"
                                    : "text-gray300"
                                }`}
                              />
                            ))}
                          </div>
                          <h4 className="font-semibold text-gray900">
                            {review.name}
                          </h4>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{review.message}</p>
                      {review.image && (
                        <img
                          src={`https://www.tnprime.shop:6443/images/${review.image}`}
                          alt="Review"
                          className="h-24 w-24 object-cover rounded border"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== Horizontal Divider ===== */}
        <div className="border-b-2 border-gray200"></div>

        {/* ===== You May Also Like Section ===== */}
        <div className="recSection my-8 app-max-width app-x-padding">
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
      paramId,
      messages: (await import(`../../../messages/common/${locale}.json`))
        .default,
    },
  };
};

export default ProductIG;

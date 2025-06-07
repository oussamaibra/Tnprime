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
// import { StarIcon } from "@heroicons/react/20/solid";
// import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/wishlist/WishlistProvider";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Input from "../components/Input/Input";
import Button from "../components/Buttons/Button";
import DownArrow from "../public/icons/DownArrow";
import Card from "../components/Card/Card";
import { fbPixelPurchase } from "../context/Util/fb";
import { PencilIcon, Star, StarIcon, TrashIcon } from "lucide-react";

type Review = {
  _id?: string;
  rating: number;
  message: string;
  name: string;
  email: string;
  image?: string;
  createdAt?: string;
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
  reviews: Review[];
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

  // Review state
  const [reviews, setReviews] = useState<Review[]>(product.reviews || []);
  const [newReview, setNewReview] = useState({
    rating: 5,
    message: "",
    name: "",
    email: "",
    image: "",
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const alreadyWishlisted = wishlist.some((wItem) => wItem.id === product._id);

  useEffect(() => {
    const loc = JSON.parse(
      localStorage.getItem("location") || { currency: "TND" }
    );
    setCurrency(loc.currency);
    fetchReviews();
  }, []);

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

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

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_ACC_MODULE}/${paramId}/reviews`
      );
      setReviews(res.data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
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
      if (editingReviewId) {
        // Update existing review
        await axios.put(
          `${process.env.NEXT_PUBLIC_ACC_MODULE}/${paramId}/reviews/${editingReviewId}`,
          newReview
        );
        toast.success("Review updated successfully!");
      } else {
        // Add new review
        await axios.post(
          `${process.env.NEXT_PUBLIC_ACC_MODULE}/${paramId}/reviews`,
          { ...newReview, image: imageFile?.name }
        );
        toast.success("Review submitted successfully!");
      }

      // Refresh reviews
      await fetchReviews();
      setImageFile(null);
      // Reset form
      setNewReview({
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
          {/* <div className="imgSection w-full md:w-1/2 h-full flex">
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
                  <SwiperSlide key={index} >
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
          </div> */}

          <div className="mb-8 lg:mb-0">
            <div className="relative mb-4 rounded-lg overflow-hidden">
              {selectedVariant.images
                ?.split(",")
                ?.map((img: string, index: number) => (
                  <div
                    key={img + index}
                    className={`transition-opacity duration-300 ${
                      mainImg === img
                        ? "opacity-100"
                        : "opacity-0 absolute inset-0"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product?.nom} view ${index + 1}`}
                      width={800}
                      height={800}
                      className="w-full h-auto object-contain"
                      priority={index === 0}
                    />
                  </div>
                ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {selectedVariant.images
                ?.split(",")
                ?.map((img: string, index: number) => (
                  <button
                    key={img + index}
                    onClick={() => setMainImg(img)}
                    className={`rounded-md overflow-hidden border-2 ${
                      mainImg === img
                        ? "border-green-500"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product?.name} thumbnail ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-auto object-cover"
                    />
                  </button>
                ))}
            </div>
          </div>

          {/* Product Info */}
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
                {editingReviewId ? "Edit Your Review" : "Write a Review"}
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
                acc={true}
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
        messages: (await import(`../messages/common/${locale}.json`)).default,
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

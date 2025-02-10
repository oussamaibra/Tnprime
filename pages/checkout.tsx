import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import axios from "axios";
import Image from "next/image";
import { GetStaticProps } from "next";
import Select from "react-select";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Button from "../components/Buttons/Button";
import { roundDecimal } from "../components/Util/utilFunc";
import { useCart } from "../context/cart/CartProvider";
import Input from "../components/Input/Input";
import { itemType } from "../context/wishlist/wishlist-type";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import emailjs from "@emailjs/browser";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import autocomplete, { AutocompleteItem, EventTrigger } from "autocompleter";
import _, { isEmpty, isNil } from "lodash";
import moment from "moment";

// this type will prevent typescript warnings

type Item = {
  name: string;
  postcode: string;
  city: string;
  context: string;
};

type MyItem = Item & AutocompleteItem;

// let w = window.innerWidth;
type PaymentType = "CASH_ON_DELIVERY" | "BANK_TRANSFER";
type DeliveryType = "DOMICILE" | "POINT_RELE";

type Order = {
  orderNumber: number;
  customerId: number;
  shippingAddress: string;
  township?: null | string;
  city?: null | string;
  state?: null | string;
  zipCode?: null | string;
  orderDate: string;
  paymentType?: PaymentType | null;
  deliveryType: DeliveryType;
  totalPrice: number;
  deliveryDate: string;
};

const ShoppingCart = () => {
  const t = useTranslations("CartWishlist");
  const { cart, clearCart } = useCart();
  const auth = useAuth();
  const [deli, setDeli] = useState<DeliveryType>("DOMICILE");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentType>("CASH_ON_DELIVERY");

  // Form Fields
  const [name, setName] = useState(auth.user?.fullname || "");
  const [email, setEmail] = useState(auth.user?.email || "");
  const [phone, setPhone] = useState(auth.user?.phone || "");

  const [phone2, setPhone2] = useState("");

  const [city, setcity] = useState("");
  const [postcode, setpostcode] = useState("");
  const [context, setcontext] = useState("NA");
  const [adrname, setadrname] = useState({});
  const [password, setPassword] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [orderError, setOrderError] = useState("");
  const [sendEmail, setSendEmail] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);
  const [paymentSuccess, setpaymentSuccess] = useState(false);

  const products = cart.map((item) => ({
    id: Number(_.uniqueId()),
    quantity: item.qty,
    image: item?.img1,
    size: item?.size,
  }));

  console.log("eeeeeeeeeeeeeeeeeeeeeee", cart);

  const [location, setlocation] = useState(null);
  const [currency, setcurrency] = useState("TND");

  const checkLocation = async () => {
    const loc = JSON.parse(localStorage.getItem("location") ?? "");
    setlocation(loc);
    setcurrency(loc.currency);
  };
  useEffect(() => {
    checkLocation();
  }, []);

  //   if (!isOrdering) return;

  //   setErrorMsg("");

  //   // if not logged in, register the user
  //   const registerUser = async () => {
  //     const regResponse = await auth.register!(
  //       email,
  //       name,
  //       password,
  //       adrname,
  //       phone
  //     );
  //     if (!regResponse.success) {
  //       setIsOrdering(false);
  //       if (regResponse.message === "alreadyExists") {
  //         setErrorMsg("email_already_exists try to login with this Email !!");
  //       } else {
  //         setErrorMsg("error_occurs");
  //       }
  //       return false;
  //     }
  //   };
  //   if (!auth.user) registerUser();

  //   const makeOrder = async () => {
  //     const res = await axios.post(`${process.env.NEXT_PUBLIC_ORDERS_MODULE}`, {
  //       customerId: auth!.user!.id,
  //       shippingAddress: adrname,
  //       totalPrice: Number(roundDecimal(+subtotal + deliFee)),
  //       deliveryDate: new Date().setDate(new Date().getDate() + 7),
  //       paymentType: "OTHERS",
  //       deliveryType: deli,
  //       products,
  //       sendEmail,
  //     });
  //     if (res?.data?.success) {
  //       setCompletedOrder(res.data.data);
  //       clearCart!();
  //       setIsOrdering(false);
  //     } else {
  //       setOrderError("error_occurs");
  //     }
  //   };
  //   if (auth.user) makeOrder();
  // }, [isOrdering]);
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

    cart.forEach((el) => {
      HTMT = `${HTMT} 
          
           <tr>

        <td style="padding:20px; color: #000; background:#00aaa8;"> ${name}
        </td> 

         <td style="padding:20px; color: #000; background:#00aaa8;"> ${email}
        </td> 

          <td style="padding:20px; color: #000; background:#00aaa8;">${phone} - ${phone2}
        </td> 

          <td style="padding:20px; color: #000; background:#00aaa8;"> 
          <div>
          <img src=${el?.img1} alt="IMAGE" width={50} height={50}/>
          <div/>
        </td> 

               <td style="padding:20px; color: #000; background:#00aaa8;"> ${el.qty}
        </td> 

                <td style="padding:20px; color: #000; background:#00aaa8;"> ${el?.size}
        </td>
        
        
        </tr>
          `;
    });

    HTMT = `${HTMT}   
    </tbody>
   <table />`;

    const templateParams = {
      email: "iskande.mtir112@gmail.com",
      subject: "NEW ORDER TN PRIME ",
      message: HTMT,
    };

    const serviceID = "service_5rvhhwc";
    const templateID = "template_0c9155n";
    const publicKey = "Utk0-Oe1c_AqSjQmN";

    emailjs
      .send(serviceID, templateID, templateParams, publicKey)
      .then(() => {})
      .catch((res) => {
        console.error(res.message);
      });

    setErrorMsg("");

    // if not logged in, register the user
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

    const makeOrder = async () => {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_ORDERS_MODULE}`, {
        customerName: name,
        customerPhone: phone,
        shippingAddress: shippingAddress,
        ville: moment().format("YYYY-MM-DD HH:mm"),
        gouvernorat: moment().format("YYYY-MM-DD HH:mm"),
        totalPrice: Number(roundDecimal(+subtotal + deliFee)),
        deliveryDate: new Date().setDate(new Date().getDate() + 2),
        paymentType: "OTHERS",
        deliveryType: "DOMICILE",
        orderDate: moment().format("YYYY-MM-DD HH:mm"),
        products,
        sendEmail,
      });
      if (res?.data?.success) {
        toast.success(t("Order Passed")); 
        setCompletedOrder(res.data.data);
        clearCart!();
        setIsOrdering(false);// Displays a success message
        setName("");
        setPhone("");
        setShippingAddress("");
      } else {
        setName("");
        setPhone("");
        setShippingAddress("");
      }
    };

    makeOrder()
  };

  useEffect(() => {
    if (auth.user) {
      setName(auth.user.fullname);
      setEmail(auth.user.email);
      setPhone(auth.user.phone || "");
      setPhone2(auth.user.phone || "");
    } else {
      setName("");
      setEmail("");
      setPhone("");
    }
  }, [auth.user]);

  let subtotal: number | string = 0;

  subtotal = roundDecimal(
    cart.reduce(
      (accumulator: number, currentItem: itemType) =>
        accumulator + currentItem.price * currentItem!.qty!,
      0
    )
  );

  let deliFee = 0;
  // if (deli === "POINT_RELE") {
  //   deliFee = 2.0;
  // } else if (deli === "DOMICILE") {
  //   deliFee = 8.0;
  // }

  const stripe: any = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (elements == null) {
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError }: any = await elements.submit();
    if (submitError) {
      // Show error to your customer
      setErrorMessage(submitError.message);
      return;
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_CREATEPAYMENT_MODULE}`,
      {
        totalPrice: Number(roundDecimal(+subtotal + 0)),
        email: email,
        name: name,
      }
    );

    const { error }: any = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      clientSecret: response.data.clientSecret,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
      redirect: "if_required",
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
      setpaymentSuccess(false);
    } else {
      setpaymentSuccess(true);
      setErrorMessage(null);
      toast.success("Payment Done you can complite the order");

      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  let disableOrder = true;

  if (!auth.user) {
    disableOrder = name !== "" && phone !== "" && shippingAddress !== "";
  } else {
    disableOrder = name !== "" && phone !== "" && shippingAddress !== "";
  }

  const lista = [
    {
      label: "Ariana",
      value: "ariana",
      villes: [
        "Ariana Ville",
        "Ettadhamen",
        "Raoued",
        "Kalaat Landlous",
        "Sidi Thabet",
        "Mnihla",
        "Autre",
      ],
    },
    {
      label: "Béja",
      value: "beja",
      villes: [
        "Béja",
        "Medjez el-Bab",
        "Testour",
        "Téboursouk",
        "Nefza",
        "Amdoun",
        "Goubellat",
        "Thibar",
        "Autre",
      ],
    },
    {
      label: "Ben Arous",
      value: "ben_arous",
      villes: [
        "Ben Arous",
        "Hammam Lif",
        "Hammam Chott",
        "Ezzahra",
        "Mornag",
        "Fouchana",
        "Radès",
        "Mohamedia",
        "Bou Mhel el-Bassatine",
        "Autre",
      ],
    },
    {
      label: "Bizerte",
      value: "bizerte",
      villes: [
        "Bizerte",
        "Menzel Bourguiba",
        "Ras Jebel",
        "Mateur",
        "Ghar El Melh",
        "Tinja",
        "Sejnane",
        "Joumine",
        "El Alia",
        "Autre",
      ],
    },
    {
      label: "Gabès",
      value: "gabes",
      villes: [
        "Gabès",
        "Mareth",
        "Métouia",
        "Matmata",
        "El Hamma",
        "Ghannouch",
        "Nouvelle Matmata",
        "Autre",
      ],
    },
    {
      label: "Gafsa",
      value: "gafsa",
      villes: [
        "Gafsa",
        "Métlaoui",
        "Redeyef",
        "Mdhilla",
        "El Guettar",
        "Oum El Araies",
        "Sened",
        "Belkhir",
        "Autre",
      ],
    },
    {
      label: "Jendouba",
      value: "jendouba",
      villes: [
        "Jendouba",
        "Tabarka",
        "Aïn Draham",
        "Bou Salem",
        "Fernana",
        "Ghardimaou",
        "Oued Meliz",
        "Autre",
      ],
    },
    {
      label: "Kairouan",
      value: "kairouan",
      villes: [
        "Kairouan",
        "Oueslatia",
        "Sbikha",
        "Haffouz",
        "Chebika",
        "Nasrallah",
        "Bou Hajla",
        "Echrarda",
        "Autre",
      ],
    },
    {
      label: "Kasserine",
      value: "kasserine",
      villes: [
        "Kasserine",
        "Sbeitla",
        "Thala",
        "Foussana",
        "Feriana",
        "Sbiba",
        "Hassi El Ferid",
        "Jedelienne",
        "El Ayoun",
        "Autre",
      ],
    },
    {
      label: "Kébili",
      value: "kebili",
      villes: ["Kébili", "Douz", "Souk Lahad", "Zaafrane", "El Golâa", "Autre"],
    },
    {
      label: "La Manouba",
      value: "la_manouba",
      villes: [
        "La Manouba",
        "Douar Hicher",
        "Tebourba",
        "Borj El Amri",
        "El Batan",
        "Oued Ellil",
        "Mornaguia",
        "Autre",
      ],
    },
    {
      label: "Le Kef",
      value: "le_kef",
      villes: [
        "Le Kef",
        "Dahmani",
        "Tajerouine",
        "Kalaat es Senam",
        "Kalaat Khasba",
        "Sers",
        "Nebeur",
        "Touiref",
        "Autre",
      ],
    },
    {
      label: "Mahdia",
      value: "mahdia",
      villes: [
        "Mahdia",
        "El Jem",
        "Chebba",
        "Ksour Essef",
        "Bou Merdes",
        "Hbira",
        "Souassi",
        "Chorbane",
        "Autre",
      ],
    },
    {
      label: "Médenine",
      value: "medenine",
      villes: [
        "Médenine",
        "Zarzis",
        "Houmt Souk (Djerba)",
        "Midoun (Djerba)",
        "Ajim (Djerba)",
        "Ben Guerdane",
        "Beni Khedache",
        "Autre",
      ],
    },
    {
      label: "Monastir",
      value: "monastir",
      villes: [
        "Monastir",
        "Sahline",
        "Ksibet el-Médiouni",
        "Beni Hassen",
        "Jemmal",
        "Zéramdine",
        "Moknine",
        "Ksar Hellal",
        "Téboulba",
        "Bekalta",
        "Autre",
      ],
    },
    {
      label: "Nabeul",
      value: "nabeul",
      villes: [
        "Nabeul",
        "Hammamet",
        "Kelibia",
        "Korba",
        "Menzel Temime",
        "Dar Chaâbane",
        "Soliman",
        "Grombalia",
        "El Haouaria",
        "Beni Khiar",
        "Menzel Bouzelfa",
        "Takelsa",
        "Autre",
      ],
    },
    {
      label: "Sfax",
      value: "sfax",
      villes: [
        "Sfax",
        "Sakiet Ezzit",
        "Sakiet Eddaïer",
        "Mahrès",
        "El Amra",
        "Agareb",
        "Bir Ali Ben Khalifa",
        "Jebiniana",
        "Kerkennah",
        "Skhira",
        "Autre",
      ],
    },
    {
      label: "Sidi Bouzid",
      value: "sidi_bouzid",
      villes: [
        "Sidi Bouzid",
        "Jilma",
        "Regueb",
        "Meknassy",
        "Bir El Hafey",
        "Sidi Ali Ben Aoun",
        "Cebbala Ouled Asker",
        "Menzel Bouzaiane",
        "Autre",
      ],
    },
    {
      label: "Siliana",
      value: "siliana",
      villes: [
        "Siliana",
        "Gaafour",
        "Bou Arada",
        "Makthar",
        "El Krib",
        "Kesra",
        "Rouhia",
        "Bargou",
        "Autre",
      ],
    },
    {
      label: "Sousse",
      value: "sousse",
      villes: [
        "Sousse",
        "Hammam Sousse",
        "Akouda",
        "Kalaa Kebira",
        "Kalaa Seghira",
        "Msaken",
        "Enfidha",
        "Hergla",
        "Sidi Bou Ali",
        "Bouficha",
        "Autre",
      ],
    },
    {
      label: "Tataouine",
      value: "tataouine",
      villes: [
        "Tataouine",
        "Ghomrassen",
        "Smâr",
        "Bir Lahmar",
        "Dehiba",
        "Remada",
        "Autre",
      ],
    },
    {
      label: "Tozeur",
      value: "tozeur",
      villes: ["Tozeur", "Nefta", "Degache", "Tamerza", "Hazoua", "Autre"],
    },
    {
      label: "Tunis",
      value: "tunis",
      villes: [
        "Tunis",
        "Le Bardo",
        "La Marsa",
        "Sidi Bou Saïd",
        "Carthage",
        "El Menzah",
        "El Kram",
        "El Omrane",
        "El Omrane Supérieur",
        "Ezzouhour",
        "La Goulette",
        "Autre",
      ],
    },
    {
      label: "Zaghouan",
      value: "zaghouan",
      villes: [
        "Zaghouan",
        "El Fahs",
        "Nadhour",
        "Bir Mcherga",
        "Saouaf",
        "Zriba",
        "Autre",
      ],
    },
  ];

  return (
    <div>
      {/* ===== Head Section ===== */}
      <Header title={`Shopping Cart - TN PrimeFashion`} />

      <main id="main-content">
        <Toaster />
        {/* ===== Heading & Continue Shopping */}
        <div className="app-max-width px-4 sm:px-8 md:px-20 w-full border-t-2 border-gray100">
          <h1 className="text-2xl sm:text-4xl text-center sm:text-left mt-6 mb-2 animatee__animated animate__bounce">
            {t("checkout")}
          </h1>
        </div>

        {/* ===== Form Section ===== */}
        {!completedOrder ? (
          <div className="app-max-width px-4 sm:px-8 md:px-20 mb-14 flex flex-col lg:flex-row">
            <div className="h-full w-full lg:w-7/12 mr-8">
              <div className="my-4">
                <label htmlFor="name" className="text-lg">
                  {t("NometPrénom")}
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
                  {t("phone")}
                </label>
                <Input
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
                  {t("shipping_address")} complete
                </label>

                <textarea
                  id="shipping_address"
                  aria-label="shipping address"
                  className="w-full mt-1 mb-2 border-2 border-gray400 p-4 outline-none"
                  rows={4}
                  value={shippingAddress}
                  onChange={(e) =>
                    setShippingAddress((e.target as HTMLTextAreaElement).value)
                  }
                />
              </div>
              {!auth.user && (
                <div className="text-sm text-gray400 mt-8 leading-6">
                  {t("form_note")}
                </div>
              )}
            </div>
            <div className="h-full w-full lg:w-5/12 mt-10 lg:mt-4">
              {/* Cart Totals */}
              <div className="border border-gray500 p-6 divide-y-2 divide-gray200">
                <div className="flex justify-between">
                  <span className="text-base uppercase mb-3">
                    {t("product")}
                  </span>
                  <span className="text-base uppercase mb-3">
                    {t("subtotal")}
                  </span>
                </div>

                <div className="pt-2">
                  {cart.map((item: any) => (
                    <div className="flex justify-between mb-2" key={item.id}>
                      <span className="text-base font-medium">
                        {item.name}{" "}
                        <span className="text-gray400">x {item.qty}</span>{" "}
                        <span className="text-gray400">| {item.size}</span>
                      </span>
                      <span className="text-base">
                        {roundDecimal(item.price * item!.qty!)} {currency}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="py-3 flex justify-between">
                  <span className="uppercase">{t("subtotal")}</span>
                  <span>
                    {" "}
                    {subtotal} {currency}
                  </span>
                </div>

                <div className="py-3">
                  <span className="uppercase">{t("delivery")}</span>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between">
                      <div>
                        <input
                          type="radio"
                          name="deli"
                          value="DOMICILE"
                          id="DOMICILE"
                          checked={true}
                          onChange={() => setDeli("DOMICILE")}
                        />{" "}
                        <label htmlFor="DOMICILE" className="cursor-pointer">
                          {"Livraison à domicile"}
                        </label>
                      </div>
                      <span> 0 {currency} </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between py-3">
                    <span>{t("grand_total")}</span>
                    <span>
                      {" "}
                      {roundDecimal(+subtotal + 0)} {currency}{" "}
                    </span>
                  </div>

                  <div className="grid gap-4 mt-2 mb-4">
                    {location && !location?.country?.includes("Tunisia") && (
                      <form onSubmit={handleSubmit}>
                        <PaymentElement />

                        <Button
                          value={"Pay"}
                          size="xl"
                          extraClass={`w-full mt-5`}
                          type="submit"
                          disabled={
                            (!stripe || !elements) &&
                            name !== "" &&
                            phone !== ""
                          }
                        />

                        {errorMessage && <div>{errorMessage}</div>}
                      </form>
                    )}
                  </div>

                  <div className="my-8">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input
                        type="checkbox"
                        name="send-email-toggle"
                        id="send-email-toggle"
                        checked={sendEmail}
                        onChange={() => setSendEmail(!sendEmail)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray300 appearance-none cursor-pointer"
                      />
                      <label
                        htmlFor="send-email-toggle"
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray300 cursor-pointer"
                      ></label>
                    </div>
                    <label
                      htmlFor="send-email-toggle"
                      className="text-xs text-gray-700"
                    >
                      {t("send_order_email")}
                    </label>
                  </div>
                </div>

                {location && location?.country?.includes("Tunisia") ? (
                  <Button
                    value={t("place_order")}
                    size="xl"
                    extraClass={`w-full`}
                    onClick={() => Ordering()}
                    disabled={!disableOrder}
                  />
                ) : (
                  <Button
                    value={t("place_order")}
                    size="xl"
                    extraClass={`w-full`}
                    onClick={() => Ordering()}
                    disabled={!disableOrder && !paymentSuccess}
                  />
                )}
              </div>

              {errorMsg !== "" && (
                <span className="text-red text-sm font-semibold">
                  - {t(errorMsg)}
                </span>
              )}

              {orderError !== "" && (
                <span className="text-red text-sm font-semibold">
                  - {orderError}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="app-max-width px-4 sm:px-8 md:px-20 mb-14 mt-6">
            <div className="text-gray400 text-base">{t("thank_you_note")}</div>

            <div className="flex flex-col md:flex-row">
              <div className="h-full w-full md:w-1/2 mt-2 lg:mt-4">
                <div className="border border-gray500 p-6 divide-y-2 divide-gray200">
                  <div className="flex justify-between">
                    <span className="text-base uppercase mb-3">
                      {t("order_id")}
                    </span>
                    <span className="text-base uppercase mb-3">
                      {completedOrder.orderNumber}
                    </span>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between mb-2">
                      <span className="text-base">{t("email_address")}</span>
                      <span className="text-base">{auth.user?.email}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-base">{t("order_date")}</span>
                      <span className="text-base">
                        {new Date(
                          completedOrder.orderDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-base">{t("delivery_date")}</span>
                      <span className="text-base">
                        {new Date(
                          completedOrder.deliveryDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="py-3">
                    <div className="flex justify-between mb-2">
                      <span className="">{t("payment_method")}</span>
                      <span>{completedOrder.paymentType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="">{t("delivery_method")}</span>
                      <span>{completedOrder.deliveryType}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between mb-2">
                    <span className="text-base uppercase">{t("total")}</span>
                    <span className="text-base">
                      {completedOrder.totalPrice} {currency}
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-full w-full md:w-1/2 md:ml-8 mt-4 md:mt-2 lg:mt-4">
                <div>
                  {t("your_order_received")}
                  {completedOrder.paymentType === "BANK_TRANSFER" &&
                    t("bank_transfer_note")}
                  {completedOrder.paymentType === "CASH_ON_DELIVERY" &&
                    completedOrder.deliveryType !== "DOMICILE" &&
                    t("cash_delivery_note")}
                  {completedOrder.deliveryType === "DOMICILE" &&
                    t("store_pickup_note")}
                  {t("thank_you_for_purchasing")}
                </div>

                {completedOrder.paymentType === "BANK_TRANSFER" ? (
                  <div className="mt-6">
                    <h2 className="text-xl font-bold">
                      {t("our_banking_details")}
                    </h2>
                    <span className="uppercase block my-1">Sat Naing :</span>

                    <div className="flex justify-between w-full xl:w-1/2">
                      <span className="text-sm font-bold">AYA Bank</span>
                      <span className="text-base">20012345678</span>
                    </div>
                    <div className="flex justify-between w-full xl:w-1/2">
                      <span className="text-sm font-bold">CB Bank</span>
                      <span className="text-base">0010123456780959</span>
                    </div>
                    <div className="flex justify-between w-full xl:w-1/2">
                      <span className="text-sm font-bold">KPay</span>
                      <span className="text-base">095096051</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-56">
                    <div className="w-3/4">
                      <Image
                        className="justify-center"
                        src="/logo.svg"
                        alt="TN PrimeFashion"
                        width={220}
                        height={50}
                        layout="responsive"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ===== Footer Section ===== */}
      <Footer />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../messages/common/${locale}.json`)).default,
    },
  };
};

export default ShoppingCart;

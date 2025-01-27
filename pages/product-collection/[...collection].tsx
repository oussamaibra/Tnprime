import Link from "next/link";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Menu } from "@headlessui/react";
import { useTranslations } from "next-intl";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Card from "../../components/Card/Card";
import Pagination from "../../components/Util/Pagination";
import { apiProductsType, itemType } from "../../context/cart/cart-types";
import DownArrow from "../../public/icons/DownArrow";
import "rc-collapse/assets/index.css";
import Collapse from "rc-collapse";
import SettingsIcon from "../../public/icons/SettingsIcon";
import { Fragment, useEffect, useState } from "react";
import _, { isEmpty } from "lodash";
import CrossIcon from "../../public/icons/CrossIcon";
import Circle from "@uiw/react-color-circle";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import ResetFilters from "../../public/icons/ResetFilters";
import { Dialog, Transition } from "@headlessui/react";
import Button from "../../components/Buttons/Button";
import LinkButton from "../../components/Buttons/LinkButton";

type OrderType = "latest" | "price" | "price-desc";

type Props = {
  items: itemType[];
  page: number;
  numberOfProducts: number;
  orderby: OrderType;
  colors: string[];
  sizes: string[];
};
const Panel = Collapse.Panel;

const ProductCollection: React.FC<Props> = ({
  items,
  page,
  numberOfProducts,
  orderby,
  colors,
  sizes,
}) => {
  const t = useTranslations("Collection");
  const [open, setopen] = useState(false);
  const [hex, setHex] = useState("");
  const [size, setSize] = useState("");
  const [min, setmin] = useState(0);
  const [max, setmax] = useState(1000);
  const [filteredData, setfilteredData] = useState(items);

  const router = useRouter();
  const { collection } = router.query;

  const lastPage = Math.ceil(numberOfProducts / 10);

  const capitalizedCategory =
    collection!.toString().charAt(0).toUpperCase() +
    collection!.toString().slice(1);

  const firstIndex = page === 1 ? page : page * 10 - 9;
  const lastIndex = page * 10;

  useEffect(() => {
    setfilteredData(items);
  }, [items]);

  const handleSize = (value: string) => {
    setSize(value);
  };
  const log = (value: any) => {
    setmin(value[0]);
    setmax(value[1]);
  };
  const handleFiltre = () => {
    const res: any = [];
    items.forEach((item: any) => {
      let isValid = false;

      item.details.forEach((el: any) => {
        let isValidColor = false;
        let isValidSize = false;
        let isValidPrice = false;

        if (!isEmpty(hex)) {
          if (el?.color === hex) {
            isValidColor = true;
          }
        } else {
          isValidColor = true;
        }
        if (!isEmpty(size)) {
          if (el?.size.includes(size)) {
            isValidSize = true;
          }
        } else {
          isValidSize = true;
        }
        if (
          Number(el?.price) >= Number(min) &&
          Number(el?.price) <= Number(max)
        ) {
          isValidPrice = true;
        }

        if (isValidColor && isValidSize && isValidPrice) {
          isValid = true;
        }
      });

      if (isValid) {
        res.push(item);
      }
    });

    setfilteredData(res);
  };

  function closeModal() {
    setopen(false);
  }

  function openModal() {
    setopen(true);
  }
  return (
    <div>
      {/* ===== Head Section ===== */}
      <Header title={`${capitalizedCategory} - TN PrimeFashion`} />

      <main id="main-content">
        {/* ===== Breadcrumb Section ===== */}
        <div className="bg-lightgreen h-16 w-full flex items-center">
          <div className="app-x-padding app-max-width w-full">
            <div className="breadcrumb">
              <Link href="/">
                <a className="text-gray400">{t("home")}</a>
              </Link>{" "}
              / <span className="capitalize">{collection[1]}</span>
            </div>
          </div>
        </div>

        {/* ===== Heading & Filter Section ===== */}
        <div className="app-x-padding app-max-width w-full mt-8">
          <h3 className="text-4xl mb-2 capitalize">{collection[1]}</h3>
          <div className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-0 justify-between mt-4 sm:mt-6">
            <span>
              {t("showing_from_to", {
                from: firstIndex,
                to: numberOfProducts < lastIndex ? numberOfProducts : lastIndex,
                all: numberOfProducts,
              })}
            </span>

            {collection !== "new-arrivals" && (
              <SortMenu orderby={orderby} openModal={openModal} />
            )}
          </div>
        </div>

        {/* ===== Main Content Section ===== */}
        <div className="app-x-padding app-max-width mt-10 mb-14">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 sm:gap-y-6 mb-10">
            {filteredData.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
          {/* {collection !== "new-arrivals" && <Pagination currentPage={page} lastPage={lastPage} orderby={orderby} />} */}
        </div>
      </main>
      <Transition show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-y-0 left-0 z-10 overflow-x-auto"
          style={{ zIndex: 99999 }}
          static
          open={open}
          onClose={closeModal}
        >
          <div className="min-h-screen text-right">
            <Transition.Child
              as={Fragment}
              //   enter="ease-out duration-300"
              //   enterFrom="opacity-0"
              //   enterTo="opacity-100"
              //   leave="ease-in duration-200"
              //   leaveFrom="opacity-100"
              //   leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray500 opacity-50" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            {/* <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span> */}
            <Transition.Child
              as={Fragment}
              enter="ease-linear duration-600"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div
                style={{ height: "100vh" }}
                className="relative inline-block dur h-screen w-full max-w-md overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl"
              >
                <div className="bg-white flex justify-between items-center p-6">
                  <h3 className="text-xl">Filtrer</h3>
                  <button
                    type="button"
                    className="outline-none focus:outline-none text-3xl sm:text-2xl"
                    onClick={closeModal}
                  >
                    &#10005;
                  </button>
                </div>

                <div className="h-full">
                  <div className="itemContainer px-4 h-2/3 w-full flex-grow flex-shrink overflow-y-auto">
                    <div className="grid grid-rows gap-4">
                      <div>
                        <div className="mb-2">Filtrer par couleur</div>
                        <Circle
                          colors={_.uniq(colors)}
                          color={hex}
                          pointProps={{
                            style: {
                              marginRight: 15,
                              borderRadius: "50%",
                              height: "20px",
                              width: "20px",
                              // border:"1px solid black",
                              // boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
                              // boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"
                              boxShadow:
                                " rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px",
                            },
                          }}
                          onChange={(color) => {
                            setHex(color.hex);
                          }}
                        />{" "}
                      </div>
                      <div>
                        <div className="mb-2">Filtrer par Taille</div>

                        <div className="sizeContainer flex space-x-4 text-sm mb-4">
                          {_.uniq(sizes).map((el, i) => (
                            <div
                              key={i}
                              onClick={() => handleSize(el)}
                              className={`w-8 h-8 flex items-center justify-center border ${
                                size === el
                                  ? "border-gray500 bg-gray300"
                                  : "border-gray300 text-gray400"
                              } cursor-pointer hover:bg-gray500 hover:text-gray100`}
                            >
                              {el}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="mb-2">Filtrer par Prix</div>
                        <Slider
                          range
                          allowCross={false}
                          min={0}
                          max={1000}
                          defaultValue={[50, 150]}
                          onChange={log}
                          styles={{
                            track: { backgroundColor: "#282828" },
                            handle: { borderColor: "#282828" },
                          }}
                          className="mb-2"
                        />
                        Min Prix: {min} € &nbsp;&nbsp;&nbsp; Max Prix: {max} €
                      </div>
                    </div>
                  </div>
                  <div className="btnContainer mt-4 px-4 h-1/3 mb-20 w-full flex flex-col ">
                    <LinkButton
                      extraClass="my-4"
                      noBorder={false}
                      inverted={false}
                      onClick={() => {
                        setHex("");
                        setSize("");
                        setmin(0);
                        setmax(1000);
                        setfilteredData(items);
                      }}
                    >
                      réinitialiser le filtre
                    </LinkButton>
                    <Button
                      value={"filtrer"}
                      onClick={() => handleFiltre()}
                      // disabled={cart.length < 1 ? true : false}
                      extraClass="text-center"
                      size="lg"
                    />
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* ===== Footer Section ===== */}
      <Footer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
  query: { page = 1, orderby = "latest" },
}) => {
  const paramCategory: any = params!.collection;

  // const start = +page === 1 ? 0 : (+page - 1) * 10;

  let numberOfProducts = 0;

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_PRODUCTS_MODULE}/col/${paramCategory[0]}`
  );
  numberOfProducts = res.data.data.length;

  let order_by: string;

  if (orderby === "price") {
    order_by = "price";
  } else if (orderby === "price-desc") {
    order_by = "price.desc";
  } else {
    order_by = "createdAt.desc";
  }

  let items: any[] = res.data.data.map((el: any) => ({
    id: el?.id,
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
    option: el?.option[0].id,
    size: el?.option[0].size.split(",")[0],
    createdAt: el?.createdAt,
    details: el?.option?.map((col: any) => {
      return {
        color: col?.color,
        img1: col?.images.split(",")[0],
        img2:
          col?.images.split(",").length > 1
            ? col?.images.split(",")[1]
            : col?.images.split(",")[0],
        price: col?.price,
        size: col?.size.split(",").map((size: any) => size),
      };
    }),
  }));
  const colors: any = [];
  res.data.data.forEach((element: any) => {
    element?.option?.forEach((el: any) => {
      colors.push(el?.color);
    });
  });
  const sizes: any = [];

  res.data.data.forEach((element: any) => {
    element?.option?.forEach((el: any) => {
      el?.size.split(",").forEach((size: any) => sizes.push(size));
    });
  });

  return {
    props: {
      messages: (await import(`../../messages/common/${locale}.json`)).default,
      items,
      numberOfProducts,
      page: +page,
      orderby,
      colors,
      sizes,
    },
  };
};

const SortMenu: React.FC<{ orderby: OrderType; openModal: () => void }> = ({
  orderby,
  openModal,
}) => {
  const t = useTranslations("Navigation");
  const router = useRouter();
  const { collection }: any = router.query;

  let currentOrder: string;

  if (orderby === "price") {
    currentOrder = "sort_by_price";
  } else if (orderby === "price-desc") {
    currentOrder = "sort_by_price_desc";
  } else {
    currentOrder = "sort_by_latest";
  }
  return (
    <div className="flex justify-end">
      <div
        className="ml-3 cursor-pointer flex items-center justify-center capitalize mr-2 pr-2 border-r-2 border-gray500 border-opacity-80 "
        onClick={openModal}
      >
        <SettingsIcon extraClass="ml-2 mr-1" />
        Filtrer
      </div>
      <Menu as="div" className="relative">
        <Menu.Button as="a" href="#" className="flex items-center capitalize">
          {t(currentOrder)} <DownArrow />
        </Menu.Button>
        <Menu.Items className="flex flex-col z-10 items-start text-xs sm:text-sm w-auto sm:right-0 absolute p-1 border border-gray200 bg-white mt-2 outline-none">
          <Menu.Item>
            {({ active }) => (
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/product-collection/${collection[0]}/${collection[1]}?orderby=latest`
                  )
                }
                className={`${
                  active ? "bg-gray100 text-gray500" : "bg-white"
                } py-2 px-4 text-left w-full focus:outline-none whitespace-nowrap ${
                  currentOrder === "sort_by_latest" &&
                  "bg-gray500 text-gray100 hover:text-white"
                }`}
              >
                {t("sort_by_latest")}
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/product-collection/${collection[0]}/${collection[1]}?orderby=price`
                  )
                }
                className={`${
                  active ? "bg-gray100 text-gray500 " : "bg-white"
                } py-2 px-4 text-left w-full focus:outline-none whitespace-nowrap ${
                  currentOrder === "sort_by_price" &&
                  "bg-gray500 text-gray100 hover:text-white"
                }`}
              >
                {t("sort_by_price")}
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/product-collection/${collection[0]}/${collection[1]}?orderby=price-desc`
                  )
                }
                className={`${
                  active ? "bg-gray100 text-gray500 " : "bg-white"
                } py-2 px-4 text-left w-full focus:outline-none whitespace-nowrap ${
                  currentOrder === "sort_by_price_desc" &&
                  "bg-gray500 text-gray100 hover:text-white"
                }`}
              >
                {t("sort_by_price_desc")}
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default ProductCollection;

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

import TopNav from "./TopNav";
import WhistlistIcon from "../../public/icons/WhistlistIcon";
import UserIcon from "../../public/icons/UserIcon";
import AuthForm from "../Auth/AuthForm";
import SearchForm from "../SearchForm/SearchForm";
import CartItem from "../CartItem/CartItem";
import Menu from "../Menu/Menu";
import AppHeader from "./AppHeader";
import { useWishlist } from "../../context/wishlist/WishlistProvider";

import styles from "./Header.module.css";
import Dropdown from "rc-dropdown";
import { Item as MenuItem, Divider } from "rc-menu";
import MenuRC from "rc-menu";
import "rc-dropdown/assets/index.css";
import axios from "axios";
import { Menu as Mheadlessui } from "@headlessui/react";
import { useRouter } from "next/router";

import InstagramLogo from "../../public/icons/InstagramLogo";
import FacebookLogo from "../../public/icons/FacebookLogo";
import DownArrow from "../../public/icons/DownArrow";
type Props = {
  title?: string;
};
type LinkProps = {
  href: string;
  locale: "fr" | "ar" | "it" | "an";
  active: boolean;
};
const MyLink: React.FC<LinkProps> = ({
  href,
  locale,
  children,
  active,
  ...rest
}) => {
  return (
    <Link href={href} locale={locale}>
      <a
        className={`py-2 px-4 text-center ${
          active ? "bg-gray200 text-gray500" : "bg-white text-gray500"
        }`}
        {...rest}
      >
        {children}
      </a>
    </Link>
  );
};

const Header: React.FC<Props> = ({ title }) => {
  const t = useTranslations("Navigation");

  const { wishlist } = useWishlist();
  const [animate, setAnimate] = useState("");
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [collection, setcollection] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [categorie, setcategorie] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [didMount, setDidMount] = useState<boolean>(false); // to disable Can't perform a React state Warning
  const router = useRouter();
  // Calculate Number of Wishlist
  let noOfWishlist = wishlist.length;

  // Animate Wishlist Number
  const handleAnimate = useCallback(() => {
    if (noOfWishlist === 0) return;
    setAnimate("animate__animated animate__headShake");
  }, [noOfWishlist, setAnimate]);

  // Set animate when no of wishlist changes
  useEffect(() => {
    handleAnimate();
    setTimeout(() => {
      setAnimate("");
    }, 1000);
  }, [handleAnimate]);

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_COLLECTIONS_MODULE}`
      );

      setcollection(
        res.data.data.map((el: any) => ({ name: el.name, id: el?.id }))
      );
    })();
    (async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_CATEGORIE_MODULE}`
      );

      setcategorie(
        res.data.data.map((el: any) => ({ name: el.name, id: el?.id }))
      );
    })();
  }, []);

  const handleScroll = useCallback(() => {
    const offset = window.scrollY;
    if (offset > 30) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }, [setScrolled]);

  useEffect(() => {
    setDidMount(true);
    window.addEventListener("scroll", handleScroll);
    return () => setDidMount(false);
  }, [handleScroll]);

  if (!didMount) {
    return null;
  }

  function onSelect({ key }: any) {
    console.log(`${key} selected`);
  }

  function onVisibleChange(visible: any) {
    console.log(visible);
  }

  // const menuCol = (
  //   <MenuRC onSelect={onSelect} className=" cursor-pointer	">
  //     <div className="bg-gray100 py-2" style={{ backgroundColor: "#f8f9fa" }}>
  //       {collection.map((el, i) => (
  //         <>
  //           <MenuItem
  //             onClick={() => router.push(`/product-collection/${el.id}/${el?.name}`)}
  //             key={i}
  //             className={styles.navBarSubItem}
  //             style={{ marginLeft: "15px", marginRight: "25px" }}
  //           >
  //             {el.name}
  //           </MenuItem>
  //           {i !== collection.length - 1 && <hr className="mx-5 my-2	" style={{ opacity: "5%" }} />}
  //         </>
  //       ))}
  //     </div>{" "}
  //   </MenuRC>
  // );

  const menuCat = (
    <MenuRC onSelect={onSelect} className="cursor-pointer ">
      <div className="bg-gray100 py-2" style={{ backgroundColor: "#f8f9fa" }}>
        {categorie.map((el, i) => (
          <>
            <MenuItem
              onClick={() =>
                router.push(`/product-category/${el.id}/${el?.name}`)
              }
              key={i}
              className={styles.navBarSubItem}
              style={{ marginLeft: "15px", marginRight: "25px" }}
            >
              {el.name}
            </MenuItem>
            {i !== categorie.length - 1 && (
              <hr className="mx-5 my-2	" style={{ opacity: "5%" }} />
            )}
          </>
        ))}
      </div>
    </MenuRC>
  );
  const { asPath, locale } = router;

  return (
    <>
      {/* ===== <head> section ===== */}
      <AppHeader title={title} />

      {/* ===== Skip to main content button ===== */}
      <a
        href="#main-content"
        className="whitespace-nowrap absolute z-40 left-4 opacity-90 rounded-md bg-white px-4 py-3 transform -translate-y-40 focus:translate-y-0 transition-all duration-300"
      >
        {t("skip_to_main_content")}
      </a>

      {/* ===== Top Navigation ===== */}
      <TopNav />

      {/* ===== Main Navigation ===== */}
      <nav
        className={`${"bg-white sticky top-0 shadow-md z-40"} w-full z-40 h-20 relative`}
      >
        <div className="app-max-width w-full">
          <div
            className={`flex justify-between align-baseline app-x-padding ${styles.mainMenu}`}
          >
            {/* Hamburger Menu and Mobile Nav */}
            <div className="flex-1 lg:flex-0 lg:hidden">
              <Menu />
            </div>

            {/* Left Nav */}
            <ul className={`flex-0 lg:flex-1 flex ${styles.leftMenu} flex justify-between`}>
              <li>
                <Link href={`/`}>
                  <a className={styles.navBarItem}>{t("Skin-Cover")}</a>
                </Link>
              </li>

              <li>
                <Link href={`/products/cover/1`}>
                  <a className={styles.navBarItem}>Peace Case 3D</a>
                </Link>
              </li>

              <li>
                <Link href={`/products/coverIphone/1`}>
                  <a className={styles.navBarItem}>Cases </a>
                </Link>
              </li>

              <li>
                <Link href={`/screenProtector`}>
                  <a className={styles.navBarItem}>Protecteur d'écran</a>
                </Link>
              </li>


              <li>
                <Link href={`/accessories`}>
                  <a className={styles.navBarItem}>Accessories Iphone</a>
                </Link>
              </li>
             
            </ul>

            {/* TN PrimeLogo */}
            <div className="flex-1 flex justify-center items-center cursor-pointer">
              <div className="w-32 h-auto">
                <Link href="/">
                  <a>
                    <Image
                      className="justify-center"
                      src="/logo.svg"
                      alt="Picture of the author"
                      width={225}
                      height={55}
                      layout="responsive"
                    />
                  </a>
                </Link>
              </div>
            </div>

            {/* Right Nav */}
            <ul className={`flex-1 flex justify-end ${styles.rightMenu}`}>
              <li>
                <SearchForm />
              </li>
              {/* <li>
                <AuthForm>
                  <UserIcon />
                </AuthForm>
              </li> */}
              <li>
                <Link href="/wishlist" passHref>
                  {/* <a className="relative" aria-label="Wishlist"> */}
                  <button
                    type="button"
                    className="relative"
                    aria-label="Wishlist"
                  >
                    <WhistlistIcon />
                    {noOfWishlist > 0 && (
                      <span
                        className={`${animate} absolute text-xs -top-3 -right-3 bg-gray500 text-gray100 py-1 px-2 rounded-full`}
                      >
                        {noOfWishlist}
                      </span>
                    )}
                  </button>
                  {/* </a> */}
                </Link>
              </li>
              <li>
                <CartItem />
              </li>
              <li className="hidden sm:block">
                <Mheadlessui as="div" className="relative">
                  <Mheadlessui.Button as="a" href="#" className="flex">
                    {t(locale)} <DownArrow />
                  </Mheadlessui.Button>
                  <Mheadlessui.Items
                    className="flex flex-col w-40 right-0 absolute p-1 border border-gray200 bg-white mt-2 outline-none"
                    style={{ zIndex: 9999 }}
                  >
                    <Mheadlessui.Item>
                      {({ active }) => (
                        <MyLink
                          active={locale === "fr" ? true : active}
                          href={asPath}
                          locale="fr"
                        >
                          {t("fr")}
                        </MyLink>
                      )}
                    </Mheadlessui.Item>
                    <Mheadlessui.Item>
                      {({ active }) => (
                        <MyLink
                          active={locale === "ar" ? true : active}
                          href={asPath}
                          locale="ar"
                        >
                          {t("ar")}
                        </MyLink>
                      )}
                    </Mheadlessui.Item>
                    <Mheadlessui.Item>
                      {({ active }) => (
                        <MyLink
                          active={locale === "it" ? true : active}
                          href={asPath}
                          locale="it"
                        >
                          {t("it")}
                        </MyLink>
                      )}
                    </Mheadlessui.Item>
                    <Mheadlessui.Item>
                      {({ active }) => (
                        <MyLink
                          active={locale === "an" ? true : active}
                          href={asPath}
                          locale="an"
                        >
                          {t("an")}
                        </MyLink>
                      )}
                    </Mheadlessui.Item>
                  </Mheadlessui.Items>
                </Mheadlessui>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;

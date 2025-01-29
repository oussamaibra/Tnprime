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
import { useRouter } from "next/router";

type Props = {
  title?: string;
};

const Header: React.FC<Props> = ({ title }) => {
  const t = useTranslations("Navigation");
  const { wishlist } = useWishlist();
  const [animate, setAnimate] = useState("");
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [collection, setcollection] = useState<Array<{ id: number; name: string }>>([]);
  const [categorie, setcategorie] = useState<Array<{ id: number; name: string }>>([]);
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
      const res = await axios.get(`${process.env.NEXT_PUBLIC_COLLECTIONS_MODULE}`);

      setcollection(res.data.data.map((el: any) => ({ name: el.name, id: el?.id })));
    })();
    (async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_CATEGORIE_MODULE}`);

      setcategorie(res.data.data.map((el: any) => ({ name: el.name, id: el?.id })));
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
              onClick={() => router.push(`/product-category/${el.id}/${el?.name}`)}
              key={i}
              className={styles.navBarSubItem}
              style={{ marginLeft: "15px", marginRight: "25px" }}
            >
              {el.name}
            </MenuItem>
            {i !== categorie.length - 1 && <hr className="mx-5 my-2	" style={{ opacity: "5%" }} />}
          </>
        ))}
      </div>
    </MenuRC>
  );
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
      {/* <TopNav /> */}

      {/* ===== Main Navigation ===== */}
      <nav className={`${"bg-white sticky top-0 shadow-md z-40"} w-full z-40 h-20 relative`}>
        <div className="app-max-width w-full">
          <div className={`flex justify-between align-baseline app-x-padding ${styles.mainMenu}`}>
            {/* Hamburger Menu and Mobile Nav */}
            <div className="flex-1 lg:flex-0 lg:hidden">
              <Menu />
            </div>

            {/* Left Nav */}
            <ul className={`flex-0 lg:flex-1 flex ${styles.leftMenu}`}>
              <li>
                <Link href={`/`}>
                  <a className={styles.navBarItem}>{"Accueil"}</a>
                </Link>
              </li>
              {/* <li>
                <Dropdown
                  trigger={["hover", "click"]}
                  overlay={menuCol}
                  animation="slide-up"
                  overlayClassName="w-fit pt-2 cursor-pointer	"
                  openClassName="cursor-pointer	"
                  onVisibleChange={onVisibleChange}
                >
                  <a className={styles.navBarItem}>{"Nos Collection"}</a>
                </Dropdown>
              </li> */}
              <li>
                <Dropdown
                  trigger={["hover", "click"]}
                  overlay={menuCat}
                  animation="slide-up"
                  overlayClassName="w-fit pt-2 cursor-pointer"
                  openClassName="cursor-pointer"
                  onVisibleChange={onVisibleChange}
                >
                  <a className={styles.navBarItem}>{"Catalogue"}</a>
                </Dropdown>
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
              <li>
                <AuthForm>
                  <UserIcon />
                </AuthForm>
              </li>
              <li>
                <Link href="/wishlist" passHref>
                  {/* <a className="relative" aria-label="Wishlist"> */}
                  <button type="button" className="relative" aria-label="Wishlist">
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
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;

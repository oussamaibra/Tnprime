import { FC, useEffect, useState } from "react";
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
import Input from "../Input/Input";
import { isEmpty, isNil, values } from "lodash";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
type Props = {
  item: itemType;
  outStock?: boolean;
  isInsta?: boolean;
};

const CardIG: FC<Props> = ({ item, outStock = false, isInsta = false }) => {
  const [location, setlocation] = useState({});
  const [currency, setcurrency] = useState("TND");

  const checkLocation = async () => {
    const loc = JSON.parse(localStorage.getItem("location") ?? "");
    setlocation(loc);
    setcurrency(loc.currency);
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

  const { id, name, price, img1, img2 } = item;

  const itemLink = `/products/IG/${encodeURIComponent(id)}`;

  return (
    <div className={styles.card}>
      <div className={styles.imageContainerInsta}>
        <Link href={itemLink}>
          <a tabIndex={-1}>
            <LazyLoadImage
              effect="blur"
              src={img1 as string}
              className="lazy-image"
            />
          </a>
        </Link>
      </div>

      <div className="content">
        <Link href={itemLink}>
          <a className={styles.itemName}>{name}</a>
        </Link>
        <div className="text-gray400">
          {" "}
          <strong>
            {" "}
            {price} {currency}{" "}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default CardIG;

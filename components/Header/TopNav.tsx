import { Menu } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import Link from "next/link";

import InstagramLogo from "../../public/icons/InstagramLogo";
import FacebookLogo from "../../public/icons/FacebookLogo";
import DownArrow from "../../public/icons/DownArrow";
import styles from "./Header.module.css";

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

const TopNav = () => {
  const router = useRouter();
  const { asPath, locale } = router;
  const t = useTranslations("Navigation");

  return (
    <div className="bg-gray200 text-black">
      <div className="text-center app-max-width p-2 overflow-hidden">
        <style jsx>{`
          .horizontal-ticker {
            display: flex;
            width: 100%;
            overflow: hidden;
          }
          .horizontal-ticker__container {
            display: flex;
            white-space: nowrap;
            animation: scroll 30s linear infinite;
          }
          .horizontal-ticker__item {
            margin-right: 2rem;
            display: inline-block;
          }
          .horizontal-ticker__item--uppercase {
            text-transform: uppercase;
          }
          .horizontal-ticker__item--bold {
            font-weight: 600;
            font-size: 12px;
          }
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>

        <div className="horizontal-ticker">
          <div className="horizontal-ticker__container">
            <p className="horizontal-ticker__item horizontal-ticker__item--uppercase horizontal-ticker__item--bold">
              🎁 2 = LIVRAISON GRATUITE 🎁
            </p>
            <p className="horizontal-ticker__item horizontal-ticker__item--uppercase horizontal-ticker__item--bold">
              🎁 3+1 GRATUIT🎁 + LIVRAISON GRATUITE 📦
            </p>
            <p className="horizontal-ticker__item horizontal-ticker__item--uppercase horizontal-ticker__item--bold">
              ⏳ Offre valable aujourd'hui seulement ⏳
            </p>
            <p className="horizontal-ticker__item horizontal-ticker__item--uppercase horizontal-ticker__item--bold">
              🎁 2 = LIVRAISON GRATUITE 🎁
            </p>
            <p className="horizontal-ticker__item horizontal-ticker__item--uppercase horizontal-ticker__item--bold">
              🎁 3+1 GRATUIT🎁 + LIVRAISON GRATUITE 📦
            </p>
            <p className="horizontal-ticker__item horizontal-ticker__item--uppercase horizontal-ticker__item--bold">
              ⏳ Offre valable aujourd'hui seulement ⏳
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;

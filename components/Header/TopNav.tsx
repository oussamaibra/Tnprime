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
      <div className="text-center app-max-width p-2 ">
        <p
          className=" decoration-sky-500 "
          style={{ fontWeight: "600", fontSize: "12px" }}
        >
          {t("topnavContent")} <span dir={"ltr"}>📞 42 301 531</span>
        </p>
        {/* <ul className={`flex ${styles.topRightMenu}`}>
          <li>
            <Menu as="div" className="relative">
              <Menu.Button as="a" href="#" className="flex">
                {locale === "fr" ? t("fr") : t("ar")} <DownArrow />
              </Menu.Button>
              <Menu.Items
                className="flex flex-col w-20 right-0 absolute p-1 border border-gray200 bg-white mt-2 outline-none"
                style={{ zIndex: 9999 }}
              >
                <Menu.Item>
                  {({ active }) => (
                    <MyLink active={active} href={asPath} locale="fr">
                      {t("fr")}
                    </MyLink>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <MyLink active={active} href={asPath} locale="ar">
                      {t("ar")}
                    </MyLink>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </li>
        </ul> */}
        {/* <ul className={`flex ${styles.topLeftMenu}`}>
          <li>
            <a href="#" aria-label="TN PrimeFashion Facebook Page">
              <FacebookLogo />
            </a>
          </li>
          <li>
            <a href="#" aria-label="TN PrimeFashion Instagram Account">
              <InstagramLogo />
            </a>
          </li>
          <li>
            <a href="#">{t("about_us")}</a>
          </li>
          <li>
            <a href="#">{t("our_policy")}</a>
          </li>
        </ul>
      
          <li>
            <Menu as="div" className="relative">
              <Menu.Button as="a" href="#" className="flex">
                {t("usd")} <DownArrow />
              </Menu.Button>
              <Menu.Items
                className="flex flex-col w-20 right-0 absolute p-1 border border-gray200 bg-white mt-2 outline-none"
                style={{ zIndex: 9999 }}
              >
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={`${
                        active ? "bg-gray100 text-gray500" : "bg-white text-gray500"
                      } py-2 px-4 text-center focus:outline-none`}
                    >
                      {t("usd")}
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={`${
                        active ? "bg-gray100 text-gray500" : "bg-white text-gray500"
                      } py-2 px-4 text-center focus:outline-none`}
                    >
                      {t("mmk")}
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </li>
        </ul> */}
      </div>
    </div>
  );
};

export default TopNav;

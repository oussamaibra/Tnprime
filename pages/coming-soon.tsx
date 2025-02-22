import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import AppHeader from "../components/Header/AppHeader";
import { GetStaticProps } from "next";

const ComingSoon = () => {
  const t = useTranslations("CartWishlist");
  return (
    <>
      <AppHeader title="Coming Soon!" />
      <div className="flex flex-col h-screen justify-center items-center">
        {/* <h1 className="text-3xl tracking-wider leading-10">
          {t("coming_soon")}
        </h1> */}
        <h2 className="text-2xl text-gray500 mt-2 p-2 text-center">
          {t("thank_you_note")}
        </h2>
        <Image
          src="/bg-img/coding.svg"
          alt="Not created yet"
          width={400}
          height={400}
        />
        <span className="text-gray400">{t("thank_you_for_purchasing")}</span>

        <span className=" font-bold hover:text-gray500">
          Info line : 📞 42 301 531
        </span>

        
        <Link href="/">
          <a className="underline font-bold hover:text-gray500">home page</a>
        </Link>

    
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../messages/common/${locale}.json`)).default,
    },
  };
};

export default ComingSoon;

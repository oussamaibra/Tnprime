import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function ProductCard({ product }) {
  const t = useTranslations("CartWishlist");

  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 p-4 shadow-lg hover:shadow-2xl transition-transform duration-500 hover:scale-105">
      {/* Badge Meilleure Vente */}

      <div
        style={{
          backgroundColor: "red",
        }}
        className="absolute top-2 left-2 from-orange-500 text-white text-xs font-bold px-3 py-1 z-10 shadow-md animate-pulse mt-5"
      >
        {t("MEILLEURE VENTE")}
      </div>

      {/* Image du produit */}
      <div className="relative overflow-hidden mb-1 h-60 sm:h-80 md:h-96 lg:h-[32rem] flex justify-center items-center">
        <Link href={`/products/IG/${product.id}`}>
          <a tabIndex={-1}>
            <LazyLoadImage
              effect="blur"
              src={product.img1 as string}
              className="lazy-image"
              placeholderSrc="/bg-img/loader1.gif"
            />
          </a>
        </Link>
      </div>

      {/* Détails du produit */}
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800 hover:text-red-500 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-600 font-medium mt-1">{product.price} TND </p>
      </div>

      {/* Bouton Ajouter au Panier */}
      {/* <button className="mt-4 w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-105">
        🛒 Ajouter au Panier
      </button> */}
    </div>
  );
}

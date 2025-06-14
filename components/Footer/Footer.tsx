import Link from "next/link";
import { useTranslations } from "next-intl";

import FacebookLogo from "../../public/icons/FacebookLogo";
import InstagramLogo from "../../public/icons/InstagramLogo";
import Button from "../Buttons/Button";
import Input from "../Input/Input";
import styles from "./Footer.module.css";
import IgLogo from "../../public/icons/InstagramLogo";

export default function Footer() {
  const t = useTranslations("Navigation");

  return (
    <div className={styles.fullFooter}>
      {/* <div className={styles.footerContainer}>
        <div className={`app-max-width app-x-padding ${styles.footerContents}`}>
          <div>
            <h3 className={styles.footerHead}>{"INFORMATION"}</h3>
            <div className={styles.column}>
              <a href="example">{"Skin-Cover"}</a>
              <a href="example">{"Nos collection"}</a>
              <a href="example">{"store_location"}</a>
            </div>
          </div>
          <div>
            <h3 className={styles.footerHead}>{"LIENS RAPIDES"}</h3>
            <div className={styles.column}>
              <a href="example">{"Mentions légales"}</a>
              <a href="example">{"Politique de confidentialité"}</a>
              <a href="example">{"Politique d'expédition"}</a>
              <a href="example">{"Contact"}</a>
            </div>
          </div>
          <div>
            <h3 className={styles.footerHead}>
              {"SUIVEZ-NOUS SUR LES RÉSEAUX"}
            </h3>
            <div className={styles.socialsContainer}>
              <a
                href={"https://www.instagram.com/iphone_tnprime"}
                className={styles.socials}
              >
                <IgLogo extraClass={styles.socials} />
              </a>
            </div>
          </div>

          <div>
            <h3 className={styles.footerHead}>
              {"ABONNEZ-VOUS A LA NEWSLETTER"}
            </h3>
            <div className={styles.column}>
              <div className={styles.newsLetterText}>
                <p className="text-sm " style={{ color: "#f2f2f2" }}>
                  En utilisant ce formulaire, vous acceptez de transmettre vos
                  données à Deportivo Industry
                </p>
              </div>
              <div>
                <Input
                  label="Newsletter Input Box"
                  name="email"
                  type="email"
                  extraClass=" w-full sm:w-auto"
                />{" "}
                <Button
                  size="lg"
                  value={"S'INSCRIRE"}
                  extraClass="w-full sm:w-auto bg-gray-500 hover:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className={styles.bottomFooter}>
        <div className="app-max-width app-x-padding w-full flex justify-center">
          <span className="mt-1">
            © {new Date().getFullYear()} TN PRIME Industry. All Rights Reserved.
          </span>

          <div className={styles.socialsContainer}>
            <a
              href={"https://www.instagram.com/prime.shop.tn/"}
              target="_blank"
              className={styles.socials}
              rel="noreferrer"
            >
              <IgLogo extraClass={styles.socials} />
            </a>
          </div>

          {/* <span className="flex items-center">
            <span className="hidden sm:block">{"follow_us_on_social_media"}:</span>{" "}
            <a href="www.facebook.com" aria-label="Facebook Page for TN PrimeFashion">
              <FacebookLogo />
            </a>
            <a href="www.ig.com" aria-label="Instagram Account for TN PrimeFashion">
              <InstagramLogo />
            </a>
          </span> */}
        </div>
      </div>
    </div>
  );
}

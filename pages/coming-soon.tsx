import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import AppHeader from "../components/Header/AppHeader";
import { GetStaticProps } from "next";
import { useEffect } from "react";

const ComingSoon = () => {
  const t = useTranslations("Navigation");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes confettiFall {
        0% { transform: translateY(-100vh) rotate(0deg); }
        100% { transform: translateY(100vh) rotate(360deg); }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={styles.container}>
      {/* Confetti elements */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          style={{
            ...styles.confetti,
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.2}s`,
            background: `hsl(${Math.random() * 360}, 70%, 60%)`,
          }}
        />
      ))}

      <div style={styles.card}>
        <div style={styles.checkmark}>✓</div>
        <h1 style={styles.title}>{t("Order Confirmed!")} 🎉</h1>

        <div style={styles.timeline}>
          <div style={styles.timelineItem}>
            <div style={styles.iconBox}>📞</div>
            <div style={styles.timelineContent}>
              <h3 style={styles.timelineTitle}>{t("24h Confirmation")} </h3>
              <p>{t("We'll contact you shortly")} </p>
            </div>
          </div>

          <div style={styles.timelineItem}>
            <div style={styles.iconBox}>🚚</div>
            <div style={styles.timelineContent}>
              <h3 style={styles.timelineTitle}>{t("48h Delivery")}</h3>
              <p>{t("Maximum delivery time")} </p>
            </div>
          </div>
        </div>

        <div style={styles.contactBox}>
          <p style={styles.contactText}>
            {t("Need help?")}
            <span style={styles.contactHighlight}>📞 42 301 531</span>
          </p>
        </div>
      </div>
    </div>
  );
};


const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f3ff",
    position: "relative",
    overflow: "hidden",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "2rem 3rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    textAlign: "center",
    position: "relative",
    zIndex: 1,
    maxWidth: "600px",
    width: "90%",
    margin: "0 auto",
  },
  checkmark: {
    fontSize: "4rem",
    color: "#4CAF50",
    animation: "bounce 1s ease-in-out",
    marginBottom: "1rem",
  },
  title: {
    color: "#2c3e50",
    margin: "0 0 0.5rem 0",
    fontSize: "2rem",
  },
  orderNumber: {
    color: "#e74c3c",
    fontSize: "1.5rem",
    fontWeight: "bold",
    margin: "0 0 2rem 0",
  },
  timeline: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    margin: "2rem 0",
  },
  timelineItem: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
    borderRadius: "10px",
    backgroundColor: "#f8f9fa",
    transition: "transform 0.3s ease",
    ":hover": {
      transform: "translateY(-5px)",
    },
  },
  iconBox: {
    fontSize: "1.5rem",
    minWidth: "50px",
    height: "50px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e8f4ff",
  },
  timelineContent: {
    textAlign: "left",
  },
  timelineTitle: {
    margin: "0 0 0.25rem 0",
    color: "#2c3e50",
  },
  contactBox: {
    backgroundColor: "#f8f9fa",
    padding: "1rem",
    borderRadius: "10px",
    margin: "2rem 0 0 0",
  },
  contactText: {
    margin: "0",
    color: "#555",
  },
  contactHighlight: {
    color: "#3498db",
    fontWeight: "bold",
  },
  confetti: {
    position: "absolute",
    width: "10px",
    height: "10px",
    top: "-10px",
    animation: "confettiFall 3s linear infinite",
    borderRadius: "50%",
    zIndex: 0,
  },
};


export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../messages/common/${locale}.json`)).default,
    },
  };
};

export default ComingSoon;

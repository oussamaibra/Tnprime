import { Html, Head, Main, NextScript } from "next/document";

const title = "TN Prime";
const desc = "TN Prime";
const keywords = "TN Prime";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />

        <meta content={desc} name="description" key="description" />
        <meta content={keywords} name="keywords" key="keywords" />

        <meta content="follow, index" name="robots" />
        <meta content="#282828" name="theme-color" />
        <meta content="#282828" name="msapplication-TileColor" />

        <link href="/favicons/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
        <link href="/favicons/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/favicons/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
        <link href="/favicons/favicon.ico" rel="shortcut icon" />
        <link href="/favicons/site.webmanifest" rel="manifest" />
        <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Poppins" />

        <meta property="og:url" content="https://tnprime.shop/" />
        <link rel="canonical" href="https://tnprime.shop/" />
        <meta property="og:site_name" content="TN Prime" />
        <meta property="og:description" content={desc} key="og_description" />
        <meta property="og:title" content={title} key="og_title" />
        <meta property="og:image" content="https://tnprime.shop/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@satnaing.dev" />
        <meta name="twitter:title" content={title} key="twitter_title" />
        <meta name="twitter:description" content={desc} key="twitter_description" />
        <meta name="twitter:image" content="https://tnprime.shop/og.png" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

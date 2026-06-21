const SITE_URL = "https://goodluckprosper.vercel.app";

export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Goodluck Prosper",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.svg`,
      },
      {
        "@type": "WebSite",
        name: "Goodluck Prosper",
        url: SITE_URL,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

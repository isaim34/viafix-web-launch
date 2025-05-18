
import React from 'react';
import { Helmet } from 'react-helmet-async';

export const IndexSEO = () => {
  return (
    <Helmet>
      <title>ViaFix | Gig-Based Auto Repair Services in Austin, TX</title>
      <meta name="description" content="ViaFix connects ASE-certified mechanics with customers in Austin, TX. Join us for flexible gigs and reliable mobile auto repair services." />
      <meta name="keywords" content="mobile mechanics, auto repair austin, gig-based auto repair, ASE-certified mechanics, independent mechanic jobs" />
      <link rel="canonical" href="https://tryviafix.com/" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "ViaFix",
            "description": "Gig-based platform connecting mobile mechanics with customers in Austin, TX",
            "url": "https://tryviafix.com",
            "logo": "https://tryviafix.com/logo.png",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Austin",
              "addressRegion": "TX",
              "postalCode": "78701",
              "addressCountry": "US"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "30.2672",
              "longitude": "-97.7431"
            },
            "openingHours": "Mo-Su 00:00-23:59",
            "telephone": "+1-512-555-1234",
            "priceRange": "$$",
            "sameAs": [
              "https://www.facebook.com/viafix",
              "https://www.instagram.com/viafix_app",
              "https://twitter.com/viafix_app"
            ],
            "potentialAction": {
              "@type": "FindAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://tryviafix.com/mechanics?zipCode={zip}"
              },
              "object": {
                "@type": "Service",
                "name": "Mobile Auto Repair Services"
              }
            }
          }
        `}
      </script>
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How does ViaFix work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "ViaFix connects you with skilled ASE-certified mechanics near you in Austin, TX. Simply describe your vehicle issue, choose a mechanic based on their ratings and specialties, and they'll come to your location to perform the repair."
                }
              },
              {
                "@type": "Question",
                "name": "Are ViaFix mechanics certified?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, all mechanics on the ViaFix platform are vetted and many hold ASE certifications, ensuring they have the skills and expertise to properly repair your vehicle."
                }
              },
              {
                "@type": "Question",
                "name": "How do I become a mechanic on ViaFix?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Independent mechanics can join ViaFix by creating a profile, verifying their credentials, and setting up their service offerings. Start earning with flexible gig-based auto repair jobs in Austin."
                }
              }
            ]
          }
        `}
      </script>
    </Helmet>
  );
};

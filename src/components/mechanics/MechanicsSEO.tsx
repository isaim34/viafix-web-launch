
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface Mechanic {
  id: string;
  name: string;
  avatar: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  location: string;
  hourlyRate: number;
  galleryImages?: string[];
  zipCode?: string;
}

interface MechanicsSEOProps {
  zipCode: string;
  locationName: string;
  filteredMechanics: Mechanic[];
}

const MechanicsSEO = ({ zipCode, locationName, filteredMechanics }: MechanicsSEOProps) => {
  const pageTitle = zipCode 
    ? `Find Mobile Mechanics in ${zipCode} | ${locationName || 'Your Area'} | ViaFix`
    : `Top-Rated Mobile Mechanics in Austin, TX | ViaFix`;

  const pageDescription = zipCode
    ? `Connect with ASE-certified mobile mechanics in ${zipCode}${locationName ? ` (${locationName})` : ''}. Browse profiles, read reviews, and book gig-based auto repair services.`
    : `Find skilled ASE-certified mobile mechanics in Austin, TX. ViaFix connects you with top-rated professionals for on-demand auto repair services at your location.`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content="mobile mechanics Austin, ASE-certified mechanics, on-demand auto repair, gig-based mechanics, auto repair services Austin TX" />
      <link rel="canonical" href={`https://tryviafix.com/mechanics${zipCode ? `?zipCode=${zipCode}` : ''}`} />
      
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": [
              ${filteredMechanics.map((mechanic, index) => `
                {
                  "@type": "ListItem",
                  "position": ${index + 1},
                  "item": {
                    "@type": "Service",
                    "name": "${mechanic.name} - Mobile Mechanic",
                    "description": "${mechanic.specialties.join(', ')} specialist in ${mechanic.location}",
                    "provider": {
                      "@type": "Person",
                      "name": "${mechanic.name}",
                      "image": "${mechanic.avatar}",
                      "areaServed": "${mechanic.location}"
                    },
                    "aggregateRating": {
                      "@type": "AggregateRating",
                      "ratingValue": "${mechanic.rating}",
                      "reviewCount": "${mechanic.reviewCount}"
                    },
                    "offers": {
                      "@type": "Offer",
                      "price": "${mechanic.hourlyRate}",
                      "priceCurrency": "USD",
                      "priceSpecification": {
                        "@type": "PriceSpecification",
                        "price": "${mechanic.hourlyRate}",
                        "priceCurrency": "USD",
                        "unitText": "HOUR"
                      }
                    }
                  }
                }
              `).join(',')}
            ]
          }
        `}
      </script>
    </Helmet>
  );
};

export default MechanicsSEO;

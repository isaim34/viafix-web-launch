
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { mechanicsDetailedData } from '@/data/mechanicsData';
import MechanicsHeader from '@/components/mechanics/MechanicsHeader';
import MechanicsZipCodeSearch from '@/components/mechanics/MechanicsZipCodeSearch';
import MechanicsSearch from '@/components/mechanics/MechanicsSearch';
import MechanicsList from '@/components/mechanics/MechanicsList';
import { Helmet } from 'react-helmet-async';
import { useZipcode } from '@/hooks/useZipcode';

const mechanicsData = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Engine Repair', 'Diagnostics'],
    rating: 4.8,
    reviewCount: 127,
    location: 'Austin, TX',
    hourlyRate: 85,
    galleryImages: mechanicsDetailedData['1'].galleryImages,
    zipCode: '73301'
  },
  {
    id: '2',
    name: 'Sarah Martinez',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Electrical Systems', 'AC Repair'],
    rating: 4.7,
    reviewCount: 94,
    location: 'Austin, TX',
    hourlyRate: 75,
    galleryImages: mechanicsDetailedData['2'].galleryImages,
    zipCode: '73301'
  },
  {
    id: '3',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Transmission', 'Brake Systems'],
    rating: 4.9,
    reviewCount: 156,
    location: 'Austin, TX',
    hourlyRate: 90,
    zipCode: '73301'
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Oil Changes', 'Tune-ups', 'Filters'],
    rating: 4.6,
    reviewCount: 78,
    location: 'Austin, TX',
    hourlyRate: 65,
    zipCode: '78640' // Added your zipcode here for testing
  },
  {
    id: '5',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Suspension', 'Steering', 'Alignment'],
    rating: 4.8,
    reviewCount: 112,
    location: 'Austin, TX',
    hourlyRate: 80,
    zipCode: '73301'
  },
  {
    id: '6',
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Diesel Engines', 'Performance Tuning'],
    rating: 4.9,
    reviewCount: 203,
    location: 'Austin, TX',
    hourlyRate: 95,
    zipCode: '73301'
  }
];

const Mechanics = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialZipCode = queryParams.get('zipCode') || '';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [zipCode, setZipCode] = useState(initialZipCode);
  const [locationName, setLocationName] = useState('');
  const { fetchLocationData, locationData, isLoading, error } = useZipcode();
  
  // Fetch location data when zipCode changes
  useEffect(() => {
    if (zipCode && zipCode.length === 5) {
      fetchLocationData(zipCode);
    }
  }, [zipCode, fetchLocationData]);
  
  // Update locationName when we get data from the API
  useEffect(() => {
    if (locationData && locationData.places && locationData.places.length > 0) {
      const place = locationData.places[0];
      setLocationName(`${place.placeName}, ${place.stateAbbreviation}`);
    } else {
      setLocationName('');
    }
  }, [locationData]);
  
  const filteredMechanics = mechanicsData.filter(mechanic => {
    const matchesSearch = 
      mechanic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mechanic.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
      mechanic.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Enhanced zipcode matching logic
    const matchesZip = !zipCode ? true : (
      // Exact match with mechanic's zipcode if available
      (mechanic.zipCode && mechanic.zipCode === zipCode) ||
      // Or in same city/area if we have location data
      (locationName && mechanic.location.includes(locationName.split(',')[0]))
    );
    
    return matchesSearch && matchesZip;
  });

  const pageTitle = zipCode 
    ? `Find Mobile Mechanics in ${zipCode} | ${locationName || 'Your Area'} | ViaFix`
    : `Top-Rated Mobile Mechanics in Austin, TX | ViaFix`;

  const pageDescription = zipCode
    ? `Connect with ASE-certified mobile mechanics in ${zipCode}${locationName ? ` (${locationName})` : ''}. Browse profiles, read reviews, and book gig-based auto repair services.`
    : `Find skilled ASE-certified mobile mechanics in Austin, TX. ViaFix connects you with top-rated professionals for on-demand auto repair services at your location.`;

  return (
    <Layout>
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

      <div className="container mx-auto px-4 sm:px-6 py-12">
        <MechanicsHeader />
        <MechanicsZipCodeSearch zipCode={zipCode} setZipCode={setZipCode} />
        <MechanicsSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <MechanicsList 
          mechanics={filteredMechanics} 
          zipCode={zipCode} 
          locationName={locationName}
          isLoading={isLoading && zipCode.length === 5}
        />
      </div>
    </Layout>
  );
};

export default Mechanics;

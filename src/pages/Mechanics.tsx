
import React from 'react';
import { Layout } from '@/components/Layout';
import { Helmet } from 'react-helmet-async';
import { useMechanicsPage } from '@/hooks/useMechanicsPage';
import MechanicsHeader from '@/components/mechanics/MechanicsHeader';
import MechanicsZipCodeSearch from '@/components/mechanics/MechanicsZipCodeSearch';
import MechanicsSearch from '@/components/mechanics/MechanicsSearch';
import MechanicsList from '@/components/mechanics/MechanicsList';
import MechanicsSEO from '@/components/mechanics/MechanicsSEO';

const Mechanics = () => {
  const { 
    zipCode, 
    setZipCode,
    searchTerm,
    setSearchTerm,
    filteredMechanics,
    locationName,
    isLoading
  } = useMechanicsPage();

  return (
    <Layout>
      <MechanicsSEO zipCode={zipCode} locationName={locationName} filteredMechanics={filteredMechanics} />
      
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

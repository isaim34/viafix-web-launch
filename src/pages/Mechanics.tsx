
import React from 'react';
import { Layout } from '@/components/Layout';
import { useMechanicsPage } from '@/hooks/useMechanicsPage';
import MechanicsHeader from '@/components/mechanics/MechanicsHeader';
import MechanicsZipCodeSearch from '@/components/mechanics/MechanicsZipCodeSearch';
import MechanicsSearch from '@/components/mechanics/MechanicsSearch';
import { MechanicsList } from '@/components/mechanics/MechanicsList';
import MechanicsSEO from '@/components/mechanics/MechanicsSEO';
import { Loader2 } from 'lucide-react';

const Mechanics = () => {
  const { 
    zipCode, 
    setZipCode,
    searchTerm,
    setSearchTerm,
    filteredMechanics,
    locationName,
    loading
  } = useMechanicsPage();

  return (
    <Layout>
      <MechanicsSEO zipCode={zipCode} locationName={locationName} filteredMechanics={filteredMechanics} />
      
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <MechanicsHeader />
        <MechanicsZipCodeSearch zipCode={zipCode} setZipCode={setZipCode} />
        <MechanicsSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <MechanicsList 
            mechanics={filteredMechanics} 
            zipCode={zipCode} 
            locationName={locationName}
            setZipCode={setZipCode}
          />
        )}
      </div>
    </Layout>
  );
};

export default Mechanics;

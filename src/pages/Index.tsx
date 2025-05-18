
import React from 'react';
import { Layout } from '@/components/Layout';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedMechanics } from '@/components/FeaturedMechanics';
import { BlogSection } from '@/components/BlogSection';
import { LinkChecker } from '@/components/LinkChecker';
import { IndexSEO } from '@/components/sections/IndexSEO';
import { VehicleSearchSection } from '@/components/sections/VehicleSearchSection';
import { IndexHowItWorks } from '@/components/sections/IndexHowItWorks';
import { IndexBenefits } from '@/components/sections/IndexBenefits';

const Index = () => {
  return (
    <Layout>
      <IndexSEO />
      <HeroSection />
      
      {process.env.NODE_ENV === 'development' && <LinkChecker />}
      
      <VehicleSearchSection />
      <IndexHowItWorks />
      <FeaturedMechanics />
      <IndexBenefits />
      <BlogSection />
    </Layout>
  );
};

export default Index;

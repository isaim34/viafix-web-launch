
import { HeroSection } from "@/components/HeroSection";
import { VehicleSearchSection } from "@/components/sections/VehicleSearchSection";
import { IndexBenefits } from "@/components/sections/IndexBenefits";
import { IndexHowItWorks } from "@/components/sections/IndexHowItWorks";
import { FeaturedMechanics } from "@/components/FeaturedMechanics";
import { BlogSection } from "@/components/BlogSection";
import { Layout } from "@/components/Layout";
import { IndexSEO } from "@/components/sections/IndexSEO";
import { ChatTestHelper } from "@/components/chat/ChatTestHelper";

const Index = () => {
  return (
    <Layout>
      <IndexSEO />
      <HeroSection />
      <VehicleSearchSection />
      <IndexBenefits />
      <IndexHowItWorks />
      <FeaturedMechanics />
      <BlogSection />
      
      {/* Temporary Chat Test Helper */}
      <div className="container py-12">
        <ChatTestHelper />
      </div>
    </Layout>
  );
};

export default Index;

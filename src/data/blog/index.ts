
import { BlogPostsCollection } from '@/types/blog';
import { post as carMaintenanceBasics } from './posts/car-maintenance-basics';
import { post as findTrustedServiceProvider } from './posts/find-trusted-service-provider';
import { post as autoRepairTips } from './posts/auto-repair-tips';
import { post as understandingCarDiagnostics } from './posts/understanding-car-diagnostics';
import { post as mobileMechanicBenefits } from './posts/mobile-mechanic-benefits';
import { post as winterCarCare } from './posts/winter-car-care';
import { post as choosingRightOil } from './posts/choosing-right-oil';
import { post as extendTireLife } from './posts/extend-tire-life';
import { post as commonBrakeProblems } from './posts/common-brake-problems';
import { post as diyCarWash } from './posts/diy-car-wash';

// Import new blog posts
import { post as viafixChangingVehicleMaintenance } from './posts/viafix-changing-vehicle-maintenance';
import { post as becomingViafixVendor } from './posts/becoming-viafix-vendor';
import { post as qualityToolsMobileMechanics } from './posts/quality-tools-mobile-mechanics';
import { post as vehiclePartSuppliers } from './posts/vehicle-part-suppliers';
import { post as buildingTrustMobileMechanic } from './posts/building-trust-mobile-mechanic';

// Import new vendor blog posts
import { post as howViafixSupportsMechanics } from './posts/how-viafix-supports-mechanics';
import { post as buildingMobileMechanicTrust } from './posts/building-mobile-mechanic-trust';
import { post as mobileMechanicInsuranceBasics } from './posts/mobile-mechanic-insurance-basics';

export const blogPosts: BlogPostsCollection = {
  'car-maintenance-basics': carMaintenanceBasics,
  'find-trusted-service-provider': findTrustedServiceProvider,
  'auto-repair-tips': autoRepairTips,
  'understanding-car-diagnostics': understandingCarDiagnostics,
  'mobile-mechanic-benefits': mobileMechanicBenefits,
  'winter-car-care': winterCarCare,
  'choosing-right-oil': choosingRightOil,
  'extend-tire-life': extendTireLife,
  'common-brake-problems': commonBrakeProblems,
  'diy-car-wash': diyCarWash,
  
  // Add new blog posts
  'viafix-changing-vehicle-maintenance': viafixChangingVehicleMaintenance,
  'becoming-viafix-vendor': becomingViafixVendor,
  'quality-tools-mobile-mechanics': qualityToolsMobileMechanics,
  'vehicle-part-suppliers': vehiclePartSuppliers,
  'building-trust-mobile-mechanic': buildingTrustMobileMechanic,
  
  // Add new vendor blog posts
  'how-viafix-supports-mechanics': howViafixSupportsMechanics,
  'building-mobile-mechanic-trust': buildingMobileMechanicTrust,
  'mobile-mechanic-insurance-basics': mobileMechanicInsuranceBasics
};

export default blogPosts;

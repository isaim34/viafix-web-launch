
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
  'diy-car-wash': diyCarWash
};

export default blogPosts;

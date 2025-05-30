
/**
 * Performance scoring algorithm for mechanics
 */
export const calculatePerformanceScore = (data: {
  avgRating: number;
  totalReviews: number;
  completedJobs: number;
  totalJobs: number;
  recentActivity: number;
  yearsExperience: number;
}): number => {
  // Scoring algorithm weights:
  // 40% Reviews & Rating (customer satisfaction)
  // 30% Job completion rate (reliability)
  // 20% Activity level (recent engagement)
  // 10% Experience and certifications

  const ratingScore = (data.avgRating / 5) * 40;
  const reviewVolumeBonus = Math.min(data.totalReviews / 10, 5); // Bonus up to 5 points for review volume
  
  const completionRate = data.totalJobs > 0 ? (data.completedJobs / data.totalJobs) : 0;
  const reliabilityScore = completionRate * 30;
  
  const activityScore = Math.min(data.recentActivity / 5, 20); // Recent jobs in last 30 days, max 20 points
  
  const experienceScore = Math.min(data.yearsExperience / 10, 10); // Max 10 points for experience
  
  return ratingScore + reviewVolumeBonus + reliabilityScore + activityScore + experienceScore;
};

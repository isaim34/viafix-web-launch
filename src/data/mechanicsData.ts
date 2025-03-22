
import { MechanicDetail } from '@/types/mechanic';

// Sample mechanic detailed data
export const mechanicsDetailedData: Record<string, MechanicDetail> = {
  '1': {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Engine Repair', 'Diagnostics', 'Oil Changes', 'Brake Replacement'],
    rating: 4.8,
    reviewCount: 127,
    location: 'Los Angeles, CA',
    hourlyRate: 85,
    yearsExperience: 8,
    about: "Certified master mechanic with over 8 years of experience specializing in German and Japanese vehicles. I take pride in providing honest, high-quality service at fair prices. My mobile setup allows me to perform most repairs and maintenance directly at your location.",
    responseTime: "Under 1 hour",
    services: [
      { name: "Diagnostic Scan", price: 75 },
      { name: "Oil Change", price: 65 },
      { name: "Brake Pad Replacement", price: 150 },
      { name: "Engine Tune-Up", price: 120 },
      { name: "Battery Replacement", price: 90 }
    ],
    reviews: [
      { author: "Michael T.", rating: 5, text: "Alex was prompt, professional and very knowledgeable. Fixed my BMW's electrical issue quickly. Highly recommend!" },
      { author: "Sarah L.", rating: 4, text: "Great service. Came out same day and fixed my AC issue. Fair pricing and no unnecessary upsells." },
      { author: "David K.", rating: 5, text: "The convenience of having my car fixed in my own driveway was amazing. Alex is extremely skilled and efficient." }
    ]
  },
  '2': {
    id: '2',
    name: 'Sarah Martinez',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Electrical Systems', 'AC Repair', 'Computer Diagnostics'],
    rating: 4.7,
    reviewCount: 94,
    location: 'Chicago, IL',
    hourlyRate: 75,
    yearsExperience: 6,
    about: "ASE certified with specialization in electrical systems and diagnostics. I bring dealership-level diagnostic equipment to your location. With expertise in both domestic and foreign vehicles, I can handle most electrical and computer-related issues on site.",
    responseTime: "2-3 hours",
    services: [
      { name: "Electrical Diagnostic", price: 80 },
      { name: "AC System Repair", price: 120 },
      { name: "Computer Reset/Programming", price: 95 },
      { name: "Alternator Replacement", price: 180 },
      { name: "Starter Replacement", price: 160 }
    ],
    reviews: [
      { author: "Jennifer M.", rating: 5, text: "Sarah diagnosed and fixed an electrical issue that two shops couldn't figure out. Saved me hundreds!" },
      { author: "Robert P.", rating: 4, text: "Very knowledgeable about AC systems. Fixed my car's AC just in time for summer." },
      { author: "Thomas G.", rating: 5, text: "Professional, punctual, and extremely skilled. Will definitely use her services again." }
    ]
  }
};

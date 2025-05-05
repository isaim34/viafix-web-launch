
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
    reviews: [], // Removed mock reviews
    galleryImages: [
      'https://images.unsplash.com/photo-1632931612869-c1a971a02054?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', // Engine repair
      'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', // Brake service
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'  // Diagnostic equipment
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
    reviews: [], // Removed mock reviews
    galleryImages: [
      'https://images.unsplash.com/photo-1622568538924-7360163d657a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', // Electrical repair
      'https://images.unsplash.com/photo-1600661653561-629509216228?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', // AC repair
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'  // Computer diagnostics
    ]
  }
};

import React from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Wrench, Clock, Calendar, ArrowLeft, MessageCircle, Smartphone, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Sample mechanic detailed data
const mechanicsDetailedData = {
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

const MechanicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Default to first mechanic if ID not found (for demo purposes)
  const mechanic = id && mechanicsDetailedData[id as keyof typeof mechanicsDetailedData] 
    ? mechanicsDetailedData[id as keyof typeof mechanicsDetailedData]
    : mechanicsDetailedData['1'];

  const handleBookService = () => {
    // In a real app, this would create a booking in the database
    // For now, just show a toast message
    toast({
      title: "Booking Request Sent",
      description: `Your booking request has been sent to ${mechanic.name}.`,
      variant: "default",
    });
    
    // Navigate to dashboard for demo purposes
    // In a real app, this might go to a booking confirmation page
    setTimeout(() => {
      navigate('/mechanic/dashboard');
    }, 1500);
  };

  const handleContact = () => {
    // In a real app, this would create a message in the database
    // For now, just show a toast message
    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${mechanic.name}.`,
      variant: "default",
    });
    
    // Navigate to dashboard for demo purposes
    // In a real app, this might go to a message confirmation page
    setTimeout(() => {
      navigate('/mechanic/dashboard');
    }, 1500);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <Link to="/mechanics" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Back to mechanics</span>
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="col-span-2">
            <motion.div 
              className="glass-card p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-col md:flex-row">
                <img 
                  src={mechanic.avatar} 
                  alt={mechanic.name} 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover mb-4 md:mb-0 md:mr-6"
                />
                <div>
                  <div className="flex items-center mb-2">
                    <h1 className="text-2xl font-bold mr-3">{mechanic.name}</h1>
                    <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 font-medium">{mechanic.rating.toFixed(1)}</span>
                    <span className="ml-1 text-gray-500">({mechanic.reviewCount} reviews)</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mechanic.specialties.map((specialty, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center bg-blue-50 rounded-full px-3 py-1 text-xs font-medium text-blue-700"
                      >
                        <Wrench className="w-3 h-3 mr-1" />
                        {specialty}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                      {mechanic.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-gray-400" />
                      Response: {mechanic.responseTime}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      {mechanic.yearsExperience} years experience
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* About */}
            <motion.div 
              className="glass-card p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-gray-700">{mechanic.about}</p>
            </motion.div>
            
            {/* Services */}
            <motion.div 
              className="glass-card p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold mb-4">Services & Pricing</h2>
              <div className="space-y-4">
                {mechanic.services.map((service, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{service.name}</span>
                    <span className="text-primary font-bold">${service.price}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-sm text-gray-500">
                <p>* Base prices listed. Final cost may vary based on vehicle make, model, and condition.</p>
              </div>
            </motion.div>
            
            {/* Reviews */}
            <motion.div 
              className="glass-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Reviews</h2>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-bold text-lg">{mechanic.rating.toFixed(1)}</span>
                  <span className="ml-1 text-gray-500">({mechanic.reviewCount})</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {mechanic.reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{review.author}</h3>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{review.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Right Column - Booking */}
          <div className="col-span-1">
            <motion.div 
              className="glass-card p-6 sticky top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl font-bold mb-4">Book {mechanic.name.split(' ')[0]}</h2>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-700">Hourly Rate</span>
                  <span className="text-xl font-bold">${mechanic.hourlyRate}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Responds in {mechanic.responseTime}</span>
                </div>
              </div>
              
              <Button className="w-full mb-3" onClick={handleBookService}>
                Book Service
              </Button>
              
              <Button variant="outline" className="w-full mb-6" icon={<MessageCircle className="w-4 h-4" />} onClick={handleContact}>
                Contact
              </Button>
              
              <div className="text-sm text-gray-500 flex items-start mb-4">
                <Smartphone className="w-4 h-4 mr-2 mt-0.5" />
                <div>
                  You won't be charged yet. After booking, you'll discuss details and confirm the service with {mechanic.name.split(' ')[0]}.
                </div>
              </div>
              
              <div className="text-sm text-gray-500 flex items-start">
                <Shield className="w-4 h-4 mr-2 mt-0.5" />
                <div>
                  All payments are secure and covered by our satisfaction guarantee.
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MechanicProfile;

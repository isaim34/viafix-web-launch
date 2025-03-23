import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { mechanicsDetailedData } from '@/data/mechanicsData';
import MechanicsHeader from '@/components/mechanics/MechanicsHeader';
import MechanicsZipCodeSearch from '@/components/mechanics/MechanicsZipCodeSearch';
import MechanicsSearch from '@/components/mechanics/MechanicsSearch';
import MechanicsList from '@/components/mechanics/MechanicsList';

const mechanicsData = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Engine Repair', 'Diagnostics'],
    rating: 4.8,
    reviewCount: 127,
    location: 'Los Angeles, CA',
    hourlyRate: 85,
    galleryImages: mechanicsDetailedData['1'].galleryImages
  },
  {
    id: '2',
    name: 'Sarah Martinez',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Electrical Systems', 'AC Repair'],
    rating: 4.7,
    reviewCount: 94,
    location: 'Chicago, IL',
    hourlyRate: 75,
    galleryImages: mechanicsDetailedData['2'].galleryImages
  },
  {
    id: '3',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Transmission', 'Brake Systems'],
    rating: 4.9,
    reviewCount: 156,
    location: 'Austin, TX',
    hourlyRate: 90
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Oil Changes', 'Tune-ups', 'Filters'],
    rating: 4.6,
    reviewCount: 78,
    location: 'Miami, FL',
    hourlyRate: 65
  },
  {
    id: '5',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Suspension', 'Steering', 'Alignment'],
    rating: 4.8,
    reviewCount: 112,
    location: 'Seattle, WA',
    hourlyRate: 80
  },
  {
    id: '6',
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: ['Diesel Engines', 'Performance Tuning'],
    rating: 4.9,
    reviewCount: 203,
    location: 'Dallas, TX',
    hourlyRate: 95
  }
];

const Mechanics = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialZipCode = queryParams.get('zipCode') || '';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [zipCode, setZipCode] = useState(initialZipCode);
  
  const filteredMechanics = mechanicsData.filter(mechanic => {
    const matchesSearch = 
      mechanic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mechanic.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
      mechanic.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesZip = zipCode ? mechanic.location.includes(zipCode.substring(0, 2)) : true;
    
    return matchesSearch && matchesZip;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <MechanicsHeader />
        <MechanicsZipCodeSearch zipCode={zipCode} setZipCode={setZipCode} />
        <MechanicsSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <MechanicsList mechanics={filteredMechanics} zipCode={zipCode} />
      </div>
    </Layout>
  );
};

export default Mechanics;

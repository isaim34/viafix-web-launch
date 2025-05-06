
import { Service, MechanicDetail } from '@/types/mechanic';
import { useCustomOffer } from '@/components/mechanic/MechanicCustomOffer';

export const useMechanicProfileCustomOffer = (
  mechanic: MechanicDetail | null, 
  selectedService: Service | null,
  openChat: () => void,
  handleSendMessage: (message: string) => void
) => {
  const defaultMechanic: MechanicDetail = {
    id: 'default',
    name: 'Mechanic',
    avatar: '',
    specialties: [],
    rating: 0,
    reviewCount: 0,
    location: '',
    hourlyRate: 0,
    yearsExperience: 0,
    about: '',
    responseTime: '',
    services: [],
    reviews: [],
    galleryImages: []
  };

  // Initialize the custom offer hook
  const {
    isCustomOfferOpen,
    setIsCustomOfferOpen,
    handleCustomOffer,
    handleSubmitCustomOffer
  } = useCustomOffer({
    mechanic: mechanic || defaultMechanic,
    selectedService,
    openChat,
    handleSendMessage
  });

  return {
    isCustomOfferOpen,
    setIsCustomOfferOpen,
    handleCustomOffer,
    handleSubmitCustomOffer
  };
};

// Centralized Tours Configuration
// Add new tours here and they will automatically appear in the Explore Destinations carousel

export interface TourDestination {
  id: string;
  name: string;
  country: string;
  subtitle: string;
  tagline: string;
  description: string;
  duration: string;
  image: string;
  link: string;
  published: boolean;
}

export const tours = [
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    subtitle: 'Beneath the Surface',
    tagline: 'Modernist Architecture, Coastal Cuisine & Mediterranean Spirit',
    description: 'Explore Barcelona\'s vibrant culinary scene from traditional tapas bars to avant-garde restaurants.',
    duration: '6 Days / 5 Nights',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    link: '/tours',
    published: false
  },
  {
    id: 'medellin',
    name: 'Medellín',
    country: 'Colombia',
    subtitle: 'Beneath the Valley',
    tagline: 'Mountains, Innovation & Colombian Soul',
    description: 'Experience Medellín\'s transformation through its food, culture, and the warmth of paisa hospitality.',
    duration: '7 Days / 6 Nights',
    image: 'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    link: '/medellin-tours',
    published: true
  },
  {
    id: 'buenos-aires',
    name: 'Buenos Aires',
    country: 'Argentina',
    subtitle: 'Beneath the Furia',
    tagline: 'Tango, Asado & Argentine Passion',
    description: 'Dive into the soul of Buenos Aires through legendary steakhouses, milongas, and neighborhood parrillas.',
    duration: '8 Days / 7 Nights',
    image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    link: '/buenos-aires-tours',
    published: true
  },
  {
    id: 'rio',
    name: 'Rio de Janeiro',
    country: 'Brazil',
    subtitle: 'Beneath the Hustle',
    tagline: 'Beaches, Samba & Tropical Flavors',
    description: 'From beachside kiosks to mountain-top vistas, discover the rhythm and soul of Brazil\'s most iconic city.',
    duration: '7 Days / 6 Nights',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    link: '/rio-tours',
    published: true
  },
  {
    id: 'palermo',
    name: 'Palermo',
    country: 'Italy',
    subtitle: 'Beneath the Sunhine',
    tagline: 'Markets, Street Food & Sicilian Heritage',
    description: 'Wander through ancient markets, taste Arab-Norman fusion, and experience Sicily\'s layered history through food.',
    duration: '6 Days / 5 Nights',
    image: 'https://images.unsplash.com/photo-1696773605964-16f6abbef9de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    link: '/palermo-tours',
    published: true
  },
  {
    id: 'malaga',
    name: 'Málaga',
    country: 'Spain',
    subtitle: 'Beneath the Onda',
    tagline: 'Coastal Traditions, Andalusian Warmth & Mediterranean Bounty',
    description: 'Discover Málaga\'s authentic fishing village roots, coastal cuisine, and the sun-soaked flavors of southern Spain.',
    duration: '5 Days / 4 Nights',
    image: 'https://images.unsplash.com/photo-1707919746451-f988b2c632d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    link: '/malaga-tours',
    published: true
  },
  {
    id: 'istanbul',
    name: 'Istanbul',
    country: 'Turkey',
    subtitle: 'Beneath the Bridge',
    tagline: 'Spices, History & Cross-Continental Flavors',
    description: 'Journey through Istanbul\'s culinary crossroads where East meets West across the Bosphorus.',
    duration: '7 Days / 6 Nights',
    image: 'https://images.unsplash.com/photo-1659395065151-c181db039a1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    link: '/istanbul-tours',
    published: true
  },
  {
    id: 'beirut',
    name: 'Beirut',
    country: 'Lebanon',
    subtitle: 'Beneath the Cedars',
    tagline: 'Ancient Mezze, Modern Resilience & Levantine Soul',
    description: 'Experience the phoenix city through its legendary hospitality, vibrant mezze culture, and stories of survival.',
    duration: '6 Days / 5 Nights',
    image: 'https://images.unsplash.com/photo-1759403605420-dca1e5c28a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    link: '/beirut-tours',
    published: true
  }
];

// Get only published tours for display
export const getPublishedTours = (): TourDestination[] => {
  return tours.filter(tour => tour.published);
};

// Get tour by ID
export const getTourById = (id: string): TourDestination | undefined => {
  return tours.find(tour => tour.id === id);
};

// Get total count of published tours
export const getPublishedToursCount = (): number => {
  return getPublishedTours().length;
};
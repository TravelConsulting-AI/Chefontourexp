import { motion } from 'motion/react';
import { useInView } from '../components/hooks/useInView';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Mail, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import heroImage from '@/assets/5389f87e72e66d7ac71f0e0dfb14e7fd7adc991e.png';
import anjalinaImage from '@/assets/3d55aabb3864e1a1a9780149b007b83078a1901f.png';
import gonzaloImage from '@/assets/728aae2db10e37ca37c9e76d10a272628c13d02a.png';
import andresImage from '@/assets/f72815489061f23d5edf1fa46d3453cda9de0a7e.png';
import morganImage from '@/assets/57a27f07b3f1a3c2ea8f1027c232d22823dbba53.png';
import fredricImage from '@/assets/756dff2238faadaaaa29939f7f0606413504081d.png';
import matanImage from '@/assets/1c1d8ad37d481ac2ede54c5f4ff846dbad42a790.png';
import ryanImage from '@/assets/ac81f919467d7b26a3450882cea966fcf1a59ef5.png';
import joeImage from '@/assets/3411365d48272959af666b9c796f765581b76f77.png';
import torstenImage from '@/assets/3f2165537332e0179b5f7d203d1eaa6482007ba7.png';
import marcImage from '@/assets/0074f40dc5310c4bdd94a6172e5e869cc0396d11.png';
import wilsonImage from '@/assets/4bf73ace4026287f764d419138f64ed98ce8350f.png';
import janieImage from '@/assets/4416e3e9bfa814b010af3839de75e768708cd6f4.png';
import jlPastorImage from '@/assets/64db2db217b9ff1b01ccc06aa523c5c6864ee361.png';
import umiImage from '@/assets/2457d9f577421cdb8e3231e21ebca1da4684ee10.png';

// Chef Charles Webb Gallery Images
import charlesGallery1 from '@/assets/1aa40058bcdb717f7b6d691fe36a1383d1ad74cf.png';
import charlesGallery2 from '@/assets/d9ab145969a9a7a4e6eae41683f09da87aeb20a0.png';
import charlesGallery3 from '@/assets/6fa4284e2db9fe56702f81be4cb5704d8f7c060c.png';
import charlesGallery4 from '@/assets/4c6703aa61077c4053f6aa332674895c0881540f.png';
import charlesGallery5 from '@/assets/5389f87e72e66d7ac71f0e0dfb14e7fd7adc991e.png';
import charlesGallery6 from '@/assets/b936e1681e83db69c5294fe3ec0ebc2dd9610075.png';
import charlesGallery7 from '@/assets/c1d4680404648078bc47c1032d894ab7ceaf5c72.png';
import charlesGallery8 from '@/assets/5dc18689c25d836b7d7f25434477b680089fa1ff.png';

// Anjalina Chugani Gallery Images
import anjalinaGallery1 from '@/assets/20cb88e3d3533ec8a429343693d58681b907cf8e.png';
import anjalinaGallery2 from '@/assets/247a7bc744ec86e72397121f24cf3ad7060842ec.png';
import anjalinaGallery3 from '@/assets/07856a26538dc478315e584e05722d9c6292d0bf.png';
import anjalinaGallery4 from '@/assets/583630652161eebcba4e789be95fb726135dfdd4.png';

// Morgan Doetsch Gallery Images
import morganGallery1 from '@/assets/a09569011f3a9993e6df4f358e7076ec5cde62fa.png';
import morganGallery2 from '@/assets/e4bb25067b9cf1c7e1cc6be10e1a5386cf1d3289.png';
import morganGallery3 from '@/assets/59773930617446d489c4ab8f0d8593f48a35c5bf.png';
import morganGallery4 from '@/assets/a851a03b2596d502f255559200cdc8065fe8bab6.png';

// JL Pastor Gallery Images
import jlPastorGallery1 from '@/assets/af9949d35d5ca27fbe38387a9bfa3515fa48c58e.png';

// Umi McGuckin Gallery Images
import umiGallery1 from '@/assets/c8c402caf17fe28e5e28d9dd1cbe2ec47b594617.png';

export function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMemberData | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleMemberClick = (member: TeamMemberData) => {
    setScrollPosition(window.scrollY);
    setSelectedMember(member);
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
    // Restore scroll position after modal closes
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] overflow-x-hidden">
      <ChefHero onMemberClick={handleMemberClick} />
      <TeamMembers onMemberClick={handleMemberClick} />
      {selectedMember && (
        <TeamMemberModal 
          member={selectedMember} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}

// Chef Charles Webb Hero Section
function ChefHero({ onMemberClick }: { onMemberClick: (member: TeamMemberData) => void }) {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  // Chef Charles Webb data for modal
  const chefCharles: TeamMemberData = {
    name: 'Chef Charles Webb',
    role: 'Founder / Global Experience Curator',
    image: heroImage,
    bio: 'Charles Webb (born in Chicago, 1970) is an American celebrity chef, entrepreneur, and global culinary storyteller, celebrated for his ability to blend cultural immersion with culinary innovation. As the creator and host of the acclaimed travel and food docuseries #ChefOnTour with Charles Webb, he has captivated audiences around the world by turning every destination into a sensory exploration of taste, culture, and connection.\n\nWith over three decades of experience in kitchens and markets across five continents, Chef Charles has cooked in some of the world\'s most prestigious settings — from private villas along the Amalfi Coast to vibrant street kitchens in Rio de Janeiro. His journey through 17 countries has shaped not just his palate, but his philosophy: that food is the purest form of storytelling.\n\nVoted #1 Private Chef in Chicago, Chef Charles Webb is more than a chef — he\'s an experience curator. His cuisine is a reflection of his travels, relationships, and the cultures that have inspired him. Whether preparing a private dinner for an intimate gathering or leading his culinary team for a grand event, he approaches every plate as a narrative — one that celebrates craftsmanship, authenticity, and connection.\n\nThrough his celebrated docuseries #ChefOnTour, Chef Charles invites audiences to follow him on his global adventures, where he collaborates with local chefs, artisans, and producers to uncover the heart of each region\'s culinary identity. Each episode captures his passion for exploration — the stories behind the flavors, the people who create them, and the traditions that define them.',
    qa: [
      { question: 'Signature cooking style?', answer: 'Fusion of classical French techniques with global flavors' },
      { question: 'Most memorable culinary experience?', answer: 'Learning ancient cooking methods in rural Oaxaca, Mexico' },
      { question: 'Philosophy on food and travel?', answer: 'Food is the universal language that connects cultures' },
      { question: 'Favorite ingredient?', answer: 'Fresh herbs - they transform every dish' }
    ],
    galleryImages: [
      charlesGallery1,
      charlesGallery2,
      charlesGallery3,
      charlesGallery4,
      charlesGallery5,
      charlesGallery6,
      charlesGallery7,
      charlesGallery8
    ]
  };

  return (
    <section 
      ref={ref} 
      className="bg-[#F4F1EA] px-4 pb-16 pt-32 sm:pb-24 sm:pt-40 md:pt-48"
    >
      <div className="mx-auto max-w-7xl">
        {/* "Meet Our Team" Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl italic"
        >
          Chef Charles &amp; Co
        </motion.h1>

        {/* Two Column Layout: Image + Content */}
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-24 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="overflow-hidden rounded-lg">
              <img
                src={heroImage}
                alt="Chef Charles Webb"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl italic text-[#C89B7B]">
              Chef Charles Webb
            </h2>
            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-tight">
              Founder / Global<br />Experience Curator
            </h3>
            <p className="font-sans text-lg leading-relaxed text-[#111111]">
              Charles Webb (born in Chicago, 1970) is an American celebrity chef, entrepreneur, and global culinary storyteller, celebrated for his ability to blend cultural immersion with culinary innovation. As the creator and host of the acclaimed travel and food docuseries #ChefOnTour with Charles Webb, he has captivated audiences around the world. His unique approach combines haute cuisine with authentic local experiences, creating transformative journeys that go far beyond traditional food tourism. With over 25 years of culinary expertise and a passion for cultural exploration, Chef Webb has established himself as a pioneer in experiential travel.
            </p>
            <button 
              onClick={() => onMemberClick(chefCharles)}
              className="bg-[#C89B7B] px-8 py-3 font-sans text-sm uppercase tracking-wider text-white transition-all hover:bg-[#C89B7B]/90"
            >
              Meet Charles
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Team Members Section
function TeamMembers({ onMemberClick }: { onMemberClick: (member: TeamMemberData) => void }) {
  return (
    <div className="bg-[#F4F1EA]">
      <GlobalExperienceCurators onMemberClick={onMemberClick} />
      <ProductionTeam onMemberClick={onMemberClick} />
      <Advisors onMemberClick={onMemberClick} />
    </div>
  );
}

// Global Experience Curators Section
function GlobalExperienceCurators({ onMemberClick }: { onMemberClick: (member: TeamMemberData) => void }) {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  const curators: TeamMemberData[] = [
    {
      name: 'Gonzalo Gil Lavedra',
      role: 'Global Experience Curator',
      image: gonzaloImage
    },
    {
      name: 'Anjalina Chugani',
      role: 'Global Experience Curator',
      image: anjalinaImage,
      bio: 'I am a passionate cook deeply connected to my Indian roots. Having lived in London, Bangalore, Manila, and now Barcelona, travel has shaped both my life and my cooking. Growing up in an Indian family, my connection to culture came through food, inspired by the aromas and flavours of my mother\'s and grandmother\'s kitchens—memories I love to share.\n\nAfter studying at Hofmann Culinary School, I began teaching Indian cuisine, hosting private events, and working with restaurants to develop spice-based recipes. This led to my first cookbook, Soul Spices, a journey through my childhood and my life in Barcelona, highlighting spices not only for flavour but for their health benefits.\n\nA personal search for better health led me back to Ayurveda—wisdom that had always surrounded me growing up. Remedies I once took as a child, like turmeric milk, revealed themselves as part of this ancient science of life, benefiting both body and mind.\n\nI am now a certified Ayurveda Diet and Lifestyle consultant, developing recipes, teaching, and offering private consultations. Thank you for joining me on this journey—keep learning and never look back.',
      qa: [
        { question: 'Favorite spice?', answer: 'Turmeric - for its healing properties and vibrant color' },
        { question: 'Most memorable meal?', answer: 'My grandmother\'s dal and rice in Bangalore' },
        { question: 'Cooking philosophy?', answer: 'Food is medicine, medicine is food' },
        { question: 'Dream destination?', answer: 'Kerala, India - the land of spices' }
      ],
      galleryImages: [
        anjalinaGallery1,
        anjalinaGallery2,
        anjalinaGallery3,
        anjalinaGallery4
      ]
    },
    {
      name: 'Andre\'s Hoyos',
      role: 'Global Experience Curator',
      image: andresImage,
      bio: 'Meet Chef Andrés Hoyos —a Colombian-Spanish chef who\'s been stirring pots and breaking rules for more than 26 years. His story starts like all great ones: with obsession. What began as childhood curiosity turned into a lifelong love affair with food, travel, and creating unforgettable moments around the table.\n\nHe trained in Colombia\'s top hospitality schools, leveled up in Spain, and worked in some of the most insane kitchens on the planet —like Mugaritz (2 Michelin stars) and Quique Dacosta (3 Michelin stars)— where he learned that perfection is cool, but personality tastes better.\n\nHe\'s cooked alongside legends like Andoni Luis Aduriz, Martín Berasategui, Juan Mari Arzak, and Mario Sandoval —and still believes the best dish is the one that makes people smile.\n\nIn Colombia, he ran the show as Executive Chef at VERA (Cartagena), one of Condé Nast Traveler\'s best new hotels, taught creativity workshops at the National University, and later founded El Sultán Group, one of the country\'s most powerful restaurant collectives —28 restaurants, 9 brands, and way too many stories to tell.\n\nNow based in Miami, Andrés is rewriting the catering playbook with A·H Exclusive Catering —a private dining concept where haute cuisine meets fun, where every plate has a pulse, and every event feels like a story worth remembering.\n\nHere, there are no boring menus or stiff formality. Just bold food, good vibes, and unforgettable flavor.',
      qa: [
        { question: 'Best city to eat in?', answer: 'I don\'t have a favorite city to eat in — I love the cuisines of the world.' },
        { question: 'Country that continues to inspire you?', answer: 'Right now, I\'m really inspired by the cuisine of Asian cultures.' },
        { question: 'Favorite charity/ foundation?', answer: 'For more than 14 years, I\'ve supported several foundations with a social mission to help low-income families in Colombia. One of them is called Fundación Granitos de Paz, where they develop urban farming projects using 100% organic methods.' },
        { question: 'Go to music?', answer: 'I love music — if I hadn\'t become a chef, I would\'ve loved to be a musician. I consider myself a true melomaniac!' }
      ]
    },
    {
      name: 'Morgan Doetsch',
      role: 'Global Experience Curator',
      image: morganImage,
      bio: 'Rooted in whole foods, lean proteins, and fiber-rich cooking, I believe healthy eating should feel exciting—not restrictive. To me, food is fuel, connection, and joy, and I\'ve always seen cooking for others as my love language. Through my work as a certified holistic nutritionist, I aim to show that nourishing your body can also be flavorful, creative, and deeply satisfying.',
      qa: [
        { question: 'Best city to eat in?', answer: 'Tokyo' },
        { question: 'Country that continues to inspire you?', answer: 'Japan' },
        { question: 'Favorite charity/ foundation?', answer: 'Feeding America' },
        { question: 'Go to music?', answer: 'Acoustic soul' }
      ],
      galleryImages: [
        morganGallery1,
        morganGallery2,
        morganGallery3,
        morganGallery4
      ]
    },
    {
      name: 'Matan Amira',
      role: 'Global Experience Curator',
      image: matanImage,
      bio: 'Hi my name is Matan Amira.\n\nI was born in Herzlya, Israel.\n\nI started to cook professionally after serving in the army for 4 years. I\'ve worked at "Herbert Samuel" in the Ritz Carlton Israel, i passed all the lines for four years and worked as Sou chef for one more year.\n\nIn my last position i worked as the chef of "Sereia Loung & restaurant" in the Kempinski hotel TLV.\n\nToday im chef de partie in "L\'epoque" by Robushon group wich will be open soon in Tel Aviv.\n\nAs an Israeli i am very conected to midel eastern food and specially working with fish and seafood.\n\nI love to work with new products and research them to understand how i can fit them to the middle Eastern food.\n\nI love my profession and I\'m very happy that i can learn new things every day to make someone smile.',
      qa: [
        { question: 'Best city to eat in?', answer: 'Tel Aviv' },
        { question: 'Country that continues to inspire you?', answer: 'Israel' },
        { question: 'Favorite charity/ foundation?', answer: 'Leket Israel' },
        { question: 'Go to music?', answer: 'Mediterranean beats' }
      ]
    }
  ];

  return (
    <section ref={ref} className="px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-16 text-center">
            <h2 className="mb-2 font-serif text-5xl sm:text-6xl md:text-7xl italic text-[#111111]/70">
              Other
            </h2>
            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl">
              Global Experience Curators
            </h3>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {curators.map((member, index) => (
              <TeamMemberCard key={member.name} member={member} index={index} onMemberClick={onMemberClick} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Production Team Section
function ProductionTeam({ onMemberClick }: { onMemberClick: (member: TeamMemberData) => void }) {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  const team: TeamMemberData[] = [
    {
      name: 'Fredric Keith',
      role: 'Creative Director',
      image: fredricImage,
      bio: 'Photographer: Fredric Keith Reshew is an award-winning photographer, filmmaker, and creative director based in Stockholm. Having lived in L.A., New York, London, Paris, and Milan, he brings a global flair to his work. His films have screened at over 50 international festivals and streamed on Hulu and DirecTV, while his photography has appeared in Vogue, The New York Times Magazine, and British GQ. He\'s collaborated with brands like Apple and Levi\'s and icons like Kanye West, Kim Kardashian, and Daft Punk — all fueled by equal parts vision, caffeine, and chaos.',
      qa: [
        { question: 'Best city to eat in?', answer: 'NYC' },
        { question: 'Country that continues to inspire you?', answer: 'Italy' },
        { question: 'Favorite charity/ foundation?', answer: 'The Salvation Army' },
        { question: 'Go to music?', answer: 'The verve' }
      ]
    },
    {
      name: 'Ryan Hutton',
      role: 'Cinematographer',
      image: ryanImage,
      bio: 'Ryan has over 20 years of experience in videography and editing, with his specialties primarily being in travel, live events and real estate video production. While at Western Colorado University, Ryan first began doing video production and continued on to help create a digital travel series for Charles Webb\'s #Chefontour docuseries. Ryan is an avid traveler, having been to every continent, except Antarctica. While backpacking in different countries, he enjoys learning different cultures surfing, snowboarding, and creating travel videos of these adventures.\n\nWhile attending Western Colorado University, Ryan initially ventured into video production and later collaborated with Charles Webb to help create a digital travel series for the #Chefontour docuseries.',
      qa: [
        { question: 'Best city to eat in?', answer: 'Bangkok' },
        { question: 'Country that continues to inspire you?', answer: 'New Zealand' },
        { question: 'Favorite charity/ foundation?', answer: 'World Wildlife Fund' },
        { question: 'Go to music?', answer: 'Indie electronic' }
      ]
    },
    {
      name: 'Joe Alvarez',
      role: 'Cinematographer',
      image: joeImage,
      bio: 'Joe Alvarez is a talented cinematographer with a passion for capturing authentic moments and telling compelling visual stories through his lens.',
      qa: [
        { question: 'Best city to eat in?', answer: 'I will say the best city to eat for me is lima peru. Súper fresh and local products.' },
        { question: 'Country that continues to inspire you?', answer: 'Country that continues to inspire me i will say Spain, the culture, the food, the people, the nature is amazing.' },
        { question: 'Favorite charity/ foundation?', answer: 'I will say Club Kiwanis in Panamá they help childrens and familys in needs organizing diferent sport events to collect the money .' },
        { question: 'Go to music?', answer: 'I will say funk, soul and jazz like Tommy guerrero my favorite artist.' }
      ]
    }
  ];

  return (
    <section ref={ref} className="bg-white px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-16 text-center">
            <h2 className="mb-2 font-serif text-5xl sm:text-6xl md:text-7xl italic text-[#111111]/70">
              Our
            </h2>
            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl">
              Production Team
            </h3>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <TeamMemberCard key={member.name} member={member} index={index} onMemberClick={onMemberClick} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Advisors Section
function Advisors({ onMemberClick }: { onMemberClick: (member: TeamMemberData) => void }) {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  const advisors: TeamMemberData[] = [
    {
      name: 'Torsten Edens',
      role: 'Advisor',
      image: torstenImage,
      bio: 'Torsten Edens (born in Jersey City, sometime in the groovy 1960s) is a Danish-American travel professional with more than thirty five years of globe-trotting under his belt — and probably a lifetime\'s worth of frequent flyer miles which he never collected. He\'s best known for crafting immersive travel experiences across the four continents he\'s called home (and a few he\'s just flirted with).\n\nFrom sipping tea in the mountain villages of Nepal and Switzerland to getting lost (on purpose) in the deserts of Egypt and Morocco, and from dodging scooters in the jungles of Myanmar, Laos, and Vietnam to navigating the urban jungles of New York, Bangkok, and Copenhagen — Torsten has turned travel into an art form.\n\nHaving explored 68 countries, resided in 18 (and counting), he\'s developed a knack for finding those "wait, this can\'t be real" moments the rest of us only see on postcards. When not off somewhere discovering new corners of our wonderfully weird planet, he can be found on a small Danish island — plotting his next escape.',
      qa: [
        { question: 'Best city to eat in?', answer: 'Definitely Hanoi, the extensive use of fresh herbs blows my mind every time.' },
        { question: 'Country that continues to inspire you?', answer: 'Sri Lanka ! They are always pulling themselves out of crisis, From Civil war, Bombings and death squads to state bankruptcy, however within 2 years the people will rebound and continue to welcome visitors' },
        { question: 'Favorite charity/ foundation?', answer: 'KOTO, Know One Teach one in Hanoi Vietnam https://www.jimmyphamam.com/koto' },
        { question: 'Go to music?', answer: 'Cesaria Evora, the singing grandmother from Cap Verde.' }
      ]
    },
    {
      name: 'Umi McGuckin',
      role: 'Advisor',
      image: umiImage,
      bio: 'Visionary marketing and technology leader with 20 years of experience across the global entertainment industry. Co-founder of SohoMuse, a New York-based online media hub, and instrumental in designing and developing the online presence for the band Ja. Known for bridging creativity with innovation, with a deep passion for philanthropy, art, and classic cars—currently overseeing one of the world\'s largest private collections.',
      qa: [
        { question: 'Best city to eat in?', answer: 'Tokyo' },
        { question: 'Country that continues to inspire you?', answer: 'Italy' },
        { question: 'Favorite charity/ foundation?', answer: 'Make a wish foundation' },
        { question: 'Go to music?', answer: 'Jamiroquai/ classical/ opera music' }
      ],
      galleryImages: [
        umiGallery1
      ]
    },
    {
      name: 'Marc Harrison',
      role: 'Advisor',
      image: marcImage,
      bio: 'A lifelong traveler with a serious appetite for discovery (…and great food!), Marc has spent over two decades weaving together his professional life with his personal love of travel and connection to cultures the world over. From late-night street eats in Buenos Aires to his favorite cevicherias in Lima, he believes food is the most delicious way to understand a place and its people.\n\nMarc\'s career spans 20 years across global travel brands, tech platforms, and boutique DMCs, where he\'s helped build bridges between creativity and commerce. He loves collaborating with passionate creators – chefs, artists, and storytellers – to turn travel into something unforgettable.\n\nWhen he\'s not brainstorming new ways to elevate the travel experience, you\'ll probably find him chasing sunsets, kitesurfing somewhere windy, or cooking up ideas for his next adventure.',
      qa: [
        { question: 'Best city to eat in?', answer: 'Lima' },
        { question: 'Country that continues to inspire you?', answer: '⁠Italy' },
        { question: 'Favorite charity/ foundation?', answer: 'Loaves & Fishes (Austin, TX)' },
        { question: 'Go to music?', answer: 'Keinmusik (or Afro House, in general)' }
      ]
    },
    {
      name: 'Wilson Fong',
      role: 'Advisor',
      image: wilsonImage,
      bio: 'Wilson helps founders and brands grow with clarity and purpose. A strategist and early-stage investor, he\'s partnered with companies like Nike and Dior while backing ventures that connect people across borders. Originally from Vancouver, he spent years traveling solo through four continents before building businesses in New York and beyond. Now based in Florida with his family.',
      qa: [
        { question: 'Best city to eat in?', answer: 'Depends who\'s asking, for me, it\'s any city where I can actually eat without rewriting the menu. Probably Tokyo or Barcelona. Both care about ingredients and balance more than excess.' },
        { question: 'Country that continues to inspire you?', answer: 'Spain and Morocco. They face each other like mirrors, one refined, one raw, both devoted to beauty and ritual. Moving between them reminds me how culture can flow without borders.' },
        { question: 'Favorite charity/ foundation?', answer: 'Direct Relief. I admire how disciplined and transparent they are. Almost every dollar goes straight to the cause, and their logistics are run with the precision of a top company. It\'s proof that compassion and operational excellence can coexist.' },
        { question: 'Go to music?', answer: 'Balearic.' }
      ]
    },
    {
      name: 'Janie Strauss',
      role: 'Advisor',
      image: janieImage
    },
    {
      name: 'JL Pastor',
      role: 'Advisor',
      image: jlPastorImage,
      bio: 'A global creative with a deep belief in the power of stories, JL Pastor has spent over two decades shaping narrative strategies at the intersection of travel, culture, and communication. Born in Peru and raised across continents — from Africa to Southeast Asia to Europe — he\'s built a career out of connecting worlds through storytelling.\n\nAfter starting in the corporate world, he launched a multi-country travel operations firm and later developed award-winning digital content projects that blended strategy, creativity, and cultural depth. Over the years, he\'s produced original formats and campaigns for networks, destinations, and creative teams across Latin America, the U.S., Europe, and the Middle East — always with one goal: to bring people closer through stories that resonate.\n\nWhen not developing transmedia projects or helping brands grow through narrative, JL is most at home in old bookstores, sketching ideas in a travel notebook, or chasing meaningful conversations somewhere new.',
      qa: [
        { question: 'Best city to eat in?', answer: 'Lima' },
        { question: 'Country that continues to inspire you?', answer: 'Portugal' },
        { question: 'Favorite charity/foundation?', answer: 'Un Techo para mi País (Peru)' },
        { question: 'Go to music?', answer: 'Global Eclectic (Afro House, Indie, Electro-Latin)' }
      ],
      galleryImages: [
        jlPastorGallery1
      ]
    }
  ];

  return (
    <section ref={ref} className="bg-[#F4F1EA] px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-16 text-center">
            <h2 className="mb-2 font-serif text-5xl sm:text-6xl md:text-7xl italic text-[#111111]/70">
              Our
            </h2>
            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl">
              Advisors
            </h3>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {advisors.map((member, index) => (
              <TeamMemberCard key={member.name} member={member} index={index} onMemberClick={onMemberClick} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface TeamMemberData {
  name: string;
  role: string;
  image: string;
  bio?: string;
  qa?: { question: string; answer: string }[];
  galleryImages?: string[];
}

function TeamMemberCard({ member, index, onMemberClick }: { member: TeamMemberData; index: number; onMemberClick: (member: TeamMemberData) => void }) {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  
  // Extract first name for the "Meet [FirstName]" button
  const firstName = member.name.split(' ')[0];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={() => onMemberClick(member)}
    >
      {/* Container with hover effect */}
      <div className="relative overflow-hidden rounded-lg border-2 border-transparent transition-all duration-300 hover:border-[#C89B7B] hover:shadow-xl">
        {/* Image with overlay */}
        <div className="relative mb-6 overflow-hidden">
          <ImageWithFallback
            src={member.image}
            alt={member.name}
            className="aspect-square w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-50"
          />
          
          {/* "Meet [FirstName]" overlay - appears on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="text-center">
              <span className="font-serif text-3xl md:text-4xl text-white">
                Meet {firstName}
              </span>
            </div>
          </div>
        </div>
        
        {/* Text content */}
        <div className="px-4 pb-4 text-left">
          <p className="mb-2 font-sans text-sm uppercase tracking-wider text-[#111111]/60">
            {member.role}
          </p>
          <h3 className="mb-4 font-serif text-3xl md:text-4xl leading-tight transition-colors group-hover:text-[#C89B7B]">
            {member.name}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}

// Team Member Modal
function TeamMemberModal({ member, onClose }: { member: TeamMemberData; onClose: () => void }) {
  const firstName = member.name.split(' ')[0];
  const [currentPrimaryImage, setCurrentPrimaryImage] = useState(member.image);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);
  
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  // Default content based on the image example
  const bio = member.bio || `Futhañez ${member.name} is an Argentine culinary scout, gourmand, and poet who believes travel should take you deeper than the guidebook promises. Known for his unassuming charm, curiosity, and ability to talk his way into and out of just about anything, he's become a fixture in the world of deep culinary travel. His philosophy is simple: when we break away from what's expected of us, inner truth comes to light. In travel as in life, it's up to us to decide how deep we want to go. This approach has built him an extraordinary career bridging cultures through food. He's led immersive culinary journeys throughout Latin America, Asia, and Europe.`;
  
  const qa = member.qa || [
    { question: 'Best city to eat in?', answer: 'Istanbul' },
    { question: 'Country that continues to inspire you?', answer: 'Ukraine' },
    { question: 'Favorite charity/ foundation?', answer: 'Fundación Rewilding Argentina' },
    { question: 'Go to music?', answer: 'Paco Ibañez' }
  ];
  
  const galleryImages = member.galleryImages || [
    'https://images.unsplash.com/photo-1616002411355-49593fd89721?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBvdXRkb29yJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY4MDM5MDkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1658921034679-0d9e999ddc43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjgwNDg1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1570365473297-4a454f76ff0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwbWFya2V0JTIwdHJhdmVsfGVufDF8fHx8MTc2ODA0ODU3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1480951759438-f39a376462f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWxpbmFyeSUyMGFkdmVudHVyZXxlbnwxfHx8fDE3NjgwNDg1Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-[1400px] bg-[#F4F1EA] shadow-2xl flex flex-col h-full sm:h-[90vh] sm:max-h-[900px] sm:rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className="absolute right-4 top-4 sm:right-6 sm:top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#111111] transition-all hover:bg-white hover:scale-110"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          <div className="p-6 sm:p-8 md:p-12 lg:p-16">
            {/* Title */}
            <h2 className="mb-8 sm:mb-10 md:mb-12 text-center font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl italic text-[#111111]">
              {member.role}
            </h2>

            {/* Responsive Layout - Stacked on mobile, side-by-side on desktop */}
            <div className="grid gap-8 sm:gap-10 md:gap-12 lg:gap-16 grid-cols-1 md:grid-cols-[380px_1fr] lg:grid-cols-[430px_1fr]">
              {/* Left: Images Column */}
              <div className="space-y-4">
                {/* Main large portrait with gallery images positioned at bottom on mobile, below on desktop */}
                <div className="relative w-full">
                  <ImageWithFallback
                    src={currentPrimaryImage}
                    alt={member.name}
                    className="w-full aspect-[3/4] object-cover"
                  />
                  
                  {/* Gallery Images - Positioned absolutely at bottom on mobile, below image on desktop/tablet */}
                  <div className="absolute bottom-4 left-4 right-4 md:relative md:bottom-auto md:left-auto md:right-auto md:mt-4 grid grid-cols-4 gap-2 md:gap-3">
                    {galleryImages.map((img, index) => (
                      <div 
                        key={index} 
                        className="aspect-square overflow-hidden cursor-pointer border-2 border-white bg-white"
                        onMouseEnter={() => setCurrentPrimaryImage(img)}
                        onMouseLeave={() => setCurrentPrimaryImage(member.image)}
                        onClick={() => setCurrentPrimaryImage(img)}
                      >
                        <ImageWithFallback
                          src={img}
                          alt={`${member.name} - Photo ${index + 1}`}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Content Column */}
              <div className="space-y-5 sm:space-y-6">
                {/* Name */}
                <h3 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#C89B7B] leading-tight">
                  {member.name}
                </h3>
                
                {/* Bio */}
                <div className="font-sans text-base md:text-lg leading-relaxed text-[#111111] whitespace-pre-line">
                  {bio}
                </div>

                {/* Q&A Section */}
                <div className="pt-4">
                  <h4 className="mb-5 font-serif text-2xl md:text-3xl italic text-[#111111]">
                    Some interesting things about {firstName}...
                  </h4>
                  
                  <div className="space-y-4">
                    {qa.map((item, index) => (
                      <div key={index}>
                        <p className="font-sans text-base text-[#111111] font-medium">
                          Q- {item.question}
                        </p>
                        <p className="mt-1 font-sans text-base text-[#111111]">
                          A- {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Join Team Section
function JoinTeam() {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  return (
    <section ref={ref} className="bg-white px-4 py-32">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <h2 className="mb-8 font-serif text-5xl md:text-6xl" style={{ fontStyle: 'italic' }}>
            Join Our Team
          </h2>
          <p className="mb-12 font-sans text-xl leading-relaxed text-[#111111]">
            We're always looking for passionate guides, coordinators, and culinary experts who share our vision of transformative travel. If you believe food can change the way we see the world, we'd love to hear from you.
          </p>
          <motion.a
            href="mailto:careers@chefontour.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-[#111111] px-12 py-4 font-sans text-lg uppercase tracking-wider text-[#F4F1EA] transition-all hover:bg-[#111111]/90"
          >
            <Mail className="h-5 w-5" />
            <span>GET IN TOUCH</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
/**
 * Ian Arts — Studio Kimemia Artwork Catalog & Curated Exhibition Data
 * Artist: Ian Kimemia (@ian._arts)
 */

const ARTWORKS = [
  {
    id: "tupac-shakur",
    title: "2Pac: Immortal Soul",
    subtitle: "Fine Art Charcoal & Graphite Realism",
    category: "drawings",
    badge: "BEST SELLER",
    isOriginalAvailable: true,
    rating: 5.0,
    reviewCount: 34,
    basePrice: 79.00,
    originalPrice: 3800.00,
    images: {
      mockup: "assets/mockups/tupac-shakur-mockup.jpg",
      artwork: "assets/artworks/tupac-shakur.jpg",
      detail: "assets/artworks/tupac-shakur-detail.jpg"
    },
    aspect: "1.3",
    dimensions: "30\" × 40\" Original (Custom Print Sizes Available)",
    medium: "Charcoal, Carbon & Graphite on 310gsm Hahnemühle 100% Cotton Rag",
    year: "2024",
    location: "Studio Kimemia, Nairobi / Worldwide",
    description: "A tour-de-force in photorealistic drawing. Every crease in the iconic white bandana, the subtle glistening metallic chain, and the soul-stirring intensity in the eyes were rendered over hundreds of hours of painstaking manual charcoal shading. Each museum-grade print is reproduced using 12-color archival pigment inks guaranteed to resist fading for over 100 years.",
    curatorNotes: "Captures the poetic vulnerability and cultural majesty of Tupac Amaru Shakur. One of Ian Kimemia's most recognized and celebrated master drawings."
  },
  {
    id: "bob-marley",
    title: "Redemption: Bob Marley",
    subtitle: "Original Charcoal Portrait with Artist Signature",
    category: "drawings",
    badge: "COLLECTOR FAVORITE",
    isOriginalAvailable: true,
    rating: 5.0,
    reviewCount: 29,
    basePrice: 79.00,
    originalPrice: 3200.00,
    images: {
      mockup: "assets/mockups/bob-marley-mockup.jpg",
      artwork: "assets/artworks/bob-marley.jpg",
      detail: "assets/artworks/bob-marley-detail.jpg"
    },
    aspect: "1.05",
    dimensions: "24\" × 30\" Original",
    medium: "Vine Charcoal & Willow Carbon on Heavy Archival Bristol Board",
    year: "2024",
    location: "Studio Kimemia, Nairobi / Worldwide",
    description: "Radiating warmth, wisdom, and the revolutionary spirit of reggae music. Ian Kimemia captures Bob Marley's joyful grin, expressive smile lines, and cascading natural dreadlocks with tactile textural contrast. The original artwork features Ian's personal signature in the lower right corner.",
    curatorNotes: "Exemplifies Ian's ability to breathe kinetic life and warmth into monochrome graphite and charcoal."
  },
  {
    id: "michael-jackson",
    title: "Smooth Criminal: Michael Jackson",
    subtitle: "Graphite & Carbon Pencil Realism Portrait",
    category: "drawings",
    badge: "NEW RELEASE",
    isOriginalAvailable: true,
    rating: 4.9,
    reviewCount: 21,
    basePrice: 69.00,
    originalPrice: 2900.00,
    images: {
      mockup: "assets/mockups/michael-jackson-mockup.jpg",
      artwork: "assets/artworks/michael-jackson.jpg",
      detail: "assets/artworks/michael-jackson-detail.jpg"
    },
    aspect: "0.7",
    dimensions: "20\" × 28\" Original",
    medium: "Multi-Grade Graphite (9B to 2H) & Carbon Pencil on Acid-Free Vellum",
    year: "2024",
    location: "Studio Kimemia, Nairobi / Worldwide",
    description: "An evocative study of the King of Pop in his legendary silhouette. Delicate blending highlights the smooth contours of his cheekbones, sharp jawline, and glistening dark curls against the crisp white formal shirt and tie.",
    curatorNotes: "Demonstrates precision tonal control from deep velvet blacks in the tailored suit jacket to translucent skin highlights."
  },
  {
    id: "monkey-d-luffy",
    title: "Gear Five: Straw Hat Luffy",
    subtitle: "Vibrant Acrylic & Ink on Stretched Linen Canvas",
    category: "canvas",
    badge: "STUDIO EXCLUSIVE",
    isOriginalAvailable: true,
    rating: 5.0,
    reviewCount: 42,
    basePrice: 89.00,
    originalPrice: 2400.00,
    images: {
      mockup: "assets/mockups/monkey-d-luffy-mockup.jpg",
      artwork: "assets/artworks/monkey-d-luffy.jpg",
      detail: "assets/artworks/monkey-d-luffy-detail.jpg"
    },
    aspect: "0.71",
    dimensions: "24\" × 36\" Original Canvas",
    medium: "High-Pigment Golden Acrylics, India Ink & Varnish on Stretched Linen",
    year: "2024",
    location: "Studio Kimemia, Nairobi / Worldwide",
    description: "An electrifying contemporary take on the future King of the Pirates. High-contrast cobalt blue sky, textured yellow woven straw hat, and vivid scarlet coat create a powerful focal centerpiece for game rooms, creative offices, and modern art spaces.",
    curatorNotes: "A bold intersection of contemporary anime pop culture and classical easel canvas painting."
  },
  {
    id: "long-afternoon",
    title: "Long Afternoon: Coastal Calm",
    subtitle: "Impressionist Seascape on Stretched Gallery Canvas",
    category: "canvas",
    badge: "ORIGINAL ARTWORK",
    isOriginalAvailable: true,
    rating: 4.9,
    reviewCount: 18,
    basePrice: 79.00,
    originalPrice: 1850.00,
    images: {
      mockup: "assets/mockups/long-afternoon-mockup.jpg",
      artwork: "assets/artworks/long-afternoon.jpg",
      detail: "assets/artworks/long-afternoon-detail.jpg"
    },
    aspect: "0.68",
    dimensions: "24\" × 36\" Stretched Canvas",
    medium: "Layered Heavy-Body Acrylic on Canvas with Satin UV Protective Varnish",
    year: "2024",
    location: "Studio Kimemia, Nairobi / Worldwide",
    description: "A tranquil paradise capturing the gentle swell of turquoise ocean waves, whispering palm fronds, and afternoon clouds sailing across the horizon. Painted with loose, expressive palette and brush strokes that bring peaceful coastal energy indoors.",
    curatorNotes: "Perfect for airy living spaces, coastal residences, and contemporary minimal bedrooms."
  },
  {
    id: "tokyo-drift-gtr",
    title: "Midnight Drift: Apex Spirit",
    subtitle: "Urban Graffiti & Automotive Mixed Media Art",
    category: "contemporary",
    badge: "BEST SELLER",
    isOriginalAvailable: true,
    rating: 5.0,
    reviewCount: 27,
    basePrice: 89.00,
    originalPrice: 2600.00,
    images: {
      mockup: "assets/mockups/tokyo-drift-gtr-mockup.jpg",
      artwork: "assets/artworks/tokyo-drift-gtr.jpg",
      detail: "assets/artworks/tokyo-drift-gtr-detail.jpg"
    },
    aspect: "1.77",
    dimensions: "36\" × 20\" Wide Panorama",
    medium: "Mixed Media, Spray Acrylic & Digital Overpaint on Brushed Metal & Canvas",
    year: "2024",
    location: "Studio Kimemia, Nairobi / Worldwide",
    description: "An adrenaline-fueled homage to JDM racing culture, Japanese automotive styling, and underground street graffiti. Features glowing neon taillights, carbon aero wings, and hyper-dynamic typography against distressed industrial masonry.",
    curatorNotes: "A show-stopping statement artwork with striking contrast and modern street art pedigree."
  }
];

const REVIEWS = [
  {
    id: 1,
    name: "Alex P.",
    location: "New York, USA",
    verified: true,
    stars: 5,
    title: "Quick shipping! Detail is unreal",
    comment: "The 2Pac charcoal portrait arrived safely in a reinforced heavy tube. Unrolling it and framing it took my breath away — the shading in the eyes and the bandana texture looks like a photograph, yet has that unmistakable human soul of charcoal. Ian is a master.",
    artworkId: "tupac-shakur",
    timeAgo: "4 hours ago",
    photo: "assets/mockups/tupac-shakur-mockup.jpg"
  },
  {
    id: 2,
    name: "Marcus K.",
    location: "London, UK",
    verified: true,
    stars: 5,
    title: "Bob Marley framed piece is majestic",
    comment: "Ordered the 24x36 Natural Oak framed print of Bob Marley. The timber frame is solid wood and the print quality on 310gsm cotton rag is museum grade. Ian's signature in the corner makes it feel extra special.",
    artworkId: "bob-marley",
    timeAgo: "1 day ago",
    photo: "assets/mockups/bob-marley-mockup.jpg"
  },
  {
    id: 3,
    name: "Elena Rossi",
    location: "Milan, Italy",
    verified: true,
    stars: 5,
    title: "The King of Pop captured perfectly",
    comment: "Michael Jackson's portrait is so hard to capture without feeling artificial, but Ian captured his exact essence. The graphite transitions and suit texture are phenomenal. Highly recommend!",
    artworkId: "michael-jackson",
    timeAgo: "2 days ago",
    photo: "assets/mockups/michael-jackson-mockup.jpg"
  },
  {
    id: 4,
    name: "Daisuke T.",
    location: "Tokyo, Japan",
    verified: true,
    stars: 5,
    title: "Luffy canvas is the centerpiece of my studio",
    comment: "The contrast between the intense royal blue and the textured straw hat is insane in person. Arrived in Tokyo in pristine condition with the certificate of authenticity.",
    artworkId: "monkey-d-luffy",
    timeAgo: "3 days ago",
    photo: "assets/mockups/monkey-d-luffy-mockup.jpg"
  },
  {
    id: 5,
    name: "Sarah W.",
    location: "Los Angeles, CA",
    verified: true,
    stars: 5,
    title: "Long Afternoon brings peace to my apartment",
    comment: "I hung the Long Afternoon piece right above my sofa. Whenever I sit down after a long day, that ocean blue and palm tree horizon immediately resets my mind. Stunning brushwork.",
    artworkId: "long-afternoon",
    timeAgo: "4 days ago",
    photo: "assets/mockups/long-afternoon-mockup.jpg"
  },
  {
    id: 6,
    name: "Tariq M.",
    location: "Dubai, UAE",
    verified: true,
    stars: 5,
    title: "Apex GTR is pure energy",
    comment: "The colors, the street art tags on the wall, the reflections on the car — everything screams speed and craft. Got it framed in matte black. 10/10.",
    artworkId: "tokyo-drift-gtr",
    timeAgo: "5 days ago",
    photo: "assets/mockups/tokyo-drift-gtr-mockup.jpg"
  }
];

const CURRENCIES = {
  USD: { symbol: "$", rate: 1.0, label: "USD ($)" },
  EUR: { symbol: "€", rate: 0.92, label: "EUR (€)" },
  GBP: { symbol: "£", rate: 0.79, label: "GBP (£)" },
  KES: { symbol: "KSh ", rate: 130.0, label: "KES (KSh)" }
};

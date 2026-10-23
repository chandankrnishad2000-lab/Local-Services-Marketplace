export type ServiceFeature = {
  slug: string;
  icon: string;
  title: string;
  description: string;
  categoryQuery: string;
  heroTitle: string;
  heroSubtitle: string;
  highlights: string[];
  howItWorks: string[];
  faqs: { question: string; answer: string }[];
};

export const serviceFeatures: ServiceFeature[] = [
  {
    slug: "verified-professionals",
    icon: "✓",
    title: "Verified Professionals",
    description: "All local pros are vetted and rated by real users",
    categoryQuery: "Home Care",
    heroTitle: "Work with professionals you can trust",
    heroSubtitle: "Local Services verifies identity, experience, and real customer feedback before providers can take bookings.",
    highlights: [
      "Identity and profile verification",
      "Ratings from completed bookings",
      "Transparent provider profiles",
      "Quality checks for new listings"
    ],
    howItWorks: [
      "Providers submit their profile and service details.",
      "Local Services reviews basic identity and listing information.",
      "Customers rate completed jobs to keep quality high.",
      "Only top-performing pros stay highlighted."
    ],
    faqs: [
      {
        question: "How are providers verified?",
        answer: "We collect profile details and check listing information, then rely on customer feedback to maintain quality."
      },
      {
        question: "Can I see provider experience?",
        answer: "Yes. Profiles include service details, ratings, and customer reviews."
      }
    ]
  },
  {
    slug: "secure-payments",
    icon: "💳",
    title: "Secure Payments",
    description: "Pay safely with encrypted transactions",
    categoryQuery: "Tech",
    heroTitle: "Payments that are fast and protected",
    heroSubtitle: "Local Services keeps payments secure with encryption and trusted transaction handling.",
    highlights: [
      "Encrypted checkout flow",
      "Clear pricing and tips",
      "Secure receipts and records",
      "No hidden payment steps"
    ],
    howItWorks: [
      "Review booking summary and pricing.",
      "Pay securely through our checkout flow.",
      "Receive confirmation and payment status instantly.",
      "Track payment details in your bookings."
    ],
    faqs: [
      {
        question: "Is my card data stored?",
        answer: "No. Payments are handled securely and sensitive details are protected."
      },
      {
        question: "Can I add a tip?",
        answer: "Yes. Tip options are available during checkout."
      }
    ]
  },
  {
    slug: "real-reviews",
    icon: "⭐",
    title: "Real Reviews",
    description: "See honest feedback from other customers",
    categoryQuery: "Wellness",
    heroTitle: "Decide confidently with real reviews",
    heroSubtitle: "Every review comes from a completed booking, so you know the feedback is genuine.",
    highlights: [
      "Verified booking reviews only",
      "Ratings for service quality",
      "Provider response visibility",
      "Trust signals across listings"
    ],
    howItWorks: [
      "Complete a booking with a provider.",
      "Leave a rating and short review.",
      "Reviews appear on the provider’s listing.",
      "Future customers choose with confidence."
    ],
    faqs: [
      {
        question: "Who can leave a review?",
        answer: "Only customers who completed a booking can submit reviews."
      },
      {
        question: "Can providers respond?",
        answer: "Yes. Providers can respond and address feedback."
      }
    ]
  },
  {
    slug: "easy-scheduling",
    icon: "🕐",
    title: "Easy Scheduling",
    description: "Book services at times that work for you",
    categoryQuery: "Events",
    heroTitle: "Scheduling that fits your day",
    heroSubtitle: "Choose dates and times that match your availability, with quick confirmations.",
    highlights: [
      "Simple date selection",
      "Clear booking status",
      "Instant confirmations",
      "Reschedule-friendly flows"
    ],
    howItWorks: [
      "Pick a listing and request a booking.",
      "Choose your preferred time window.",
      "Receive confirmation and status updates.",
      "Manage bookings in one place."
    ],
    faqs: [
      {
        question: "Can I reschedule?",
        answer: "Yes. You can update the booking status and timing as needed."
      },
      {
        question: "Will I get reminders?",
        answer: "Booking details remain visible in your dashboard for quick reference."
      }
    ]
  },
  {
    slug: "mobile-friendly",
    icon: "📱",
    title: "Mobile Friendly",
    description: "Manage bookings on the go",
    categoryQuery: "Education",
    heroTitle: "Local Services works wherever you are",
    heroSubtitle: "The interface is optimized for mobile so you can manage services anytime.",
    highlights: [
      "Responsive layouts",
      "Touch-friendly actions",
      "Quick access to bookings",
      "Fast messaging updates"
    ],
    howItWorks: [
      "Open Local Services on any device.",
      "Review bookings and messages quickly.",
      "Manage listings with a few taps.",
      "Stay updated while on the move."
    ],
    faqs: [
      {
        question: "Does it work on all phones?",
        answer: "Yes. The UI is responsive and works on modern mobile browsers."
      },
      {
        question: "Can I manage bookings on mobile?",
        answer: "Absolutely. All booking actions are mobile-friendly."
      }
    ]
  },
  {
    slug: "buyer-protection",
    icon: "🛡️",
    title: "Buyer Protection",
    description: "We guarantee satisfaction or your money back",
    categoryQuery: "Auto",
    heroTitle: "Peace of mind with every booking",
    heroSubtitle: "Local Services helps resolve issues quickly and fairly to protect customers.",
    highlights: [
      "Clear dispute reporting",
      "Transparent booking history",
      "Responsive admin review",
      "Customer-first resolution"
    ],
    howItWorks: [
      "Report issues directly from your booking.",
      "Our team reviews the case details.",
      "We coordinate with the provider for resolution.",
      "Outcomes are recorded for transparency."
    ],
    faqs: [
      {
        question: "How do I report an issue?",
        answer: "Use the report flow in your booking details or contact support."
      },
      {
        question: "What happens after I report?",
        answer: "An admin reviews the case and follows up with a resolution."
      }
    ]
  }
];

export function getServiceBySlug(slug: string) {
  return serviceFeatures.find((feature) => feature.slug === slug);
}

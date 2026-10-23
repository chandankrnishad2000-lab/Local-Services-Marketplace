import Link from "next/link";
import ListingCard from "@/components/ListingCard";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import EnhancedFooter from "@/components/EnhancedFooter";
import ServicesSection from "@/components/ServicesSection";
import CitiesSection from "@/components/CitiesSection";

const sampleListings = [
  {
    id: "demo-1",
    title: "Premium Home Cleaning",
    category: "Home Care",
    location: "Mumbai, MH",
    durationMinutes: 180,
    priceCents: 49999,
    currency: "inr",
    providerName: "Sparkle Co.",
    rating: 4.9,
    reviewCount: 118
  },
  {
    id: "demo-2",
    title: "Private Math Tutoring",
    category: "Education",
    location: "Bangalore, KA",
    durationMinutes: 60,
    priceCents: 39999,
    currency: "inr",
    providerName: "Elevate Tutors",
    rating: 4.8,
    reviewCount: 76
  },
  {
    id: "demo-3",
    title: "Mobile Auto Detailing",
    category: "Auto",
    location: "Delhi, DL",
    durationMinutes: 120,
    priceCents: 75000,
    currency: "inr",
    providerName: "SeaBreeze Auto",
    rating: 4.7,
    reviewCount: 52
  },
  {
    id: "demo-4",
    title: "Professional Hair Styling",
    category: "Wellness",
    location: "Pune, MH",
    durationMinutes: 90,
    priceCents: 29999,
    currency: "inr",
    providerName: "Salon Bliss",
    rating: 4.9,
    reviewCount: 203
  },
  {
    id: "demo-5",
    title: "Yoga & Fitness Training",
    category: "Wellness",
    location: "Bangalore, KA",
    durationMinutes: 60,
    priceCents: 24999,
    currency: "inr",
    providerName: "FitLife Academy",
    rating: 4.8,
    reviewCount: 145
  },
  {
    id: "demo-6",
    title: "Web Development & Design",
    category: "Tech",
    location: "Hyderabad, TG",
    durationMinutes: 240,
    priceCents: 150000,
    currency: "inr",
    providerName: "CodeCraft Studio",
    rating: 4.9,
    reviewCount: 89
  },
  {
    id: "demo-7",
    title: "Event Planning & Coordination",
    category: "Events",
    location: "Chennai, TN",
    durationMinutes: 480,
    priceCents: 200000,
    currency: "inr",
    providerName: "Elite Events Co.",
    rating: 4.7,
    reviewCount: 67
  },
  {
    id: "demo-8",
    title: "AC Installation & Repair",
    category: "Home Care",
    location: "Kolkata, WB",
    durationMinutes: 120,
    priceCents: 59999,
    currency: "inr",
    providerName: "Cool Comfort Services",
    rating: 4.6,
    reviewCount: 98
  }
];

const faqItems = [
  {
    question: "Is there a service call fee?",
    answer: "No, we don't charge a service call fee. You only pay for the service you book through our platform."
  },
  {
    question: "How do I choose the right professional?",
    answer: "Browse provider profiles, check ratings and reviews from real customers, and compare pricing before booking."
  },
  {
    question: "What if I need to cancel or reschedule?",
    answer: "You can cancel or reschedule your booking from your dashboard. Check the provider's cancellation policy for details."
  },
  {
    question: "Are the professionals verified?",
    answer: "Yes, all professionals on Local Services go through our verification process including identity checks and customer review monitoring."
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept all major credit/debit cards, UPI, net banking, and popular digital wallets through our secure payment system."
  }
];

export default function HomePage() {
  return (
    <div>
      <HeroSection />

      <ServicesSection />

      <FeaturesSection />

      <HowItWorksSection />

      {/* FAQ Section - CoolFix Dark Style */}
      <section style={{
        padding: '100px 0',
        background: 'var(--color-dark)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 70% 30%, rgba(126,179,227,0.05) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}/>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row g-5">
            <div className="col-lg-5">
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
                marginBottom: '16px'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)'
                }}/>
                FAQ
              </span>
              <h2 style={{
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-0.04em',
                lineHeight: 1.1,
                marginTop: '8px'
              }}>
                Frequently<br/>Asked<br/>Questions
              </h2>
              <p style={{
                color: 'rgba(255,255,255,0.45)',
                marginTop: '20px',
                lineHeight: 1.6,
                fontSize: '0.95rem',
                maxWidth: '360px'
              }}>
                Getting your service back on track is easier than you think — just five simple steps and comfort returns.
              </p>
            </div>
            <div className="col-lg-7">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {faqItems.map((faq, idx) => (
                  <details
                    key={idx}
                    style={{
                      borderTop: idx === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                      padding: '0'
                    }}
                  >
                    <summary style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '24px 0',
                      cursor: 'pointer',
                      listStyle: 'none',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}>
                      <span style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <span style={{
                          color: 'rgba(255,255,255,0.25)',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          minWidth: '28px'
                        }}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        {faq.question}
                      </span>
                      <span style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: '1.5px solid rgba(255,255,255,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginLeft: '16px'
                      }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M3 7h8M7 3v8" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </span>
                    </summary>
                    <div style={{
                      padding: '0 0 24px 48px',
                      color: 'rgba(255,255,255,0.45)',
                      fontSize: '0.9rem',
                      lineHeight: 1.7
                    }}>
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Services */}
      <section style={{
        padding: '80px 0',
        background: '#fff'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <span className="eyebrow" style={{ marginBottom: '12px', display: 'inline-flex' }}>
                Popular now
              </span>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                color: 'var(--color-heading)',
                marginTop: '12px'
              }}>
                Explore high-demand services
              </h2>
              <p style={{
                color: 'var(--color-body)',
                marginTop: '8px',
                fontSize: '0.95rem'
              }}>
                These are trending in your area based on booking velocity.
              </p>
            </div>
            <Link href="/listings" className="button outline" style={{ padding: '12px 24px' }}>
              View all →
            </Link>
          </div>
          <div className="listing-grid">
            {sampleListings.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
        </div>
      </section>

      <CitiesSection />

      {/* Pricing Cards */}
      <section style={{
        padding: '80px 0',
        background: 'var(--color-bg-soft)'
      }}>
        <div className="container">
          <div style={{
            textAlign: 'center',
            marginBottom: '48px'
          }}>
            <span className="eyebrow" style={{ marginBottom: '12px', display: 'inline-flex', justifyContent: 'center' }}>
              Plans
            </span>
            <h2 style={{
              fontSize: 'clamp(2rem, 3vw, 2.6rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: 'var(--color-heading)',
              marginTop: '12px'
            }}>
              Choose Your Plan
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {/* Customer Plan */}
            <div style={{
              background: '#fff',
              borderRadius: 'var(--radius-xl)',
              padding: '36px',
              border: '1px solid var(--color-border)',
              transition: 'var(--transition)'
            }}>
              <span style={{
                display: 'inline-block',
                padding: '4px 14px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--color-primary-bg)',
                color: 'var(--color-primary-dark)',
                fontSize: '0.78rem',
                fontWeight: 600,
                marginBottom: '20px'
              }}>
                Free
              </span>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                color: 'var(--color-heading)',
                marginBottom: '8px'
              }}>
                Customer Plan
              </h3>
              <p style={{
                color: 'var(--color-body)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                marginBottom: '24px'
              }}>
                Browse services, book instantly, and review providers for free.
              </p>
              <Link href="/pricing" className="button ghost" style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px'
              }}>
                View pricing
              </Link>
            </div>

            {/* Pro Plan */}
            <div style={{
              background: 'var(--color-dark)',
              borderRadius: 'var(--radius-xl)',
              padding: '36px',
              border: 'none',
              transition: 'var(--transition)'
            }}>
              <span style={{
                display: 'inline-block',
                padding: '4px 14px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--color-primary)',
                color: '#fff',
                fontSize: '0.78rem',
                fontWeight: 600,
                marginBottom: '20px'
              }}>
                Pro
              </span>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '8px'
              }}>
                Local Pro Plan
              </h3>
              <p style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                marginBottom: '24px'
              }}>
                Grow your business with listings, bookings, and customer reviews.
              </p>
              <Link href="/providers/listings/new" className="button primary" style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px'
              }}>
                Become a Local Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <CTASection />
      <EnhancedFooter />
    </div>
  );
}

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { connectDB } = require('../src/config/db');
const User = require('../src/models/User');
const LocalProProfile = require('../src/models/LocalProProfile');
const ServiceListing = require('../src/models/ServiceListing');
const { now } = require('../src/helpers/now');

const providers = [
  { name: 'Sparkle Co.', email: 'sparkle@example.com', companyName: 'Sparkle Co.', phone: '+91 9000000001', location: 'Mumbai, MH' },
  { name: 'Elevate Tutors', email: 'elevate@example.com', companyName: 'Elevate Tutors', phone: '+91 9000000002', location: 'Bangalore, KA' },
  { name: 'SeaBreeze Auto', email: 'seabreeze@example.com', companyName: 'SeaBreeze Auto', phone: '+91 9000000003', location: 'Delhi, DL' },
  { name: 'Salon Bliss', email: 'salonbliss@example.com', companyName: 'Salon Bliss', phone: '+91 9000000004', location: 'Pune, MH' },
  { name: 'FitLife Academy', email: 'fitlife@example.com', companyName: 'FitLife Academy', phone: '+91 9000000005', location: 'Bangalore, KA' },
  { name: 'CodeCraft Studio', email: 'codecraft@example.com', companyName: 'CodeCraft Studio', phone: '+91 9000000006', location: 'Hyderabad, TG' },
  { name: 'Elite Events Co.', email: 'eliteevents@example.com', companyName: 'Elite Events Co.', phone: '+91 9000000007', location: 'Chennai, TN' },
  { name: 'Cool Comfort Services', email: 'coolcomfort@example.com', companyName: 'Cool Comfort Services', phone: '+91 9000000008', location: 'Kolkata, WB' }
];

const listings = [
  { title: 'Premium Home Cleaning', category: 'Home Care', location: 'Mumbai, MH', durationMinutes: 180, priceCents: 49999, currency: 'inr', description: 'Deep cleaning for apartments and homes with eco-friendly products.', serviceArea: 'South Mumbai' },
  { title: 'Private Math Tutoring', category: 'Education', location: 'Bangalore, KA', durationMinutes: 60, priceCents: 39999, currency: 'inr', description: '1:1 tutoring for CBSE and ICSE students. Online or in-person.', serviceArea: 'Indiranagar' },
  { title: 'Mobile Auto Detailing', category: 'Auto', location: 'Delhi, DL', durationMinutes: 120, priceCents: 75000, currency: 'inr', description: 'Interior and exterior detailing at your doorstep.', serviceArea: 'Central Delhi' },
  { title: 'Professional Hair Styling', category: 'Wellness', location: 'Pune, MH', durationMinutes: 90, priceCents: 29999, currency: 'inr', description: 'Event-ready styling with premium products and quick turnaround.', serviceArea: 'Koregaon Park' },
  { title: 'Yoga & Fitness Training', category: 'Wellness', location: 'Bangalore, KA', durationMinutes: 60, priceCents: 24999, currency: 'inr', description: 'Personalized training plans for strength and flexibility.', serviceArea: 'HSR Layout' },
  { title: 'Web Development & Design', category: 'Tech', location: 'Hyderabad, TG', durationMinutes: 240, priceCents: 150000, currency: 'inr', description: 'Modern websites with SEO, analytics, and responsive design.', serviceArea: 'Gachibowli' },
  { title: 'Event Planning & Coordination', category: 'Events', location: 'Chennai, TN', durationMinutes: 480, priceCents: 200000, currency: 'inr', description: 'Full event planning including vendors, decor, and logistics.', serviceArea: 'T Nagar' },
  { title: 'AC Installation & Repair', category: 'Home Care', location: 'Kolkata, WB', durationMinutes: 120, priceCents: 59999, currency: 'inr', description: 'Installation, servicing, and annual maintenance for AC units.', serviceArea: 'Salt Lake' }
];

async function seed() {
  await connectDB();

  const existingListings = await ServiceListing.countDocuments();
  const skipListings = existingListings > 0;

  try {
    const adminEmail = 'admin@localservices.test';
    const adminPasswordHash = await bcrypt.hash('Admin123!', 12);

    await User.findOneAndUpdate(
      { email: adminEmail },
      { name: 'Local Services Admin', passwordHash: adminPasswordHash, role: 'ADMIN', createdAt: now() },
      { upsert: true, new: true }
    );

    console.log('Admin user ensured');

    if (!skipListings) {
      for (let i = 0; i < providers.length; i++) {
        const p = providers[i];
        const passwordHash = await bcrypt.hash('password123', 12);

        let user = await User.findOne({ email: p.email });
        if (!user) {
          user = await User.create({
            name: p.name,
            email: p.email,
            passwordHash,
            role: 'LOCAL_PRO',
            createdAt: now()
          });
        }

        const existingProfile = await LocalProProfile.findOne({ userId: user._id });
        if (!existingProfile) {
          await LocalProProfile.create({
            userId: user._id,
            displayName: p.name,
            companyName: p.companyName,
            phone: p.phone,
            location: p.location,
            createdAt: now()
          });
        }

        const l = listings[i];
        await ServiceListing.create({
          localProId: user._id,
          title: l.title,
          description: l.description,
          category: l.category,
          durationMinutes: l.durationMinutes,
          priceCents: l.priceCents,
          currency: l.currency,
          location: l.location,
          serviceArea: l.serviceArea,
          highlights: ['Verified provider', 'Flexible scheduling', 'Top-rated service'],
          requirements: ['Site access required', 'Advance notice recommended'],
          imageUrl: null,
          status: 'ACTIVE',
          createdAt: now()
        });
      }
    }

    console.log(skipListings
      ? 'Seed complete: admin ensured; listings already exist.'
      : 'Seed complete: inserted sample listings and admin user.'
    );
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();

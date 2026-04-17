import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function main() {
  const passwordHash = await hashPassword("Password123!");

  // Create a test customer user
  const customer = await prisma.user.upsert({
    where: { email: "customer@localpulse.dev" },
    update: {},
    create: {
      name: "John Customer",
      email: "customer@localpulse.dev",
      passwordHash,
      role: "CUSTOMER"
    }
  });
  console.log("Created customer user:", customer.email);

  // Create a test local pro user
  const provider = await prisma.user.upsert({
    where: { email: "provider@localpulse.dev" },
    update: {},
    create: {
      name: "Lena Provider",
      email: "provider@localpulse.dev",
      passwordHash,
      role: "LOCAL_PRO",
      localProProfile: {
        create: {
          displayName: "Lena Provider",
          bio: "Trusted local service provider.",
          location: "Austin, TX"
        }
      }
    }
  });
  console.log("Created local pro user:", provider.email);

  // Create a test admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@localpulse.dev" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@localpulse.dev",
      passwordHash,
      role: "ADMIN"
    }
  });
  console.log("Created admin user:", admin.email);

  // Create a service listing
  await prisma.serviceListing.upsert({
    where: { id: "demo-listing-1" },
    update: {},
    create: {
      id: "demo-listing-1",
      localProId: provider.id,
      title: "Home Cleaning Deluxe",
      description: "Deep clean service with eco-friendly supplies.",
      category: "Home Care",
      location: "Austin, TX",
      serviceArea: "Austin Metro",
      durationMinutes: 180,
      highlights: ["Eco-friendly products", "Background-checked team", "Same-day booking"],
      requirements: ["Access to water", "Pets secured during service"],
      priceCents: 9000,
      status: "ACTIVE"
    }
  });
  console.log("Created sample service listing");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

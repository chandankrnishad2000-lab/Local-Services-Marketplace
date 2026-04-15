import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hashPassword("Password123!");

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

  await prisma.serviceListing.create({
    data: {
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
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Optional: seeds a couple of portfolio items / testimonials so the public
// pages have something real behind them if you later wire the static arrays
// up to the database. Run with `npm run db:seed`.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.testimonial.createMany({
    data: [
      {
        authorName: "Studio Lead, Steal Exotique",
        content: "Delivered exactly what was asked, on time, and communicated clearly throughout.",
        rating: 5,
      },
      {
        authorName: "Studio Lead, Ragdoll A Lucky Block",
        content: "One of the few builders who treats a commission like a real production, not a favor.",
        rating: 5,
      },
    ],
  });
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

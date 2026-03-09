// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting seed...");

  // ล้างข้อมูลเก่า
  await prisma.booking.deleteMany({});
  await prisma.movie.deleteMany({});

  const dummyMovies = Array.from({ length: 2000 }).map((_, i) => ({
    title: `Movie Title ${i}`,
    price: Math.random() * 20 + 10,
    image: `https://picsum.photos/seed/${i}/200/300`,
    showTime: new Date(Date.now() + i * 60000),
  }));

  // แบ่งใส่ทีละ 2,000 เพื่อไม่ให้ SQLite รับตัวแปรเกินขีดจำกัด
  const chunkSize = 2000;
  for (let i = 0; i < dummyMovies.length; i += chunkSize) {
    const chunk = dummyMovies.slice(i, i + chunkSize);
    await prisma.movie.createMany({ data: chunk });
    console.log(`✅ Seeded ${i + chunk.length} movies...`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

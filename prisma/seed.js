const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

async function main() {
  const movies = [
    {
      title: "Avatar: The Way of Water",
      price: 15.0,
      image: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
      showTime: new Date("2024-12-15T18:00:00Z"),
    },
    {
      title: "Oppenheimer",
      price: 14.5,
      image: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      showTime: new Date("2024-12-15T20:00:00Z"),
    },
    {
      title: "Barbie",
      price: 13.5,
      image: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
      showTime: new Date("2024-12-16T14:00:00Z"),
    },
    {
      title: "Dune: Part Two",
      price: 16.0,
      image: "https://image.tmdb.org/t/p/w500/8bBih8spZ8hU0Y0sU7XYrN3oYV1.jpg",
      showTime: new Date("2024-12-16T19:00:00Z"),
    },
    {
      title: "Spider-Man: Across the Spider-Verse",
      price: 12.5,
      image: "https://image.tmdb.org/t/p/w500/8VtB9C9vB769TM62pZpLRGvEfM2.jpg",
      showTime: new Date("2024-12-17T13:00:00Z"),
    },
    {
      title: "The Dark Knight",
      price: 10.0,
      image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDp9QmSbmzXwsORVnS7.jpg",
      showTime: new Date("2024-12-17T21:00:00Z"),
    },
    {
      title: "Inception",
      price: 11.0,
      image: "https://image.tmdb.org/t/p/w500/o0s40vVn47S00m9v9hS2Sxy7v1Y.jpg",
      showTime: new Date("2024-12-18T15:00:00Z"),
    },
    {
      title: "Your Name",
      price: 11.5,
      image: "https://image.tmdb.org/t/p/w500/q719jsmZvkvp73tBn17S3mH9Hls.jpg",
      showTime: new Date("2024-12-18T18:00:00Z"),
    },
    {
      title: "Parasite",
      price: 12.0,
      image: "https://image.tmdb.org/t/p/w500/7IiTTjMvISm6v76qGic9IbrU9Uv.jpg",
      showTime: new Date("2024-12-19T17:00:00Z"),
    },
    {
      title: "Interstellar",
      price: 12.0,
      image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      showTime: new Date("2024-12-19T20:00:00Z"),
    },
    {
      title: "Spirited Away",
      price: 10.5,
      image: "https://image.tmdb.org/t/p/w500/39wmItSslvfw1DG9MTfC9SvyzSf.jpg",
      showTime: new Date("2024-12-20T14:00:00Z"),
    },
    {
      title: "The Matrix",
      price: 10.0,
      image: "https://image.tmdb.org/t/p/w500/f89U3Y9L92LZBvBwSdbpS7S3pXm.jpg",
      showTime: new Date("2024-12-20T21:00:00Z"),
    },
    {
      title: "John Wick: Chapter 4",
      price: 14.0,
      image: "https://image.tmdb.org/t/p/w500/vZloY0Cc8p79vNi69M34S2o3REI.jpg",
      showTime: new Date("2024-12-21T19:00:00Z"),
    },
    {
      title: "Everything Everywhere All At Once",
      price: 13.0,
      image: "https://image.tmdb.org/t/p/w500/rKvCj0a70Xm9Zp09o1Lbvq1oY1X.jpg",
      showTime: new Date("2024-12-21T16:00:00Z"),
    },
    {
      title: "The Godfather",
      price: 9.0,
      image: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enP5Yjs6qG6p57L.jpg",
      showTime: new Date("2024-12-22T19:00:00Z"),
    },
    {
      title: "Avengers: Endgame",
      price: 15.0,
      image: "https://image.tmdb.org/t/p/w500/or06vS3ST0P3RMRoESAD98XA9TV.jpg",
      showTime: new Date("2024-12-22T14:00:00Z"),
    },
  ];

  console.log("--- Start Seeding ---");

  for (const movie of movies) {
    // ใช้ findFirst แทนเพราะ title ไม่ใช่ Unique ใน DB
    const existing = await prisma.movie.findFirst({
      where: { title: movie.title },
    });

    if (!existing) {
      await prisma.movie.create({ data: movie });
      console.log(`✅ Created: ${movie.title}`);
    } else {
      await prisma.movie.update({
        where: { id: existing.id }, // ใช้ id ซึ่งเป็น Unique แน่นอนในการ Update
        data: movie,
      });
      console.log(`🔄 Updated: ${movie.title}`);
    }
  }

  console.log("--- Finished Seeding ---");
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

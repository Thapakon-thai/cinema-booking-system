import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const movies = [
    {
      title: 'Avatar: The Way of Water',
      price: 15.0,
      image: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
      showTime: new Date('2023-12-15T18:00:00Z'),
    },
    {
      title: 'Oppenheimer',
      price: 14.5,
      image: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      showTime: new Date('2023-12-15T20:00:00Z'),
    },
    {
      title: 'Barbie',
      price: 13.5,
      image: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
      showTime: new Date('2023-12-16T14:00:00Z'),
    },
    {
      title: 'Interstellar',
      price: 12.0,
      image: 'https://image.tmdb.org/t/p/w500/gEU2QniL6C8zt79Bn343Tk0n1j.jpg',
      showTime: new Date('2023-12-16T17:00:00Z'),
    },
  ]

  for (const movie of movies) {
    await prisma.movie.create({
      data: movie,
    })
  }

  console.log('Seed data inserted')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

'use server'

import { PrismaClient } from '@prisma/client'
import { unstable_cache, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient({ log: ['query'] })

const getCachedMovies = unstable_cache(
  async () => {
    return await prisma.movie.findMany({
      orderBy: {
        showTime: 'asc',
      },
    })
  },
  ['movies'],
  { tags: ['movies'], revalidate: 60 }
)

export async function getMovies() {
  return getCachedMovies()
}

const getCachedMovie = (id: number) =>
  unstable_cache(
    async () => {
      return await prisma.movie.findUnique({
        where: { id },
        include: {
          bookings: true,
        },
      })
    },
    [`movie-${id}`],
    { tags: [`movie-${id}`], revalidate: 30 }
  )()

export async function getMovie(id: number) {
  return getCachedMovie(id)
}

export async function bookSeats(movieId: number, seats: string[]) {
  if (seats.length === 0) {
    throw new Error('No seats selected')
  }

  await prisma.booking.create({
    data: {
      movieId,
      seats: seats.join(','),
    },
  })

  revalidateTag(`movie-${movieId}`, { expire: 0 })
  redirect(`/?success=true`)
}

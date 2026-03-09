import { PrismaClient } from '@prisma/client'
import { unstable_cache } from 'next/cache'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

const getCachedMovies = unstable_cache(
  async () => {
    console.log('>>> CACHE MISS: Fetching movies from DB')
    return await prisma.movie.findMany({
      orderBy: { showTime: 'asc' },
    })
  },
  ['movies-api'],
  { tags: ['movies'], revalidate: 60 }
)

export async function GET() {
  const movies = await getCachedMovies()
  return NextResponse.json(movies)
}

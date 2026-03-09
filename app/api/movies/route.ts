import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET() {
  console.log('>>> NO CACHE: Fetching movies from DB')
  const movies = await prisma.movie.findMany({
    orderBy: { showTime: 'asc' },
  })
  return NextResponse.json(movies)
}

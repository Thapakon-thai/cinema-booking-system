"use server";

import { PrismaClient } from '@prisma/client'
import { unstable_cache, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient({
  log: [
    { emit: "stdout", level: "query" }, // ให้แสดง Query SQL ออกมา
    { emit: "stdout", level: "info" },
    { emit: "stdout", level: "warn" },
    { emit: "stdout", level: "error" },
  ],
});

// const globalPrisma = globalThis as unknown as { prisma: PrismaClient };
// const prisma = globalPrisma.prisma || new PrismaClient();
// globalPrisma.prisma = prisma;

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
  if (seats.length === 0) return { error: 'No seats selected' }

  await new Promise(resolve => setTimeout(resolve, 3000));
  
  try {
    let ticketId: number;
    const result = await prisma.$transaction(async (tx) => {
      
      const existingBooking = await tx.booking.findMany({
        where: { movieId },
      })
      
      const bookedSeats = existingBooking.flatMap((b) => b.seats.split(','))
      const conflicting = seats.filter((seat) => bookedSeats.includes(seat))
      
      if (conflicting.length > 0) {
        return { error: `ขออภัย ที่นั่ง ${conflicting.join(', ')} ถูกจองไปแล้ว กรุณาเลือกใหม่` }
      }
      
      const newBooking = await tx.booking.create({
        data: {
          movieId,
          seats: seats.join(','),
        },
      })
      
      ticketId = newBooking.id;
      return { success: true }
    })

    if (result && result.error) {
      return result
    }
    
    revalidateTag(`/movie/${movieId}`, { expire: 0 })
    redirect(`/?success=true&seats=${encodeURIComponent(seats.join(', '))}&ticketId=${ticketId!}`)
  } catch (error: any) {
    if (error && typeof error === "object" && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    if (error.code === 'P2024' || error.code === 'P2028' || error.message?.includes('database is locked')) {
      return { error: 'ระบบกำลังยุ่งเนื่องจากมีผู้ใช้งานพร้อมกันจำนวนมาก กรุณาลองกดจองใหม่อีกครั้ง' }
    }
    
    return { error: 'An unexpected error occurred' }; 
  }

}

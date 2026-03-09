'use server'

import { PrismaClient, Prisma} from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const globalPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalPrisma.prisma || new PrismaClient();
globalPrisma.prisma = prisma;

export async function getMovies() {
  return await prisma.movie.findMany({
    orderBy: {
      showTime: 'asc',
    },
  })
}

export async function getMovie(id: number) {
  return await prisma.movie.findUnique({
    where: { id },
    include: {
      bookings: true,
    },
  })
}

export async function bookSeats(movieId: number, seats: string[]) {
  if (seats.length === 0) return { error: 'No seats selected' }

  try {
    let ticketId: number;
    const result = await prisma.$transaction(async (tx) => {

      await new Promise(resolve => setTimeout(resolve, 3000));

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
    
    revalidatePath(`/movie/${movieId}`)
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

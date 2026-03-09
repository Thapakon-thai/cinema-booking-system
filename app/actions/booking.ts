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
    const result = await prisma.$transaction(async (tx) => {
      const existingBooking = await tx.booking.findMany({
        where: { movieId },
      })

      const bookedSeats = existingBooking.flatMap((b) => b.seats.split(','))
      const conflicting = seats.filter((seat) => bookedSeats.includes(seat))
      
      if (conflicting.length > 0) {
        return { error: `ขออภัย ที่นั่ง ${conflicting.join(', ')} ถูกจองไปแล้ว กรุณาเลือกใหม่` }
      }

      await tx.booking.create({
        data: {
          movieId,
          seats: seats.join(','),
        },
      })
      return { success: true }
    })

    if (result && result.error) {
      return result
    }
  } catch (error: any) {
    if (error.code === 'P2024' || error.message.includes('database is locked')) {
      return { error: 'ระบบกำลังยุ่งเนื่องจากมีผู้ใช้งานพร้อมกันจำนวนมาก กรุณาลองกดจองใหม่อีกครั้ง' }
    }
    return { error: 'An unexpected error occurred' }; 
  }

  revalidatePath(`/movie/${movieId}`)
  redirect(`/?success=true`)
}

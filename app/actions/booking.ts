'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

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
  if (seats.length === 0) {
    throw new Error('No seats selected')
  }
  let ticketId: number;

  await new Promise(resolve => setTimeout(resolve, 3000));

  // 1. Create booking (Everyone who clicked within the 3s window gets here)
  const newBooking = await prisma.booking.create({
    data: {
      movieId,
      seats: seats.join(','),
    },
  })
  ticketId = newBooking.id;

  // 2. Check if a race condition just happened
  const allBookings = await prisma.booking.findMany({
    where: { movieId },
  })

  const bookedSeatsArrays = allBookings
    .filter(b => b.id !== newBooking.id)
    .flatMap((b) => b.seats.split(','))
  
  const conflictingSeats = seats.filter((seat) => bookedSeatsArrays.includes(seat))
  
  revalidatePath(`/movie/${movieId}`)
  
  if (conflictingSeats.length > 0) {
    redirect(`/?success=true&raceCondition=true&seats=${encodeURIComponent(seats.join(', '))}&ticketId=${ticketId}`)
  } else {
    redirect(`/?success=true&seats=${encodeURIComponent(seats.join(', '))}&ticketId=${ticketId}`)
  }
}

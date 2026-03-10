"use server";

import { PrismaClient, Prisma} from '@prisma/client'
import { revalidatePath } from 'next/cache'
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

export async function getMovies() {
  // 1. วัดผลการ Query แบบมี Sorting (ถ้าทำ Index ที่ showTime จะเร็วขึ้นมาก)
  console.time("⏱️ getMovies_Duration");
  const movies = await prisma.movie.findMany({
    take: 20, // <--- ดึงมาแค่ 20 อันพอ
    orderBy: {
      showTime: "asc",
    },
  });
  console.timeEnd("⏱️ getMovies_Duration");
  return movies;
}

export async function getMovie(id: number) {
  // 2. วัดผลการดึงข้อมูล Relation (ถ้าทำ Index ที่ Booking.movieId จะเร็วขึ้นมาก)
  console.time(`⏱️ getMovie_with_Bookings_ID_${id}`);
  const movie = await prisma.movie.findUnique({
    where: { id },
    include: {
      bookings: true, // ตรงนี้แหละครับที่ระบบต้องไปสแกนหาในตาราง Booking
    },
  });
  console.timeEnd(`⏱️ getMovie_with_Bookings_ID_${id}`);
  return movie;
}

export async function bookSeats(movieId: number, seats: string[]) {

  if (seats.length === 0) return { error: 'No seats selected' }
  
  try {
    let ticketId: number;
    const result = await prisma.$transaction(async (tx) => {
      
      // วัดผลการ INSERT (Indexing จะทำให้ตรงนี้ช้าลง "เล็กน้อย" เพราะต้องเขียน Index เพิ่ม)
      console.time("⏱️ bookSeats_Insert_Duration");
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
      console.timeEnd("⏱️ bookSeats_Insert_Duration");
      
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

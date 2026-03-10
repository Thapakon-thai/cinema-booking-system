"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const prisma = new PrismaClient({
  log: [
    { emit: "stdout", level: "query" }, // ให้แสดง Query SQL ออกมา
    { emit: "stdout", level: "info" },
    { emit: "stdout", level: "warn" },
    { emit: "stdout", level: "error" },
  ],
});

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
  if (seats.length === 0) {
    throw new Error("No seats selected");
  }
  let ticketId: number;
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // วัดผลการ INSERT (Indexing จะทำให้ตรงนี้ช้าลง "เล็กน้อย" เพราะต้องเขียน Index เพิ่ม)
  console.time("⏱️ bookSeats_Insert_Duration");
  
  // 1. Create booking (Everyone who clicked within the 3s window gets here)
  const newBooking = await prisma.booking.create({
    data: {
      movieId,
      seats: seats.join(","),
    },
  });
  
  console.timeEnd("⏱️ bookSeats_Insert_Duration");

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

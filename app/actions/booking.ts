"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function getMovies() {
  // 1. วัดผลการ Query แบบมี Sorting (ถ้าทำ Index ที่ showTime จะเร็วขึ้นมาก)
  console.time("⏱️ getMovies_Duration");
  const movies = await prisma.movie.findMany({
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

  // วัดผลการ INSERT (Indexing จะทำให้ตรงนี้ช้าลง "เล็กน้อย" เพราะต้องเขียน Index เพิ่ม)
  console.time("⏱️ bookSeats_Insert_Duration");
  await prisma.booking.create({
    data: {
      movieId,
      seats: seats.join(","),
    },
  });
  console.timeEnd("⏱️ bookSeats_Insert_Duration");

  revalidatePath(`/movie/${movieId}`);
  redirect(`/?success=true`);
}

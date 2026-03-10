import { NextResponse } from "next/server";
import { getMovies, getMovie } from "@/app/actions/booking";

export async function GET(request: Request) {
  // ดึง url เพื่อดูว่าเราอยากเทสต์อะไร
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    if (action === "getMovies") {
      // เรียกฟังก์ชันจาก booking.ts โดยตรง (ไม่ต้องเอาข้อมูลไปทำ UI)
      await getMovies();
      return NextResponse.json({
        message: "✅ getMovies executed! Check your terminal.",
      });
    }

    if (action === "getMovie") {
      // สมมติว่าดึงหนัง ID 1
      await getMovie(1);
      return NextResponse.json({
        message: "✅ getMovie executed! Check your terminal.",
      });
    }

    return NextResponse.json({
      message: "ระบุ ?action=getMovies หรือ ?action=getMovie ใน URL",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

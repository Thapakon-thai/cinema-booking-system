import * as fs from 'fs';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

const generate = async () => {
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        text: "ระบบจองตั๋วหนัง (Cinema Seat Booking System)",
                        heading: HeadingLevel.TITLE,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun("เว็บแอปพลิเคชันสำหรับจองตั๋วหนังออนไลน์ พัฒนาโดยใช้ Next.js และ Tailwind CSS"),
                        ],
                        spacing: { after: 200 },
                    }),
                    
                    // Overview
                    new Paragraph({
                        text: "📋 ภาพรวมโปรเจกต์ (Project Overview)",
                        heading: HeadingLevel.HEADING_1,
                        spacing: { before: 200, after: 120 },
                    }),
                    new Paragraph({
                        text: "ระบบนี้ช่วยให้ผู้ใช้สามารถเลือกดูรายการภาพยนตร์ ตรวจสอบรอบฉาย และทำการจองที่นั่งได้แบบ Real-time โดยมีการคำนวณราคาอัตโนมติตามจำนวนที่นั่งที่เลือก",
                        spacing: { after: 200 },
                    }),

                    // Features
                    new Paragraph({
                        text: "ฟีเจอร์หลัก (Key Features)",
                        heading: HeadingLevel.HEADING_2,
                        spacing: { after: 120 },
                    }),
                    new Paragraph({
                        text: "1. หน้าแรก (Home Page)",
                        bullet: { level: 0 },
                    }),
                    new Paragraph({
                        text: "แสดงรายการภาพยนตร์ที่กำลังเข้าฉาย (Now Showing)",
                        bullet: { level: 1 },
                    }),
                    new Paragraph({
                        text: "แสดงโปสเตอร์ ชื่อเรื่อง และราคาตั๋ว",
                        bullet: { level: 1 },
                    }),
                    new Paragraph({
                        text: "เอฟเฟกต์การ์ดแบบ Glassmorphism และ Animation ที่สวยงาม",
                        bullet: { level: 1 },
                    }),
                    new Paragraph({
                        text: "2. หน้าจองที่นั่ง (Booking Page)",
                        bullet: { level: 0 },
                    }),
                    new Paragraph({
                        text: "แผนผังที่นั่งในโรงภาพยนตร์ (Seat Grid)",
                        bullet: { level: 1 },
                    }),
                    new Paragraph({
                        text: "แสดงสถานะที่นั่ง: ⚪ ว่าง, 🔵 ที่เลือก, ⚫ ไม่ว่าง",
                        bullet: { level: 1 },
                    }),
                    new Paragraph({
                        text: "คำนวณราคารวมให้อัตโนมัติตามจำนวนที่นั่งที่เลือก",
                        bullet: { level: 1 },
                    }),
                    new Paragraph({
                        text: "3. ระบบการจอง (Booking System)",
                        bullet: { level: 0 },
                    }),
                     new Paragraph({
                        text: "บันทึกข้อมูลการจองลงฐานข้อมูล",
                        bullet: { level: 1 },
                    }),
                     new Paragraph({
                        text: "ป้องกันการจองซ้ำ",
                        bullet: { level: 1 },
                    }),
                     new Paragraph({
                        text: "แสดงข้อความยืนยันเมื่อจองสำเร็จ",
                        bullet: { level: 1 },
                    }),

                    // Tech Stack
                    new Paragraph({
                        text: "🛠️ เทคโนโลยีที่ใช้ (Tech Stack)",
                        heading: HeadingLevel.HEADING_1,
                        spacing: { before: 200, after: 120 },
                    }),
                     new Paragraph({
                        text: "Frontend Framework: Next.js 16 (App Router)",
                        bullet: { level: 0 },
                    }),
                     new Paragraph({
                        text: "Database: SQLite",
                        bullet: { level: 0 },
                    }),
                     new Paragraph({
                        text: "ORM: Prisma",
                        bullet: { level: 0 },
                    }),
                     new Paragraph({
                        text: "Styling: Tailwind CSS v4",
                        bullet: { level: 0 },
                    }),
                     new Paragraph({
                        text: "Language: TypeScript",
                        bullet: { level: 0 },
                    }),

                    // Installation
                    new Paragraph({
                        text: "🚀 วิธีการติดตั้งและรันโปรเจกต์ (Installation & Setup)",
                        heading: HeadingLevel.HEADING_1,
                        spacing: { before: 200, after: 120 },
                    }),
                    new Paragraph({ text: "1. Clone โปรเจกต์", bullet: { level: 0 } }),
                    new Paragraph({
                        children: [new TextRun({ text: "git clone <repository-url>\ncd cinemabooking", font: "Courier New" })],
                        indent: { left: 720 },
                    }),
                    new Paragraph({ text: "2. ติดตั้ง Dependencies", bullet: { level: 0 } }),
                    new Paragraph({
                        children: [new TextRun({ text: "pnpm install", font: "Courier New" })],
                         indent: { left: 720 },
                    }),
                    new Paragraph({ text: "3. เตรียมฐานข้อมูล", bullet: { level: 0 } }),
                    new Paragraph({
                        children: [new TextRun({ text: "npx prisma migrate dev --name init\nnode prisma/seed.js", font: "Courier New" })],
                         indent: { left: 720 },
                    }),
                    new Paragraph({ text: "4. รันโปรแกรม", bullet: { level: 0 } }),
                    new Paragraph({
                        children: [new TextRun({ text: "pnpm dev", font: "Courier New" })],
                         indent: { left: 720 },
                    }),
                    new Paragraph({ text: "5. เปิดใช้งานที่ http://localhost:3000", bullet: { level: 0 } }),

                    // Manual
                    new Paragraph({
                        text: "📖 คู่มือการใช้งาน (User Manual)",
                        heading: HeadingLevel.HEADING_1,
                        spacing: { before: 200, after: 120 },
                    }),
                     new Paragraph({
                        text: "1. เลือกภาพยนตร์: ที่หน้าแรก คลิกที่การ์ดภาพยนตร์ที่ต้องการดู หรือกดปุ่ม \"Book Seats\"",
                    }),
                     new Paragraph({
                        text: "2. เลือกที่นั่ง: คลิกที่นั่งที่ต้องการ (สีขาว) ที่นั่งจะเปลี่ยนเป็นสีฟ้า และราคารวมจะอัปเดต",
                    }),
                     new Paragraph({
                        text: "3. ยืนยันการจอง: กดปุ่ม \"Confirm Booking\"",
                    }),
                     new Paragraph({
                        text: "4. เสร็จสิ้น: ระบบจะพาจกลับไปหน้าแรกพร้อมข้อความยืนยัน",
                    }),
                ],
            },
        ],
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync("README.docx", buffer);
    console.log("Document created successfully");
};

generate();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const movieId = 1;
  async function test(seats) {
    try {
      await prisma.$transaction(async (tx) => {
        await new Promise(r => setTimeout(r, 1000));
        await tx.booking.create({ data: { movieId, seats } });
      });
      console.log('Success', seats);
    } catch(e) {
      console.log('Error', seats, e.code, e.name, e.message);
    }
  }
  await Promise.all([test('Z10'), test('Z11'), test('Z12')]);
  await prisma.$disconnect();
}
run();

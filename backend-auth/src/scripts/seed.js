import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log('No user found. Please register a user first.');
    return;
  }

  const teamNames = ['Engineering Alpha', 'Design Systems', 'Product Strategy', 'Marketing Hub'];
  
  for (const name of teamNames) {
    // Check if team already exists
    const existing = await prisma.team.findFirst({ where: { name } });
    if (!existing) {
      await prisma.team.create({
        data: {
          name,
          description: 'Auto-generated team',
          createdBy: user.id,
          members: {
            create: {
              userId: user.id,
              role: 'ADMIN'
            }
          }
        }
      });
      console.log(`Team "${name}" created.`);
    } else {
      console.log(`Team "${name}" already exists.`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

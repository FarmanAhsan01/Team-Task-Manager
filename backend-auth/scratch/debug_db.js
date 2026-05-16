import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const tasks = await prisma.task.findMany({
    include: { project: true }
  });
  console.log('Tasks in DB:', JSON.stringify(tasks.map(t => ({
    id: t.id,
    title: t.title,
    status: t.status,
    projectId: t.projectId,
    projectName: t.project?.name
  })), null, 2));

  const projects = await prisma.project.findMany();
  console.log('Projects in DB:', JSON.stringify(projects.map(p => ({
    id: p.id,
    name: p.name
  })), null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());

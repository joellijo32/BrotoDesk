import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@brototype.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@brototype.com',
      studentId: 'ADMIN001',
      passwordHash: adminPassword,
      role: 'ADMIN'
    }
  });

  console.log('✅ Admin user created:');
  console.log('   Email: admin@brototype.com');
  console.log('   Password: admin123');
  console.log('');

  // Create Sample Student User
  const studentPassword = await bcrypt.hash('student123', 10);
  const student = await prisma.user.upsert({
    where: { email: 'student@brototype.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'student@brototype.com',
      studentId: 'BT2025001',
      passwordHash: studentPassword,
      role: 'STUDENT'
    }
  });

  console.log('✅ Sample student created:');
  console.log('   Email: student@brototype.com');
  console.log('   Password: student123');
  console.log('');

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

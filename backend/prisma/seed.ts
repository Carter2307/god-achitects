import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const secretary = await prisma.user.upsert({
    where: { email: 'secretary@parking.com' },
    update: {},
    create: {
      email: 'secretary@parking.com',
      password: hashedPassword,
      firstName: 'Marie',
      lastName: 'Dupont',
      role: Role.SECRETARY,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@parking.com' },
    update: {},
    create: {
      email: 'manager@parking.com',
      password: hashedPassword,
      firstName: 'Jean',
      lastName: 'Martin',
      role: Role.MANAGER,
    },
  });

  const employee = await prisma.user.upsert({
    where: { email: 'employee@parking.com' },
    update: {},
    create: {
      email: 'employee@parking.com',
      password: hashedPassword,
      firstName: 'Pierre',
      lastName: 'Bernard',
      role: Role.EMPLOYEE,
    },
  });

  console.log('Users created:', { secretary, manager, employee });

  // Create parking spots
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const spotsPerRow = 10;

  for (const row of rows) {
    for (let i = 1; i <= spotsPerRow; i++) {
      const spotNumber = `${row}${i.toString().padStart(2, '0')}`;
      const hasElectricCharger = row === 'A' || row === 'F';

      await prisma.parkingSpot.upsert({
        where: { spotNumber },
        update: {},
        create: {
          spotNumber,
          row,
          hasElectricCharger,
          isAvailable: true,
          qrCode: `https://parking.com/checkin/${spotNumber}`,
        },
      });
    }
  }

  console.log('Parking spots created: 60 spots (rows A-F, 10 spots each)');
  console.log('Electric chargers available in rows A and F');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

import { PrismaClient, Role, Statut, SpotStatus, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Début du seeding...');

  // 1. Création des Utilisateurs par défaut
  await prisma.user.upsert({
    where: { email: 'admin@parking.com' },
    update: {},
    create: {
      nom: 'Admin',
      prenom: 'Secretariat',
      email: 'admin@parking.com',
      motDePasse: 'password123',
      role: Role.SECRETAIRE,
      statut: Statut.ACTIF,
    },
  });

  await prisma.user.upsert({
    where: { email: 'manager@parking.com' },
    update: {},
    create: {
      nom: 'Manager',
      prenom: 'Direction',
      email: 'manager@parking.com',
      motDePasse: 'password123',
      role: Role.GESTIONNAIRE,
      statut: Statut.ACTIF,
    },
  });

  // Création d'un employé pour les tests
  const employe = await prisma.user.upsert({
    where: { email: 'employe@parking.com' },
    update: {},
    create: {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'employe@parking.com',
      motDePasse: 'password123',
      role: Role.EMPLOYE,
      statut: Statut.ACTIF,
    },
  });

  console.log(`✅ Employé créé avec l'ID: ${employe.id}`);

  // 2. Création des 60 places de Parking
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  // Correction ici : On définit explicitement le type pour éviter l'erreur "never"
  const spotsData: Prisma.ParkingSpotCreateManyInput[] = [];

  for (const row of rows) {
    for (let i = 1; i <= 10; i++) {
      const numero = `${row}${i.toString().padStart(2, '0')}`;
      
      // Règle du sujet : Les rangées A et F ont des chargeurs
      const hasCharger = row === 'A' || row === 'F';

      spotsData.push({
        numero: numero,
        rangee: row,
        aChargeurElectrique: hasCharger,
        statut: SpotStatus.DISPONIBLE,
        qrCodeUrl: `http://localhost:3000/checkin/${numero}`, 
      });
    }
  }

  // Insertion en base
  await prisma.parkingSpot.createMany({
    data: spotsData,
    skipDuplicates: true,
  });

  console.log(`✅ Succès : 60 places (Rangées A-F) et utilisateurs créés.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
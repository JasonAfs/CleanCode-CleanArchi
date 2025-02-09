import { PrismaClient } from '@prisma/client';
import { MotorcycleModel } from '@prisma/client';
import { VIN } from '../../domain/value-objects/VIN';

const prisma = new PrismaClient();

// Fonction utilitaire pour vérifier et créer une moto avec un VIN valide
async function createMotorcycleWithValidVIN(data: {
  vin: string;
  modelType: MotorcycleModel;
  year: number;
  color: string;
  mileage: number;
  dealershipId: string;
}) {
  try {
    // Vérifie si le VIN est valide en utilisant notre Value Object
    const validVin = VIN.create(data.vin);

    return prisma.motorcycle.create({
      data: {
        ...data,
        vin: validVin.toString(),
      },
    });
  } catch (error) {
    console.error(`Erreur avec la moto ${data.modelType} - VIN: ${data.vin}`);
    throw error;
  }
}

async function main() {
  // Nettoyer la base de données
  await prisma.maintenanceNotification.deleteMany();
  await prisma.maintenance.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.motorcycle.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();
  await prisma.dealership.deleteMany();

  // Créer les concessions
  const dealerships = await Promise.all([
    prisma.dealership.create({
      data: {
        name: 'Triumph Paris Centre',
        street: '123 Avenue des Champs-Élysées',
        city: 'Paris',
        postalCode: '75008',
        country: 'France',
        phone: '+33123456789',
        email: 'contact@triumph-paris.fr',
      },
    }),
    prisma.dealership.create({
      data: {
        name: 'Triumph Lyon',
        street: '456 Rue de la République',
        city: 'Lyon',
        postalCode: '69002',
        country: 'France',
        phone: '+33478901234',
        email: 'contact@triumph-lyon.fr',
      },
    }),
    prisma.dealership.create({
      data: {
        name: 'Triumph Marseille',
        street: '789 Boulevard Michelet',
        city: 'Marseille',
        postalCode: '13008',
        country: 'France',
        phone: '+33491234567',
        email: 'contact@triumph-marseille.fr',
      },
    }),
    prisma.dealership.create({
      data: {
        name: 'Triumph Bordeaux',
        street: '321 Cours de la Marne',
        city: 'Bordeaux',
        postalCode: '33800',
        country: 'France',
        phone: '+33556789012',
        email: 'contact@triumph-bordeaux.fr',
      },
    }),
    prisma.dealership.create({
      data: {
        name: 'Triumph Lille',
        street: '654 Rue Nationale',
        city: 'Lille',
        postalCode: '59000',
        country: 'France',
        phone: '+33320123456',
        email: 'contact@triumph-lille.fr',
      },
    }),
  ]);

  // Création des entreprises
  const companies = await Promise.all([
    // Companies pour Paris Centre
    prisma.company.create({
      data: {
        name: 'Transport Express Paris',
        registrationNumber: 'FR123456789015',
        street: '789 Rue du Commerce',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        phone: '+33123456780',
        email: 'contact@transport-express-paris.fr',
        createdByDealershipId: dealerships[0].id,
      },
    }),
    prisma.company.create({
      data: {
        name: 'Livraison Rapide IDF',
        registrationNumber: 'FR987654321011',
        street: '456 Avenue de la République',
        city: 'Paris',
        postalCode: '75011',
        country: 'France',
        phone: '+33187654321',
        email: 'contact@livraison-rapide-idf.fr',
        createdByDealershipId: dealerships[0].id,
      },
    }),

    // Companies pour Lyon
    prisma.company.create({
      data: {
        name: 'Lyon Express Delivery',
        registrationNumber: 'FR456789012343',
        street: '123 Rue de la Part-Dieu',
        city: 'Lyon',
        postalCode: '69003',
        country: 'France',
        phone: '+33472123456',
        email: 'contact@lyon-express.fr',
        createdByDealershipId: dealerships[1].id,
      },
    }),

    // Companies pour Marseille
    prisma.company.create({
      data: {
        name: 'Sud Transport Pro',
        registrationNumber: 'FR789012345671',
        street: '789 Boulevard Michelet',
        city: 'Marseille',
        postalCode: '13008',
        country: 'France',
        phone: '+33491234567',
        email: 'contact@sud-transport.fr',
        createdByDealershipId: dealerships[2].id,
      },
    }),
  ]);

  // VINs valides suivant les règles de validation
  const motorcycles = await Promise.all([
    // Motos pour Paris Centre (dealerships[0])
    createMotorcycleWithValidVIN({
      vin: 'SMTN765R9AH123456', // Checksum '8' calculé
      modelType: MotorcycleModel.STREET_TRIPLE_765_RS,
      year: 2023,
      color: 'Matt Silver Ice',
      mileage: 0,
      dealershipId: dealerships[0].id,
    }),
    createMotorcycleWithValidVIN({
      vin: 'SMTT900R6AH234567', // Checksum '4' calculé
      modelType: MotorcycleModel.TIGER_900_RALLY_PRO,
      year: 2023,
      color: 'Sapphire Black',
      mileage: 150,
      dealershipId: dealerships[0].id,
    }),

    // Motos pour Lyon (dealerships[1])
    createMotorcycleWithValidVIN({
      vin: 'SMTS12RS70H345678', // Checksum '2' calculé
      modelType: MotorcycleModel.SPEED_TRIPLE_1200_RS,
      year: 2024,
      color: 'Crystal White',
      mileage: 0,
      dealershipId: dealerships[1].id,
    }),

    // Motos pour Marseille (dealerships[2])
    createMotorcycleWithValidVIN({
      vin: 'SMTR3GTB30H456789', // Checksum '6' calculé
      modelType: MotorcycleModel.ROCKET_3_GT,
      year: 2024,
      color: 'Phantom Black',
      mileage: 50,
      dealershipId: dealerships[2].id,
    }),

    // Motos pour Bordeaux (dealerships[3])
    createMotorcycleWithValidVIN({
      vin: 'SMTT660R90H567890', // Checksum '0' calculé
      modelType: MotorcycleModel.TRIDENT_660,
      year: 2024,
      color: 'Silver Ice',
      mileage: 0,
      dealershipId: dealerships[3].id,
    }),

    // Motos pour Lille (dealerships[4])
    createMotorcycleWithValidVIN({
      vin: 'SMTBT12090H678901', // Checksum '3' calculé
      modelType: MotorcycleModel.BONNEVILLE_T120,
      year: 2024,
      color: 'Jet Black',
      mileage: 25,
      dealershipId: dealerships[4].id,
    }),

    // Motos supplémentaires
    createMotorcycleWithValidVIN({
      vin: 'SMTT900R71H789012', // Tiger supplémentaire pour Paris
      modelType: MotorcycleModel.TIGER_900_RALLY_PRO,
      year: 2024,
      color: 'Graphite',
      mileage: 0,
      dealershipId: dealerships[0].id,
    }),
    createMotorcycleWithValidVIN({
      vin: 'SMTS12RB92H890123', // Speed Triple supplémentaire pour Lyon
      modelType: MotorcycleModel.SPEED_TRIPLE_1200_RS,
      year: 2024,
      color: 'Storm Grey',
      mileage: 75,
      dealershipId: dealerships[1].id,
    }),
    createMotorcycleWithValidVIN({
      vin: 'SMTR3GTA9H9012345', // Rocket supplémentaire pour Marseille
      modelType: MotorcycleModel.ROCKET_3_GT,
      year: 2023,
      color: 'Cranberry Red',
      mileage: 25,
      dealershipId: dealerships[2].id,
    }),
    createMotorcycleWithValidVIN({
      vin: 'SMTS765RX4H123456', // Street Triple supplémentaire pour Bordeaux
      modelType: MotorcycleModel.STREET_TRIPLE_765_RS,
      year: 2024,
      color: 'Crystal White',
      mileage: 0,
      dealershipId: dealerships[3].id,
    }),
    createMotorcycleWithValidVIN({
      vin: 'SMTBT12075H234567', // Bonneville supplémentaire pour Lille
      modelType: MotorcycleModel.BONNEVILLE_T120,
      year: 2023,
      color: 'Cobalt Blue',
      mileage: 100,
      dealershipId: dealerships[4].id,
    }),

    // 10 Motos supplémentaires
    createMotorcycleWithValidVIN({
      vin: 'SMTT900R86H012345', // Tiger pour Paris
      modelType: MotorcycleModel.TIGER_900_RALLY_PRO,
      year: 2024,
      color: 'Sandstorm Yellow',
      mileage: 0,
      dealershipId: dealerships[0].id,
    }),
    createMotorcycleWithValidVIN({
      vin: 'SMTS12RB57H123456', // Speed Triple pour Paris
      modelType: MotorcycleModel.SPEED_TRIPLE_1200_RS,
      year: 2024,
      color: 'Matte Black',
      mileage: 50,
      dealershipId: dealerships[0].id,
    }),
    createMotorcycleWithValidVIN({
      vin: 'SMTR3GTBX8H234567', // Rocket pour Lyon
      modelType: MotorcycleModel.ROCKET_3_GT,
      year: 2024,
      color: 'Silver Ice',
      mileage: 0,
      dealershipId: dealerships[1].id,
    }),
    createMotorcycleWithValidVIN({
      vin: 'SMTT660R4B2H34567', // Trident pour Lyon
      modelType: MotorcycleModel.TRIDENT_660,
      year: 2024,
      color: 'Sapphire Black',
      mileage: 100,
      dealershipId: dealerships[1].id,
    }),
    createMotorcycleWithValidVIN({
      vin: 'SMTBT12066H789012', // Bonneville pour Marseille
      modelType: MotorcycleModel.BONNEVILLE_T120,
      year: 2024,
      color: 'Aegean Blue',
      mileage: 25,
      dealershipId: dealerships[2].id,
    }),
    createMotorcycleWithValidVIN({
      vin: 'SMTN765R27H890123', // Street Triple pour Marseille
      modelType: MotorcycleModel.STREET_TRIPLE_765_RS,
      year: 2024,
      color: 'Crystal White',
      mileage: 75,
      dealershipId: dealerships[2].id,
    }),
    createMotorcycleWithValidVIN({
      vin: 'SMTT900R38H901234', // Tiger pour Bordeaux
      modelType: MotorcycleModel.TIGER_900_RALLY_PRO,
      year: 2024,
      color: 'Matt Khaki',
      mileage: 0,
      dealershipId: dealerships[3].id,
    }),
    createMotorcycleWithValidVIN({
      vin: 'SMTS12RB79H012345', // Speed Triple pour Bordeaux
      modelType: MotorcycleModel.SPEED_TRIPLE_1200_RS,
      year: 2024,
      color: 'Storm Grey',
      mileage: 150,
      dealershipId: dealerships[3].id,
    }),
    createMotorcycleWithValidVIN({
      vin: 'SMTR3GTB43H123456', // Rocket pour Lille
      modelType: MotorcycleModel.ROCKET_3_GT,
      year: 2024,
      color: 'Red Hopper',
      mileage: 0,
      dealershipId: dealerships[4].id,
    }),
    createMotorcycleWithValidVIN({
      vin: 'SMTT660R64H234567', // Trident pour Lille
      modelType: MotorcycleModel.TRIDENT_660,
      year: 2024,
      color: 'Matt Storm Grey',
      mileage: 50,
      dealershipId: dealerships[4].id,
    }),
  ]);

  // Modification des motos pour les associer aux companies
  const motorcyclesWithCompanies = [
    // Paris - Transport Express Paris (companies[0])
    {
      vin: 'SMTT900R6AH234567',
      companyId: companies[0].id,
      dealershipId: dealerships[0].id,
    },
    {
      vin: 'SMTT900R71H789012',
      companyId: companies[0].id,
      dealershipId: dealerships[0].id,
    },
    // Paris - Livraison Rapide IDF (companies[1])
    {
      vin: 'SMTT900R86H012345',
      companyId: companies[1].id,
      dealershipId: dealerships[0].id,
    },
    // Lyon - Lyon Express Delivery (companies[2])
    {
      vin: 'SMTS12RS70H345678',
      companyId: companies[2].id,
      dealershipId: dealerships[1].id,
    },
    {
      vin: 'SMTR3GTBX8H234567',
      companyId: companies[2].id,
      dealershipId: dealerships[1].id,
    },
    // Marseille - Sud Transport Pro (companies[3])
    {
      vin: 'SMTR3GTB30H456789',
      companyId: companies[3].id,
      dealershipId: dealerships[2].id,
    },
    {
      vin: 'SMTR3GTA9H9012345',
      companyId: companies[3].id,
      dealershipId: dealerships[2].id,
    },
  ];

  // Mise à jour des motos pour les associer aux companies
  await Promise.all(
    motorcyclesWithCompanies.map(({ vin, companyId }) =>
      prisma.motorcycle.update({
        where: { vin },
        data: { companyId },
      }),
    ),
  );

  console.log('Concessions et motos créées avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

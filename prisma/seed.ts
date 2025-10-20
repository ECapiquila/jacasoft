import { PrismaClient, Role, KycStatus, PropertyPurpose, PropertyStatus, Currency } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.info('Resetting database...');
  await prisma.proof.deleteMany();
  await prisma.ledgerEntry.deleteMany();
  await prisma.order.deleteMany();
  await prisma.property.deleteMany();
  await prisma.withdrawal.deleteMany();
  await prisma.corretor.deleteMany();
  await prisma.user.deleteMany();
  await prisma.siteConfig.deleteMany();
  await prisma.commissionRule.deleteMany();

  const password = await hash('senhaSegura123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin Jacasoft',
      email: 'admin@jacasoft.test',
      phone: '+244900000001',
      role: Role.ADMIN,
      passwordHash: password,
      verified: true
    }
  });

  const corretorUser = await prisma.user.create({
    data: {
      name: 'Carla Correia',
      email: 'corretor@jacasoft.test',
      phone: '+244900000002',
      role: Role.CORRETOR,
      passwordHash: password,
      verified: true
    }
  });

  const cliente = await prisma.user.create({
    data: {
      name: 'Clara Cliente',
      email: 'cliente@jacasoft.test',
      phone: '+244900000003',
      role: Role.CLIENTE,
      passwordHash: password,
      verified: true
    }
  });

  const corretor = await prisma.corretor.create({
    data: {
      userId: corretorUser.id,
      bankData: {
        titular: 'Carla Correia',
        iban: 'AO06 0000 0000 0000 0000 001',
        banco: 'Banco Nacional'
      },
      kycStatus: KycStatus.VERIFICADO,
      walletBalance: 0
    }
  });

  await prisma.siteConfig.create({
    data: {
      branding: {
        logoUrl: '/logo.svg',
        primaryColor: '#2563eb'
      },
      bankAccounts: [
        { banco: 'Banco A', titular: 'Jacasoft LDA', iban: 'AO06000000000000000001', instrucao: 'Enviar comprovativo via plataforma.' },
        { banco: 'Banco B', titular: 'Jacasoft LDA', iban: 'AO06000000000000000002', instrucao: 'Referir referência do pedido.' }
      ],
      currencyPrimary: Currency.KZ,
      currencySecondary: Currency.USD,
      exchangeRate: 830,
      minWithdrawal: 10000,
      termsUrl: '/institucional/termos',
      privacyUrl: '/institucional/privacidade'
    }
  });

  await prisma.commissionRule.create({
    data: {
      percentDefault: 0.1
    }
  });

  const propertiesData = Array.from({ length: 10 }).map((_, index) => ({
    corretorId: corretor.id,
    title: `Imóvel Moderno ${index + 1}`,
    purpose: index % 2 === 0 ? PropertyPurpose.VENDA : PropertyPurpose.ARRENDAMENTO,
    type: index % 3 === 0 ? 'Apartamento' : 'Moradia',
    price: index % 2 === 0 ? 45000000 + index * 500000 : 150000 + index * 10000,
    currency: index % 2 === 0 ? Currency.KZ : Currency.USD,
    location: {
      provincia: 'Luanda',
      cidade: index % 2 === 0 ? 'Luanda' : 'Talatona',
      bairro: index % 2 === 0 ? 'Miramar' : 'Talatona',
      lat: -8.839 + index * 0.01,
      lng: 13.289 + index * 0.01
    },
    areaTotal: 120 + index * 10,
    bedrooms: 3 + (index % 3),
    bathrooms: 2 + (index % 2),
    parking: 1 + (index % 2),
    amenities: ['Piscina', 'Segurança 24h', 'Academia'].slice(0, (index % 3) + 1),
    description: 'Imóvel de alto padrão com acabamentos modernos e localização privilegiada.',
    media: [
      `https://picsum.photos/seed/imovel-${index}-1/1200/800`,
      `https://picsum.photos/seed/imovel-${index}-2/1200/800`,
      `https://picsum.photos/seed/imovel-${index}-3/1200/800`,
      `https://picsum.photos/seed/imovel-${index}-4/1200/800`,
      `https://picsum.photos/seed/imovel-${index}-5/1200/800`
    ],
    status: PropertyStatus.APROVADO,
    featured: index < 3,
    publishedAt: new Date()
  }));

  await prisma.property.createMany({ data: propertiesData });

  console.info('Seed concluída. Credenciais:');
  console.info('Admin: admin@jacasoft.test / senhaSegura123');
  console.info('Corretor: corretor@jacasoft.test / senhaSegura123');
  console.info('Cliente: cliente@jacasoft.test / senhaSegura123');

  return { admin, corretorUser, cliente };
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

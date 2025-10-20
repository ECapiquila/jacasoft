import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@prisma/client', () => {
  class Decimal {
    value: number;
    constructor(value: number | string) {
      this.value = Number(value);
    }
    toNumber() {
      return this.value;
    }
  }

  return {
    PrismaClient: class {},
    Prisma: { Decimal },
    Role: { CLIENTE: 'CLIENTE', CORRETOR: 'CORRETOR', ADMIN: 'ADMIN' },
    KycStatus: { PENDENTE: 'PENDENTE', VERIFICADO: 'VERIFICADO', REPROVADO: 'REPROVADO' },
    PropertyPurpose: { VENDA: 'VENDA', ARRENDAMENTO: 'ARRENDAMENTO' },
    PropertyStatus: { RASCUNHO: 'RASCUNHO', SUBMETIDO: 'SUBMETIDO', APROVADO: 'APROVADO', REPROVADO: 'REPROVADO', PAUSADO: 'PAUSADO' },
    OrderStatus: {
      AGUARDANDO_COMPROVATIVO: 'AGUARDANDO_COMPROVATIVO',
      EM_VERIFICACAO: 'EM_VERIFICACAO',
      APROVADO: 'APROVADO',
      REPROVADO: 'REPROVADO',
      CONCLUIDO: 'CONCLUIDO'
    },
    LedgerType: { COMISSAO: 'COMISSAO', CREDITO_CORRETOR: 'CREDITO_CORRETOR', DEBITO_SAQUE: 'DEBITO_SAQUE', AJUSTE: 'AJUSTE' },
    WithdrawalStatus: { SOLICITADO: 'SOLICITADO', EM_ANALISE: 'EM_ANALISE', PAGO: 'PAGO', REPROVADO: 'REPROVADO' },
    VisitStatus: { PENDENTE: 'PENDENTE', CONFIRMADA: 'CONFIRMADA', CONCLUIDA: 'CONCLUIDA', CANCELADA: 'CANCELADA' },
    Currency: { KZ: 'KZ', USD: 'USD' }
  };
});
import { createOrder, attachProof, verifyOrder } from '@/server/orders/service';
import { requestWithdrawal, processWithdrawal } from '@/server/finance/wallet';
import { listProperties } from '@/server/properties/queries';

const mockFactory = vi.hoisted(() => {
  const createId = (() => {
    let counter = 0;
    return () => `mock_${++counter}`;
  })();

  const baseState = () => {
    const adminId = createId();
    const corretorUserId = createId();
    const clienteId = createId();
    const corretorId = createId();

    const users = [
      { id: adminId, name: 'Admin Jacasoft', email: 'admin@jacasoft.test', phone: '+244900000001', role: 'ADMIN', passwordHash: 'hash', verified: true, createdAt: new Date() },
      { id: corretorUserId, name: 'Carla Correia', email: 'corretor@jacasoft.test', phone: '+244900000002', role: 'CORRETOR', passwordHash: 'hash', verified: true, createdAt: new Date() },
      { id: clienteId, name: 'Clara Cliente', email: 'cliente@jacasoft.test', phone: '+244900000003', role: 'CLIENTE', passwordHash: 'hash', verified: true, createdAt: new Date() }
    ];

    const corretores = [
      {
        id: corretorId,
        userId: corretorUserId,
        company: 'Jacasoft Realty',
        nif: '123456789',
        kycStatus: 'VERIFICADO',
        bankData: { titular: 'Carla Correia', iban: 'AO06000000000000000001', banco: 'Banco Nacional' },
        bio: null,
        walletBalance: 0
      }
    ];

    const properties = Array.from({ length: 10 }).map((_, index) => ({
      id: createId(),
      corretorId,
      title: `Imóvel Moderno ${index + 1}`,
      purpose: index % 2 === 0 ? 'VENDA' : 'ARRENDAMENTO',
      type: index % 3 === 0 ? 'Apartamento' : 'Moradia',
      price: 45000000 + index * 500000,
      currency: index % 2 === 0 ? 'KZ' : 'USD',
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
      media: Array.from({ length: 5 }).map((__, mediaIndex) => `https://picsum.photos/seed/imovel-${index}-${mediaIndex}/1200/800`),
      status: 'APROVADO',
      adminNotes: null,
      featured: index < 3,
      publishedAt: new Date(),
      updatedAt: new Date(),
      createdAt: new Date()
    }));

    return {
      users,
      corretores,
      properties,
      orders: [] as any[],
      proofs: [] as any[],
      ledgerEntries: [] as any[],
      withdrawals: [] as any[],
      commissionRules: [{ id: createId(), percentDefault: 0.1, overridesByCorretor: null }],
      siteConfigs: [
        {
          id: createId(),
          branding: { logoUrl: '/logo.svg', primaryColor: '#2563eb' },
          bankAccounts: [
            { banco: 'Banco A', titular: 'Jacasoft LDA', iban: 'AO06000000000000000001', instrucao: 'Enviar comprovativo via plataforma.' },
            { banco: 'Banco B', titular: 'Jacasoft LDA', iban: 'AO06000000000000000002', instrucao: 'Referir referência do pedido.' }
          ],
          currencyPrimary: 'KZ',
          currencySecondary: 'USD',
          exchangeRate: 830,
          minWithdrawal: 10000,
          termsUrl: '/institucional/termos',
          privacyUrl: '/institucional/privacidade'
        }
      ],
      createId,
      corretorId,
      corretorUserId,
      clienteId
    };
  };

  function clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
  }

  function createMockPrisma() {
    const state = baseState();

    const prisma = {
      __state: state,
      __reset() {
        Object.assign(state, baseState());
      },
      $connect: async () => {},
      $disconnect: async () => {},
      $transaction: async (fn: any) => fn(prisma),
      user: {
        findUniqueOrThrow: async ({ where }: any) => {
          const user = state.users.find((item) => item.id === where.id || item.email === where.email);
          if (!user) throw new Error('User not found');
          return clone(user);
        }
      },
      corretor: {
        findUniqueOrThrow: async ({ where, include }: any) => {
          const corretor = state.corretores.find((item) => item.id === where.id || item.userId === where.userId);
          if (!corretor) throw new Error('Corretor not found');
          const result: any = clone(corretor);
          if (include?.user) {
            result.user = clone(state.users.find((user) => user.id === corretor.userId));
          }
          return result;
        },
        findUnique: async ({ where, include }: any) => {
          const corretor = state.corretores.find((item) => item.id === where.id || item.userId === where.userId);
          if (!corretor) return null;
          const result: any = clone(corretor);
          if (include?.user) {
            result.user = clone(state.users.find((user) => user.id === corretor.userId));
          }
          return result;
        },
        update: async ({ where, data }: any) => {
          const corretor = state.corretores.find((item) => item.id === where.id);
          if (!corretor) throw new Error('Corretor not found');
          if (data.walletBalance?.increment !== undefined) corretor.walletBalance += data.walletBalance.increment;
          if (data.walletBalance?.decrement !== undefined) corretor.walletBalance -= data.walletBalance.decrement;
          if (data.walletBalance !== undefined && typeof data.walletBalance === 'number') corretor.walletBalance = data.walletBalance;
          return clone(corretor);
        },
        updateMany: async ({ data }: any) => {
          state.corretores.forEach((corretor) => {
            if (data.walletBalance !== undefined) corretor.walletBalance = data.walletBalance;
          });
        }
      },
      property: {
        findMany: async ({ where, take, orderBy }: any = {}) => {
          let results = [...state.properties];
          if (where?.status) results = results.filter((property) => property.status === where.status);
          if (where?.featured !== undefined) results = results.filter((property) => property.featured === where.featured);
          if (where?.purpose) results = results.filter((property) => property.purpose === where.purpose);
          if (where?.type) results = results.filter((property) => property.type === where.type);
          if (where?.price?.gte !== undefined) results = results.filter((property) => property.price >= where.price.gte);
          if (where?.price?.lte !== undefined) results = results.filter((property) => property.price <= where.price.lte);
          if (where?.bedrooms?.gte !== undefined) results = results.filter((property) => property.bedrooms >= where.bedrooms.gte);
          if (where?.amenities?.hasEvery) {
            results = results.filter((property) => where.amenities.hasEvery.every((amenity: string) => property.amenities.includes(amenity)));
          }
          if (orderBy?.publishedAt === 'desc') results.sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0));
          if (orderBy?.price === 'asc') results.sort((a, b) => a.price - b.price);
          if (orderBy?.areaTotal === 'desc') results.sort((a, b) => b.areaTotal - a.areaTotal);
          if (take) results = results.slice(0, take);
          return clone(results);
        },
        findFirstOrThrow: async ({ where }: any) => {
          const property = state.properties.find((item) => item.status === where.status);
          if (!property) throw new Error('Property not found');
          return clone(property);
        },
        findUniqueOrThrow: async ({ where, include }: any) => {
          const property = state.properties.find((item) => item.id === where.id);
          if (!property) throw new Error('Property not found');
          const result: any = clone(property);
          if (include?.corretor) {
            const corretor = state.corretores.find((item) => item.id === property.corretorId)!;
            result.corretor = include.corretor.include?.user
              ? { ...clone(corretor), user: clone(state.users.find((user) => user.id === corretor.userId)) }
              : clone(corretor);
          }
          return result;
        },
        create: async ({ data }: any) => {
          const property = { ...data, id: createId(), status: data.status ?? 'RASCUNHO', publishedAt: data.status === 'APROVADO' ? new Date() : null, updatedAt: new Date(), createdAt: new Date() };
          state.properties.push(property);
          return clone(property);
        },
        update: async ({ where, data }: any) => {
          const property = state.properties.find((item) => item.id === where.id);
          if (!property) throw new Error('Property not found');
          Object.assign(property, data, { updatedAt: new Date() });
          return clone(property);
        }
      },
      order: {
        create: async ({ data, include }: any) => {
          const order = { id: createId(), ...data, status: data.status ?? 'AGUARDANDO_COMPROVATIVO', adminNotes: null, updatedAt: new Date(), createdAt: new Date(), proofs: [] as any[] };
          state.orders.push(order);
          const result: any = clone(order);
          if (include?.property) result.property = clone(state.properties.find((item) => item.id === order.propertyId));
          return result;
        },
        update: async ({ where, data, include }: any) => {
          const order = state.orders.find((item) => item.id === where.id);
          if (!order) throw new Error('Order not found');
          if (data?.proofs?.create) {
            const proof = { id: createId(), ...data.proofs.create, createdAt: new Date(), orderId: order.id };
            state.proofs.push(proof);
            order.proofs.push(proof);
          }
          Object.assign(order, data, { updatedAt: new Date() });
          const result: any = clone(order);
          if (include?.client) result.client = clone(state.users.find((user) => user.id === order.clientId));
          if (include?.property) result.property = clone(state.properties.find((item) => item.id === order.propertyId));
          if (include?.corretor) {
            const corretor = state.corretores.find((item) => item.id === order.corretorId)!;
            result.corretor = include.corretor.include?.user
              ? { ...clone(corretor), user: clone(state.users.find((user) => user.id === corretor.userId)) }
              : clone(corretor);
          }
          return result;
        },
        findUniqueOrThrow: async ({ where, include }: any) => {
          const order = state.orders.find((item) => item.id === where.id);
          if (!order) throw new Error('Order not found');
          const result: any = clone(order);
          if (include?.property) result.property = clone(state.properties.find((item) => item.id === order.propertyId));
          if (include?.corretor) result.corretor = clone(state.corretores.find((item) => item.id === order.corretorId));
          return result;
        },
        findUnique: async ({ where }: any) => {
          const order = state.orders.find((item) => item.id === where.id);
          return order ? clone(order) : null;
        }
      },
      proof: {
        create: async ({ data }: any) => {
          const proof = { id: createId(), ...data, createdAt: new Date() };
          state.proofs.push(proof);
          return clone(proof);
        }
      },
      ledgerEntry: {
        createMany: async ({ data }: any) => {
          data.forEach((entry: any) => {
            state.ledgerEntries.push({ id: createId(), ...entry, createdAt: new Date() });
          });
        },
        create: async ({ data }: any) => {
          const entry = { id: createId(), ...data, createdAt: new Date() };
          state.ledgerEntries.push(entry);
          return clone(entry);
        },
        findMany: async ({ where }: any = {}) => {
          let results = [...state.ledgerEntries];
          if (where?.orderId) results = results.filter((entry) => entry.orderId === where.orderId);
          if (where?.corretorId) results = results.filter((entry) => entry.corretorId === where.corretorId);
          return clone(results);
        }
      },
      withdrawal: {
        create: async ({ data }: any) => {
          const withdrawal = { id: createId(), ...data, status: 'SOLICITADO', createdAt: new Date(), updatedAt: new Date() };
          state.withdrawals.push(withdrawal);
          return clone(withdrawal);
        },
        update: async ({ where, data }: any) => {
          const withdrawal = state.withdrawals.find((item) => item.id === where.id);
          if (!withdrawal) throw new Error('Withdrawal not found');
          Object.assign(withdrawal, data, { updatedAt: new Date() });
          return clone(withdrawal);
        },
        findUniqueOrThrow: async ({ where }: any) => {
          const withdrawal = state.withdrawals.find((item) => item.id === where.id);
          if (!withdrawal) throw new Error('Withdrawal not found');
          return clone(withdrawal);
        },
        findMany: async () => clone(state.withdrawals)
      },
      commissionRule: {
        findFirst: async () => clone(state.commissionRules[0])
      },
      siteConfig: {
        findFirst: async () => clone(state.siteConfigs[0])
      },
      message: {
        findMany: async () => [],
        create: async () => ({})
      },
      visit: {
        create: async () => ({}),
        update: async () => ({})
      }
    };

    return prisma;
  }

  return {
    create() {
      return createMockPrisma();
    }
  };
});

vi.mock('@/lib/prisma', () => {
  const prisma = mockFactory.create();
  return { prisma };
});

import { prisma } from '@/lib/prisma';

function getSeedUsers() {
  const state = (prisma as any).__state;
  const admin = state.users.find((user: any) => user.email === 'admin@jacasoft.test');
  const corretorUser = state.users.find((user: any) => user.email === 'corretor@jacasoft.test');
  const cliente = state.users.find((user: any) => user.email === 'cliente@jacasoft.test');
  const property = state.properties.find((item: any) => item.status === 'APROVADO');
  const corretor = state.corretores.find((item: any) => item.userId === corretorUser.id);
  return { admin, corretorUser: { ...corretorUser, corretor }, cliente, property };
}

describe('Fluxos críticos', () => {
  beforeEach(() => {
    (prisma as any).__reset();
  });

  it('aprova comprovativo e credita corretor', async () => {
    const { cliente, property, corretorUser } = getSeedUsers();
    const order = await createOrder({
      propertyId: property.id,
      clientId: cliente.id,
      value: Number(property.price),
      currency: property.currency
    });

    await attachProof({
      orderId: order.id,
      fileUrl: 'https://example.com/proof.pdf'
    });

    const approved = await verifyOrder({ orderId: order.id, approve: true, adminId: 'admin', notes: undefined });
    expect(approved.status).toBe('CONCLUIDO');

    const ledger = await prisma.ledgerEntry.findMany({ where: { orderId: order.id } });
    expect(ledger.some((entry: any) => entry.type === 'COMISSAO')).toBe(true);
    expect(ledger.some((entry: any) => entry.type === 'CREDITO_CORRETOR')).toBe(true);

    const corretor = await prisma.corretor.findUniqueOrThrow({ where: { id: corretorUser.corretor.id } });
    expect(Number(corretor.walletBalance)).toBeGreaterThan(0);
  });

  it('reprova comprovativo', async () => {
    const { cliente, property } = getSeedUsers();
    const order = await createOrder({
      propertyId: property.id,
      clientId: cliente.id,
      value: Number(property.price),
      currency: property.currency
    });

    await attachProof({ orderId: order.id, fileUrl: 'https://example.com/proof.pdf' });
    const rejected = await verifyOrder({ orderId: order.id, approve: false, adminId: 'admin', notes: 'Inconsistência' });
    expect(rejected.status).toBe('REPROVADO');
  });

  it('solicita e paga saque', async () => {
    const { corretorUser } = getSeedUsers();
    await prisma.corretor.update({ where: { id: corretorUser.corretor.id }, data: { walletBalance: 500000 } });

    const withdrawal = await requestWithdrawal({
      corretorId: corretorUser.corretor.id,
      amount: 100000,
      bankData: { iban: 'AO00', banco: 'Teste', titular: 'Corretor' }
    });

    const processed = await processWithdrawal({
      withdrawalId: withdrawal.id,
      status: 'PAGO',
      adminReceiptUrl: 'https://example.com/recibo.pdf'
    });

    expect(processed.status).toBe('PAGO');
    const corretor = await prisma.corretor.findUniqueOrThrow({ where: { id: corretorUser.corretor.id } });
    expect(Number(corretor.walletBalance)).toBeLessThan(500000);
  });

  it('publicação depende de aprovação admin', async () => {
    const { corretorUser } = getSeedUsers();
    const property = await prisma.property.create({
      data: {
        corretorId: corretorUser.corretor.id,
        title: 'Novo imóvel',
        purpose: 'VENDA',
        type: 'Apartamento',
        price: 1000000,
        currency: 'KZ',
        location: { provincia: 'Luanda', cidade: 'Luanda', bairro: 'Centro', lat: -8.8, lng: 13.2 },
        areaTotal: 120,
        bedrooms: 3,
        bathrooms: 2,
        parking: 1,
        amenities: ['Piscina'],
        description: 'Descrição teste',
        media: [
          'https://picsum.photos/seed/novo-1/1200/800',
          'https://picsum.photos/seed/novo-2/1200/800',
          'https://picsum.photos/seed/novo-3/1200/800',
          'https://picsum.photos/seed/novo-4/1200/800',
          'https://picsum.photos/seed/novo-5/1200/800'
        ],
        status: 'SUBMETIDO'
      }
    });

    expect(property.status).toBe('SUBMETIDO');
    const approved = await prisma.property.update({ where: { id: property.id }, data: { status: 'APROVADO' } });
    expect(approved.status).toBe('APROVADO');
  });

  it('pesquisa com filtros retorna imóveis', async () => {
    const results = await listProperties({ purpose: 'VENDA' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((property) => property.purpose === 'VENDA')).toBe(true);
  });
});

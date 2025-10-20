-- Create Enums
CREATE TYPE "Role" AS ENUM ('CLIENTE', 'CORRETOR', 'ADMIN');
CREATE TYPE "KycStatus" AS ENUM ('PENDENTE', 'VERIFICADO', 'REPROVADO');
CREATE TYPE "PropertyPurpose" AS ENUM ('VENDA', 'ARRENDAMENTO');
CREATE TYPE "PropertyStatus" AS ENUM ('RASCUNHO', 'SUBMETIDO', 'APROVADO', 'REPROVADO', 'PAUSADO');
CREATE TYPE "OrderStatus" AS ENUM ('AGUARDANDO_COMPROVATIVO', 'EM_VERIFICACAO', 'APROVADO', 'REPROVADO', 'CONCLUIDO');
CREATE TYPE "LedgerType" AS ENUM ('COMISSAO', 'CREDITO_CORRETOR', 'DEBITO_SAQUE', 'AJUSTE');
CREATE TYPE "WithdrawalStatus" AS ENUM ('SOLICITADO', 'EM_ANALISE', 'PAGO', 'REPROVADO');
CREATE TYPE "VisitStatus" AS ENUM ('PENDENTE', 'CONFIRMADA', 'CONCLUIDA', 'CANCELADA');
CREATE TYPE "Currency" AS ENUM ('KZ', 'USD');

-- Create Tables
CREATE TABLE "User" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "phone" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Corretor" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "company" TEXT,
    "nif" TEXT,
    "kycStatus" "KycStatus" NOT NULL DEFAULT 'PENDENTE',
    "bankData" JSONB NOT NULL,
    "bio" TEXT,
    "walletBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    CONSTRAINT "Corretor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "Property" (
    "id" TEXT PRIMARY KEY,
    "corretorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "purpose" "PropertyPurpose" NOT NULL,
    "type" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "currency" "Currency" NOT NULL,
    "location" JSONB NOT NULL,
    "areaTotal" INTEGER NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "parking" INTEGER NOT NULL,
    "amenities" TEXT[] NOT NULL,
    "description" TEXT NOT NULL,
    "media" TEXT[] NOT NULL,
    "status" "PropertyStatus" NOT NULL DEFAULT 'RASCUNHO',
    "adminNotes" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT FALSE,
    "publishedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Property_corretorId_fkey" FOREIGN KEY ("corretorId") REFERENCES "Corretor"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "Order" (
    "id" TEXT PRIMARY KEY,
    "propertyId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "corretorId" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "currency" "Currency" NOT NULL,
    "reference" TEXT NOT NULL UNIQUE,
    "status" "OrderStatus" NOT NULL DEFAULT 'AGUARDANDO_COMPROVATIVO',
    "adminNotes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_corretorId_fkey" FOREIGN KEY ("corretorId") REFERENCES "Corretor"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "Proof" (
    "id" TEXT PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "valueInformed" DECIMAL(65,30),
    "bankOrigin" TEXT,
    "payerName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Proof_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "CommissionRule" (
    "id" TEXT PRIMARY KEY,
    "percentDefault" DECIMAL(65,30) NOT NULL DEFAULT 0.1,
    "overridesByCorretor" JSONB
);

CREATE TABLE "LedgerEntry" (
    "id" TEXT PRIMARY KEY,
    "type" "LedgerType" NOT NULL,
    "orderId" TEXT,
    "corretorId" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" "Currency" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    CONSTRAINT "LedgerEntry_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "LedgerEntry_corretorId_fkey" FOREIGN KEY ("corretorId") REFERENCES "Corretor"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Withdrawal" (
    "id" TEXT PRIMARY KEY,
    "corretorId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "bankDataSnapshot" JSONB NOT NULL,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'SOLICITADO',
    "adminReceiptUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Withdrawal_corretorId_fkey" FOREIGN KEY ("corretorId") REFERENCES "Corretor"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "Message" (
    "id" TEXT PRIMARY KEY,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "propertyId" TEXT,
    "content" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Visit" (
    "id" TEXT PRIMARY KEY,
    "propertyId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "corretorId" TEXT NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "status" "VisitStatus" NOT NULL DEFAULT 'PENDENTE',
    CONSTRAINT "Visit_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Visit_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Visit_corretorId_fkey" FOREIGN KEY ("corretorId") REFERENCES "Corretor"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "SavedSearch" (
    "id" TEXT PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "filters" JSONB NOT NULL,
    "notifyEmail" BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT "SavedSearch_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "Favorite" (
    "id" TEXT PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Favorite_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "SiteConfig" (
    "id" TEXT PRIMARY KEY,
    "branding" JSONB NOT NULL,
    "bankAccounts" JSONB NOT NULL,
    "currencyPrimary" "Currency" NOT NULL,
    "currencySecondary" "Currency",
    "exchangeRate" DECIMAL(65,30) NOT NULL DEFAULT 1,
    "minWithdrawal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "termsUrl" TEXT,
    "privacyUrl" TEXT
);

-- Indexes
CREATE INDEX "Message_propertyId_idx" ON "Message"("propertyId");
CREATE INDEX "Visit_propertyId_idx" ON "Visit"("propertyId");
CREATE UNIQUE INDEX "Favorite_client_property_unique" ON "Favorite"("clientId", "propertyId");

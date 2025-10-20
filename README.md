# Jacasoft Marketplace Imobiliário

Plataforma imobiliária minimalista construída com Next.js 14, Prisma e PostgreSQL para suportar fluxos de compra/arrendamento com pagamentos offline, gestão de carteiras de corretores e painel administrativo completo.

## Requisitos

- Node.js 18+
- PostgreSQL 14+

## Configuração

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

3. Atualize `DATABASE_URL` e os segredos JWT/e-mail no arquivo `.env`.

   - Para armazenamento local (padrão), assegure-se de que `UPLOAD_DIR` seja gravável.
   - Para S3, defina `STORAGE_DRIVER=s3` e informe `S3_BUCKET`, `S3_REGION`, credenciais e, opcionalmente, `S3_PUBLIC_BASE_URL` ou `S3_ENDPOINT`.

4. Execute as migrações e seeds:

```bash
npx prisma migrate dev
npm run prisma:seed
```

5. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

## Credenciais Seed

| Perfil    | Email                    | Palavra-passe     |
|-----------|--------------------------|-------------------|
| Admin     | admin@jacasoft.test      | senhaSegura123    |
| Corretor  | corretor@jacasoft.test   | senhaSegura123    |
| Cliente   | cliente@jacasoft.test    | senhaSegura123    |

## Fluxos principais

### Pagamento offline
1. Cliente inicia pedido via página do imóvel (`/imoveis/[id]`).
2. Sistema gera referência e apresenta contas bancárias configuradas.
3. Cliente carrega comprovativo.
4. Admin aprova/reprova no painel (`/admin`).
5. Aprovação gera lançamento de comissão e crédito líquido na carteira do corretor.

### Carteira e saques
- Corretores visualizam saldo e lançamentos em `/corretor`.
- Solicitações de saque são enviadas para aprovação administrativa.
- Admin marca como pago e anexa comprovativo, debitando o saldo.

### Publicação de imóveis
- Corretores registados publicam imóveis via API (`POST /api/properties`).
- Admin aprova na rota administrativa (`PATCH /api/admin/properties/:id/status`).

## Scripts úteis

- `npm run dev` – servidor Next.js com Tailwind CSS.
- `npm run build` – build de produção.
- `npm run test` – testes de aceitação (Vitest).
- `npm run prisma:migrate` – aplica migrações.
- `npm run prisma:seed` – popula a base com dados iniciais.
- `npx next-sitemap` – gera `sitemap.xml` e `robots.txt`.

## Testes de aceitação

Os testes automatizados validam:
- Aprovação de comprovativo com geração de lançamentos contábeis.
- Reprovação de comprovativo com notificação.
- Solicitação e pagamento de saque.
- Aprovação administrativa necessária para publicação de imóveis.
- Pesquisa de imóveis com filtros retornando resultados coerentes.

Execute com:

```bash
npm run test
```

## Geração de relatórios

O endpoint `GET /api/admin/reports` suporta filtros por intervalo e exportação CSV para vendas, comissões, saldos e saques. Utilize o parâmetro `csv=1` para obter o arquivo.

## Licença

MIT

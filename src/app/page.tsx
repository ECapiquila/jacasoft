import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar';
import { PropertyHighlights } from '@/components/PropertyHighlights';

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12">
      <section className="grid gap-6 text-center md:grid-cols-2 md:text-left">
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold text-neutral-900 md:text-5xl">
            Encontre o imóvel ideal com pagamentos offline seguros.
          </h1>
          <p className="text-neutral-600">
            Plataforma minimalista para clientes, corretores e administradores com fluxo completo de pagamentos por transferência
            bancária e carteira digital.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/imoveis" className="rounded-full bg-primary px-6 py-3 text-white shadow hover:bg-primary/90">
              Ver Imóveis
            </Link>
            <Link
              href="/auth/register?role=corretor"
              className="rounded-full border border-primary px-6 py-3 text-primary hover:bg-primary/10"
            >
              Publicar Imóvel
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Pesquisa rápida</h2>
          <SearchBar variant="compact" />
        </div>
      </section>
      <PropertyHighlights />
    </main>
  );
}

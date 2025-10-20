import Link from 'next/link';
import { getFeaturedProperties } from '@/server/properties/queries';
import { PropertyCard } from '@/components/PropertyCard';

export async function PropertyHighlights() {
  const featured = await getFeaturedProperties();

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Imóveis em destaque</h2>
        <Link href="/imoveis" className="text-sm font-medium text-primary hover:text-primary/80">
          Ver todos
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}

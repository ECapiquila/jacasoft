import dynamic from 'next/dynamic';
import { PropertyCard } from '@/components/PropertyCard';
import type { PropertySummary } from '@/server/properties/types';

const LeafletMap = dynamic(() => import('@/components/maps/LeafletMap').then((mod) => mod.LeafletMap), {
  ssr: false,
  loading: () => <div className="h-80 w-full animate-pulse rounded-3xl bg-neutral-200" aria-busy="true" />
});

interface MapListViewProps {
  properties: PropertySummary[];
}

export function MapListView({ properties }: MapListViewProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_1.2fr]">
      <div className="grid gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
        {properties.length === 0 && <p className="text-neutral-500">Nenhum imóvel encontrado com os filtros escolhidos.</p>}
      </div>
      <div className="sticky top-6 h-fit">
        <LeafletMap
          markers={properties.map((property) => ({
            id: property.id,
            position: [property.location.lat, property.location.lng],
            title: property.title
          }))}
        />
      </div>
    </div>
  );
}

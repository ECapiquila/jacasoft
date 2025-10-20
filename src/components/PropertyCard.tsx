import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon, MapPinIcon } from '@heroicons/react/24/outline';
import type { PropertySummary } from '@/server/properties/types';

interface PropertyCardProps {
  property: PropertySummary;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = property.media[0] ?? 'https://picsum.photos/seed/placeholder/800/600';

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={mainImage}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 33vw"
          priority={false}
        />
        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase text-primary">
          {property.purpose === 'VENDA' ? 'Venda' : 'Arrendamento'}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-neutral-900">{property.title}</h3>
          <div className="flex items-center gap-1 text-sm text-neutral-500">
            <MapPinIcon className="h-4 w-4" aria-hidden />
            <span>
              {property.location.cidade}, {property.location.bairro}
            </span>
          </div>
        </div>
        <p className="text-sm text-neutral-600 line-clamp-2">{property.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="text-lg font-semibold text-primary">
            {new Intl.NumberFormat('pt-PT', {
              style: 'currency',
              currency: property.currency
            }).format(Number(property.price))}
          </div>
          <Link
            href={`/imoveis/${property.id}`}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
          >
            Ver detalhes
            <ArrowRightIcon className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

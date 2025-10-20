import { SearchBar } from '@/components/SearchBar';
import { MapListView } from '@/components/MapListView';
import { listProperties } from '@/server/properties/queries';

interface Props {
  searchParams?: Record<string, string | string[]>;
}

export default async function PropertiesPage({ searchParams = {} }: Props) {
  const filters = {
    q: typeof searchParams.q === 'string' ? searchParams.q : undefined,
    purpose: typeof searchParams.purpose === 'string' ? (searchParams.purpose as 'VENDA' | 'ARRENDAMENTO') : undefined,
    type: typeof searchParams.type === 'string' ? searchParams.type : undefined,
    priceMin: typeof searchParams.priceMin === 'string' ? Number(searchParams.priceMin) : undefined,
    priceMax: typeof searchParams.priceMax === 'string' ? Number(searchParams.priceMax) : undefined,
    provincia: typeof searchParams.provincia === 'string' ? searchParams.provincia : undefined,
    cidade: typeof searchParams.cidade === 'string' ? searchParams.cidade : undefined,
    bairro: typeof searchParams.bairro === 'string' ? searchParams.bairro : undefined,
    bedrooms: typeof searchParams.bedrooms === 'string' ? Number(searchParams.bedrooms) : undefined,
    amenities: Array.isArray(searchParams.amenities)
      ? (searchParams.amenities as string[])
      : typeof searchParams.amenities === 'string'
        ? [searchParams.amenities]
        : undefined,
    orderBy: typeof searchParams.orderBy === 'string' ? (searchParams.orderBy as 'novos' | 'preco' | 'area') : undefined
  };

  const properties = await listProperties(filters);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <SearchBar />
      <MapListView properties={properties} />
    </main>
  );
}

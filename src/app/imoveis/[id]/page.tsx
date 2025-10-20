import Image from 'next/image';
import Link from 'next/link';
import { getPropertyById } from '@/server/properties/queries';
import { getPublicSiteConfig } from '@/server/config/site';
import { OrderFlow } from '@/components/OrderFlow';

interface Params {
  params: { id: string };
}

export default async function PropertyDetailPage({ params }: Params) {
  const property = await getPropertyById(params.id);
  const siteConfig = await getPublicSiteConfig();
  const corretor = property.corretor;

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {property.media.map((url) => (
              <div key={url} className="relative h-48 overflow-hidden rounded-2xl">
                <Image src={url} alt={property.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
              </div>
            ))}
          </div>
          <section className="space-y-4">
            <h1 className="text-3xl font-semibold text-neutral-900">{property.title}</h1>
            <p className="text-sm text-neutral-600">
              {property.location.cidade}, {property.location.bairro}
            </p>
            <p className="text-neutral-700">{property.description}</p>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity) => (
                <span key={amenity} className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600">
                  {amenity}
                </span>
              ))}
            </div>
          </section>
          <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Contacto do corretor</h2>
            <p className="text-sm text-neutral-600">{corretor.user.name}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`https://wa.me/${corretor.user.phone.replace(/[^\d]/g, '')}`}
                className="rounded-full border border-primary px-4 py-2 text-sm text-primary"
              >
                WhatsApp
              </Link>
              <Link href={`/messages/new?to=${corretor.userId}`} className="rounded-full bg-primary px-4 py-2 text-sm text-white">
                Enviar mensagem
              </Link>
              <Link
                href={`/visitas/novo?property=${property.id}`}
                className="rounded-full bg-neutral-900 px-4 py-2 text-sm text-white"
              >
                Agendar visita
              </Link>
            </div>
          </section>
        </div>
        <OrderFlow propertyId={property.id} price={Number(property.price)} currency={property.currency} bankAccounts={siteConfig.bankAccounts} />
      </div>
    </main>
  );
}

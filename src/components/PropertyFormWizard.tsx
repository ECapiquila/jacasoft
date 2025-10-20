'use client';

import { useState } from 'react';

const steps = ['Dados', 'Mídia', 'Preço', 'Revisão'];

interface PropertyFormWizardProps {
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

export function PropertyFormWizard({ onSubmit }: PropertyFormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, unknown>>({ amenities: [] });
  const [loading, setLoading] = useState(false);

  function update(values: Record<string, unknown>) {
    setFormData((prev) => ({ ...prev, ...values }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex-1 text-center text-sm">
            <div
              className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full text-white ${
                index <= currentStep ? 'bg-primary' : 'bg-neutral-300'
              }`}
            >
              {index + 1}
            </div>
            <span className={index === currentStep ? 'font-semibold text-neutral-900' : 'text-neutral-500'}>{step}</span>
          </div>
        ))}
      </div>
      {currentStep === 0 && (
        <section className="space-y-3">
          <input
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            placeholder="Título"
            onChange={(event) => update({ title: event.target.value })}
            required
          />
          <textarea
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            placeholder="Descrição"
            onChange={(event) => update({ description: event.target.value })}
            required
          />
        </section>
      )}
      {currentStep === 1 && (
        <section className="space-y-3">
          <input
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            placeholder="URLs das imagens (separadas por vírgula)"
            onChange={(event) => update({ media: event.target.value.split(',').map((item) => item.trim()) })}
            required
          />
        </section>
      )}
      {currentStep === 2 && (
        <section className="space-y-3">
          <input
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            type="number"
            placeholder="Valor"
            onChange={(event) => update({ price: Number(event.target.value) })}
            required
          />
        </section>
      )}
      {currentStep === 3 && (
        <section className="space-y-3 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Revisão</h3>
          <pre className="overflow-x-auto text-xs text-neutral-600">{JSON.stringify(formData, null, 2)}</pre>
        </section>
      )}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))}
          className="rounded-xl border border-neutral-300 px-4 py-2 text-sm"
        >
          Voltar
        </button>
        {currentStep < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((step) => Math.min(step + 1, steps.length - 1))}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Avançar
          </button>
        ) : (
          <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white" disabled={loading}>
            {loading ? 'A enviar…' : 'Submeter'}
          </button>
        )}
      </div>
    </form>
  );
}

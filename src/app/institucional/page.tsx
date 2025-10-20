export default function InstitutionalPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-10 px-6 py-12">
      <section>
        <h1 className="text-3xl font-semibold text-neutral-900">Sobre nós</h1>
        <p className="mt-4 text-neutral-600">
          A Jacasoft Imobiliária oferece uma plataforma minimalista e segura para transações offline, unindo clientes, corretores e administradores.
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-neutral-900">Contactos</h2>
        <p className="mt-2 text-neutral-600">Email: suporte@jacasoft.test</p>
        <p className="text-neutral-600">Telefone: +244 900 000 000</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-neutral-900">Termos e condições</h2>
        <p className="mt-2 text-neutral-600">As transações são efetuadas por transferência bancária e dependem da aprovação de comprovativos pela equipa administrativa.</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-neutral-900">Política de privacidade</h2>
        <p className="mt-2 text-neutral-600">Protegemos os dados pessoais dos utilizadores e utilizamos autenticação baseada em tokens com expiração curta.</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-neutral-900">FAQ</h2>
        <ul className="mt-2 list-disc space-y-2 pl-6 text-neutral-600">
          <li>Como iniciar um pedido? Clique em "Iniciar pedido" na página do imóvel.</li>
          <li>Como o corretor recebe? Após aprovação do comprovativo, o valor líquido é creditado na carteira.</li>
          <li>Há pagamentos online? Não, apenas transferência bancária.</li>
        </ul>
      </section>
    </main>
  );
}

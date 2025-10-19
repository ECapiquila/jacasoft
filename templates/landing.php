<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Página de Vendas - Sua Oferta</title>
    <style>
      :root {
        --primary: #11b65c;
        --primary-dark: #0e9a4d;
        --secondary: #0b1f2a;
        --accent: #f8c045;
        --light: #ffffff;
        --muted: #7a8a99;
        --bg: #f5f7fa;
        --font-main: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: var(--font-main);
        background: var(--bg);
        color: var(--secondary);
        line-height: 1.6;
      }

      header {
        background: linear-gradient(150deg, rgba(11, 31, 42, 0.96), rgba(17, 182, 92, 0.9)),
          url("data:image/svg+xml,%3Csvg width='600' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop stop-color='%230b1f2a' stop-opacity='0.65' offset='0%25'/%3E%3Cstop stop-color='%230e9a4d' stop-opacity='0.25' offset='100%25'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='60' fill='%2311b65c' fill-opacity='0.16'/%3E%3Ccircle cx='520' cy='420' r='90' fill='%23f8c045' fill-opacity='0.12'/%3E%3C/svg%3E")
            center/cover no-repeat;
        color: var(--light);
        padding: 4rem 1.5rem 5.5rem;
      }

      header .container {
        max-width: 1100px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2.5rem;
        align-items: center;
      }

      header h1 {
        font-size: clamp(2.2rem, 4vw, 3.2rem);
        margin-bottom: 1rem;
        line-height: 1.15;
      }

      header p {
        font-size: clamp(1.05rem, 2.2vw, 1.25rem);
        color: rgba(255, 255, 255, 0.85);
        margin-bottom: 2rem;
      }

      .cta-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        background: var(--accent);
        color: var(--secondary);
        padding: 0.95rem 1.8rem;
        border-radius: 999px;
        font-weight: 700;
        text-decoration: none;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        box-shadow: 0 12px 30px rgba(17, 182, 92, 0.25);
      }

      .cta-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 18px 36px rgba(17, 182, 92, 0.35);
      }

      .cta-btn span.icon {
        display: inline-flex;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: rgba(11, 31, 42, 0.1);
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
      }

      .video-wrapper {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 24px;
        padding: 1.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        overflow: hidden;
      }

      .video-embed {
        width: 100%;
        aspect-ratio: 16 / 9;
        border-radius: 16px;
        border: none;
        background: radial-gradient(circle at center, rgba(248, 192, 69, 0.35), rgba(17, 182, 92, 0.25)),
          linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(11, 31, 42, 0.2));
        display: grid;
        place-items: center;
        color: rgba(255, 255, 255, 0.85);
        text-align: center;
        padding: 1.5rem;
        font-size: 1.05rem;
        font-weight: 600;
      }

      .video-embed::before {
        content: "▶";
        font-size: 3rem;
        display: block;
        margin-bottom: 0.75rem;
        opacity: 0.8;
      }

      main {
        max-width: 1100px;
        margin: -3rem auto 0;
        padding: 0 1.5rem 4rem;
      }

      .card {
        background: var(--light);
        border-radius: 20px;
        padding: 2.5rem;
        box-shadow: 0 20px 45px rgba(11, 31, 42, 0.12);
        margin-bottom: 2rem;
      }

      .card h2 {
        margin-top: 0;
        font-size: clamp(1.6rem, 3vw, 2.1rem);
      }

      .benefits {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1.5rem;
      }

      .benefit-item {
        background: #f0f7f2;
        border-radius: 16px;
        padding: 1.5rem;
        border: 1px solid rgba(17, 182, 92, 0.18);
      }

      .benefit-item h3 {
        margin-top: 0;
        font-size: 1.15rem;
        color: var(--primary-dark);
      }

      .testimonials {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 1.5rem;
      }

      .testimonial {
        background: #ffffff;
        border-radius: 18px;
        padding: 1.5rem;
        border: 1px solid rgba(11, 31, 42, 0.08);
      }

      .testimonial strong {
        display: block;
        margin-top: 1rem;
        color: var(--primary);
      }

      footer {
        text-align: center;
        padding: 3rem 1.5rem;
        color: var(--muted);
        font-size: 0.95rem;
      }

      /* Modal */
      .modal {
        position: fixed;
        inset: 0;
        background: rgba(11, 31, 42, 0.68);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        z-index: 1000;
      }

      .modal.active {
        display: flex;
      }

      .modal-content {
        background: var(--light);
        border-radius: 18px;
        padding: 2rem;
        width: min(420px, 100%);
        box-shadow: 0 25px 55px rgba(11, 31, 42, 0.22);
        position: relative;
      }

      .modal-header h3 {
        margin: 0 0 0.5rem;
        font-size: 1.5rem;
        color: var(--secondary);
      }

      .modal-header p {
        margin: 0 0 1.5rem;
        color: var(--muted);
      }

      .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: none;
        background: rgba(11, 31, 42, 0.08);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1.05rem;
      }

      form label {
        display: block;
        font-weight: 600;
        margin-bottom: 0.35rem;
        color: var(--secondary);
      }

      form input {
        width: 100%;
        padding: 0.85rem 1rem;
        border-radius: 12px;
        border: 1px solid rgba(11, 31, 42, 0.18);
        font-size: 1rem;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      form input:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(17, 182, 92, 0.2);
      }

      form .form-group {
        margin-bottom: 1.2rem;
      }

      .submit-btn {
        width: 100%;
        border: none;
        border-radius: 12px;
        padding: 0.95rem;
        background: var(--primary);
        color: var(--light);
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
      }

      .submit-btn:hover {
        background: var(--primary-dark);
        transform: translateY(-1px);
        box-shadow: 0 12px 24px rgba(17, 182, 92, 0.25);
      }

      .submit-btn:disabled {
        cursor: not-allowed;
        opacity: 0.7;
        transform: none;
        box-shadow: none;
      }

      .feedback {
        margin-top: 1rem;
        font-size: 0.95rem;
      }

      .feedback.success {
        color: var(--primary-dark);
      }

      .feedback.error {
        color: #d64545;
      }

      @media (max-width: 640px) {
        header {
          padding: 3.2rem 1.25rem 4rem;
        }

        .card {
          padding: 1.85rem;
        }

        .video-embed {
          font-size: 0.98rem;
        }

        .cta-btn {
          width: 100%;
          justify-content: center;
        }
      }
    </style>
  </head>
  <body>
    <header>
      <div class="container">
        <div>
          <h1>Junte-se ao Clube Sete, a Rede Social com a Solução que Já Impactou +5.000 Utilizadores</h1>
          <p>Junte-se à rede social que todos estão falando.</p>
          <a id="open-modal" class="cta-btn" href="#lead-modal">
            <span class="icon">💬</span>
            Quero falar com a equipe agora
          </a>
        </div>

        <div class="video-wrapper">
          <div class="video-embed">
            <!-- Cole aqui o seu vídeo (iframe do YouTube, Vimeo ou vídeo hospedado) -->
          </div>
        </div>
      </div>
    </header>

    <main>
      <section class="card">
        <h2>Por que essa solução funciona?</h2>
        <p>
          Descreva os principais benefícios de forma objetiva. Reforce o problema do público-alvo e como sua proposta resolve isso
          com rapidez e segurança.
        </p>

        <div class="benefits">
          <div class="benefit-item">
            <h3>Benefício #1</h3>
            <p>Explique como o cliente ganha tempo, dinheiro ou praticidade ao usar sua solução.</p>
          </div>
          <div class="benefit-item">
            <h3>Benefício #2</h3>
            <p>Mostre a segurança, suporte ou diferenciais técnicos que reforçam sua autoridade.</p>
          </div>
          <div class="benefit-item">
            <h3>Benefício #3</h3>
            <p>Apresente o impacto direto que a pessoa pode esperar nos próximos dias ou semanas.</p>
          </div>
        </div>
      </section>

      <section class="card">
        <h2>O que dizem nossos clientes</h2>
        <div class="testimonials">
          <article class="testimonial">
            “Com essa solução, dobramos nossas vendas em menos de 30 dias. O suporte é simplesmente impecável.”
            <strong>Juliana Martins · CEO da StartGrow</strong>
          </article>
          <article class="testimonial">
            “Processos mais eficientes e clientes mais satisfeitos. Foi o melhor investimento do ano.”
            <strong>Ricardo Alves · Diretor Comercial</strong>
          </article>
          <article class="testimonial">
            “Uma equipe parceira, pronta para ajustar tudo às nossas necessidades reais.”
            <strong>Ana Souza · Consultora de Marketing</strong>
          </article>
        </div>
      </section>

      <section class="card">
        <h2>Como funciona o acompanhamento</h2>
        <ol>
          <li><strong>Diagnóstico express</strong>: entendemos rapidamente o seu momento e objetivos.</li>
          <li><strong>Plano de ação</strong>: desenhamos a estratégia e materiais necessários para você executar.</li>
          <li><strong>Suporte contínuo</strong>: você nunca fica sozinho; nossa equipe acompanha cada etapa.</li>
        </ol>
      </section>
    </main>

    <footer>
      © <span id="year"></span> Sua Marca. Todos os direitos reservados. ·
      <a href="#" style="color: inherit; text-decoration: underline">Política de privacidade</a>
    </footer>

    <!-- Modal de captura -->
    <div id="lead-modal" class="modal" role="dialog" aria-modal="true" aria-labelledby="lead-form-title">
      <div class="modal-content">
        <button class="modal-close" type="button" aria-label="Fechar formulário">&times;</button>
        <div class="modal-header">
          <h3 id="lead-form-title">Quase lá! Precisamos de alguns dados</h3>
          <p>Informe seu nome e número para que nossa equipe te receba direto no WhatsApp.</p>
        </div>

        <form id="lead-form" autocomplete="on" novalidate>
          <div class="form-group">
            <label for="lead-name">Nome completo</label>
            <input type="text" id="lead-name" name="name" placeholder="Ex.: Ana Pereira" required minlength="3" />
          </div>

          <div class="form-group">
            <label for="lead-phone">WhatsApp (com DDD)</label>
            <input
              type="tel"
              id="lead-phone"
              name="phone"
              placeholder="Ex.: 11987654321"
              inputmode="numeric"
              pattern="\d{10,14}"
              required
            />
          </div>

          <button class="submit-btn" type="submit">Quero ser atendido agora</button>
          <div class="feedback" id="form-feedback" role="status" aria-live="polite"></div>
        </form>
      </div>
    </div>

    <script>
      (function () {
        const modal = document.getElementById('lead-modal');
        const openBtn = document.getElementById('open-modal');
        const closeBtn = modal.querySelector('.modal-close');
        const form = document.getElementById('lead-form');
        const feedback = document.getElementById('form-feedback');
        const submitBtn = form.querySelector('.submit-btn');
        const yearSpan = document.getElementById('year');

        yearSpan.textContent = new Date().getFullYear();

        function openModal(event) {
          event.preventDefault();
          modal.classList.add('active');
          form.reset();
          feedback.textContent = '';
          feedback.className = 'feedback';
          form.querySelector('input').focus();
        }

        function closeModal() {
          modal.classList.remove('active');
        }

        openBtn.addEventListener('click', openModal);
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (event) => {
          if (event.target === modal) closeModal();
        });

        document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
          }
        });

        function showFeedback(message, status) {
          feedback.textContent = message;
          feedback.className = `feedback ${status}`;
        }

        form.addEventListener('submit', async (event) => {
          event.preventDefault();

          const formData = new FormData(form);
          const name = formData.get('name').trim();
          const phone = formData
            .get('phone')
            .toString()
            .replace(/\D/g, '');

          if (!name || name.length < 3 || phone.length < 10 || phone.length > 14) {
            showFeedback('Por favor, preencha todos os campos corretamente.', 'error');
            return;
          }

          submitBtn.disabled = true;
          submitBtn.textContent = 'Enviando...';
          showFeedback('', '');

          try {
            const response = await fetch('/api/leads', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name,
                phone,
                source: 'landing-page-video',
                timestamp: new Date().toISOString(),
              }),
            });

            const result = await response.json().catch(() => null);

            if (!response.ok || !result || !(result.success || result.id)) {
              const errorMessage = (result && result.message) || 'Não foi possível enviar seus dados. Tente novamente em instantes.';
              throw new Error(errorMessage);
            }

            showFeedback('Dados enviados com sucesso! Redirecionando...', 'success');

            const encodedMessage = encodeURIComponent(`Olá, meu nome é ${name}. Acabei de ver a apresentação e quero saber mais.`);
            const whatsappNumber = phone.startsWith('244') ? phone : `244${phone}`;
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            setTimeout(() => {
              window.open(whatsappUrl, '_blank');
              closeModal();
            }, 900);
          } catch (error) {
            console.error(error);
            showFeedback(error.message || 'Não foi possível enviar seus dados. Tente novamente em instantes.', 'error');
          } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Quero ser atendido agora';
          }
        });
      })();
    </script>
  </body>
</html>

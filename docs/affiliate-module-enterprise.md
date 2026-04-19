# Módulo Enterprise de Afiliados (BookingCore)

## 1) Visão geral
Implementação incremental do módulo de afiliados para rastrear cliques, vincular reservas, gerar comissão automática, gerir saques e disponibilizar painel de parceiro e telas administrativas.

## 2) Arquitetura aplicada
- **Módulo:** `modules/Affiliate`
- **Camadas:** Config, Models, Services, Controllers, Events/Listeners, Routes, Views.
- **Persistência de vínculo com reserva:** `bc_booking_meta` (chaves `affiliate_id` e `affiliate_code`) como estratégia recomendada de baixo risco.

## 3) Tabelas do módulo
- `bc_affiliate_partners`
- `bc_affiliate_clicks`
- `bc_affiliate_commissions`
- `bc_affiliate_withdrawals`
- `bc_affiliate_coupons`
- `bc_affiliate_payouts`

## 4) Fluxo de afiliado
1. Usuário solicita cadastro no painel (`/user/affiliate`).
2. Sistema gera `affiliate_code` único.
3. Status inicial definido por configuração (`auto_approve_partner`).
4. Admin recebe notificação de novo parceiro quando aplicável.

## 5) Fluxo de comissão
1. Visitante entra com `?ref=CODIGO`.
2. Código aprovado é salvo em cookie/sessão e click é registrado.
3. No booking elegível, vínculo é gravado em metadata da reserva.
4. Listener de alteração de status do booking avalia elegibilidade (`paid` por padrão).
5. Comissão é criada com proteção de duplicidade (`unique affiliate_id + booking_id`).
6. Cancelamento de booking propaga cancelamento de comissão pendente/aprovada.

## 6) Fluxo de saque
1. Afiliado solicita saque.
2. Admin aprova/rejeita/paga.
3. Mudanças de status disparam notificação ao afiliado.
4. `bc_affiliate_payouts` mantém trilha para automação futura.

## 7) Fluxo de notificações
Integração prevista com canais nativos:
- `AdminChannelServices` para alertas administrativos.
- `PrivateChannelServices` para alertas do afiliado.

## 8) Estratégia de implantação em base existente
- Aplicar migration do framework ou script SQL manual.
- Evitar alterações em tabelas centrais de booking.
- Preferir metadata para vínculo com afiliado.

## 9) Estratégia sem migration do framework
Executar `sql/affiliate_module_safe.sql` em janela controlada.

## 10) Rollback
1. Pausar geração de novas comissões.
2. Exportar dados de `bc_affiliate_*`.
3. Dropar tabelas do módulo em ordem inversa de dependência.

## 11) Guia de testes pós-implantação
Ver `docs/affiliate-post-deploy-tests.md`.

## 12) Checklist operacional
- [ ] Rotas carregadas.
- [ ] Views renderizando com layout padrão.
- [ ] Captura de `ref` ativa.
- [ ] Comissão sem duplicidade.
- [ ] Notificações aparecendo no painel.
- [ ] SQL seguro aplicado sem erro.

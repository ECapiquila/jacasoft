# Guia de Testes Pós-Implantação — Afiliados

## Cenários obrigatórios
1. **Cadastro de afiliado**
   - Criar parceiro com status configurável (`pending/approved`).
2. **Geração de link**
   - Validar link geral e por tour (`/tour/{slug}?ref=CODIGO`).
3. **Clique com ref**
   - Confirmar persistência em cookie/sessão e registro em `bc_affiliate_clicks`.
4. **Reserva com ref**
   - Confirmar gravação de `affiliate_id` e `affiliate_code` em `bc_booking_meta`.
5. **Geração automática de comissão**
   - Simular mudança do booking para `paid`.
6. **Cancelamento de comissão**
   - Mudar booking para cancelado e validar status `cancelled`.
7. **Pedido de saque**
   - Solicitar valor >= mínimo configurado.
8. **Atualização de saque pelo admin**
   - Aprovar/rejeitar/pagar e validar `paid_at`.
9. **Notificações**
   - Validar alertas para admin e afiliado.
10. **Integridade SQL**
   - Confirmar índices/constraints e ausência de duplicidade de comissão.

## Query de validação rápida
```sql
SELECT affiliate_id, booking_id, COUNT(*)
FROM bc_affiliate_commissions
GROUP BY affiliate_id, booking_id
HAVING COUNT(*) > 1;
```
Resultado esperado: **zero linhas**.

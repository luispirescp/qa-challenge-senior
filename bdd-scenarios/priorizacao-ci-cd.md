# Priorização dos cenários PayPal na CI/CD

## Limite de escopo

O documento original que contém a US-042 e seus critérios de aceite não está presente no repositório. Os cenários em `paypal-payment.feature` foram derivados somente dos requisitos explícitos fornecidos para este desafio. Eles são especificações BDD, não testes executáveis: não há aplicação PayPal, integração, endpoint ou ambiente sandbox disponibilizado, e nenhum foi inventado.

## Ordem recomendada

| Etapa | Prioridade | Cenários | Justificativa |
| --- | --- | --- | --- |
| Pull request | P0 | Redirecionamento; pagamento aprovado e liberação; cancelamento com carrinho preservado; pagamento recusado; consistência de valor e BRL | Cobrem o caminho principal e os resultados financeiros e de acesso mais críticos. Quando houver aplicação e sandbox, devem ser testes curtos, determinísticos e bloqueantes. |
| Pull request | P0 | Idempotência de notificação repetida | Previne cobranças, pedidos e concessões de acesso duplicados; deve ser bloqueante se a implementação do consumidor de notificação estiver disponível. |
| Execução noturna | P1 | Atraso/falha de notificação; notificações simultâneas; divergência de moeda/valor; dados de transação ausentes | Cobrem processamento assíncrono, concorrência e entradas negativas; são adequados a ambientes de integração controlados, com capacidade de repetir e observar eventos. |
| Pré-release | P1 | Fluxo aprovado e recusado ponta a ponta no sandbox oficial, incluindo verificação dos dados registrados e do acesso | Valida o contrato externo completo antes de liberar, mas depende de credenciais geridas como segredos, estabilidade do sandbox e dados de teste isolados. |

## Critérios operacionais

- Não bloquear builds com testes que dependam de um PayPal real enquanto o ambiente e as credenciais de sandbox não forem disponibilizados.
- Evitar chamadas ao provedor em cada execução unitária; usar contratos e doubles controlados para feedback rápido e reservar a integração externa para uma etapa dedicada.
- Garantir isolamento dos pedidos e transações de teste e nunca usar dados de cartão reais.
- Tratar status, valores, moeda, IDs e concessão de acesso como verificações correlacionadas do mesmo pedido; não considerar redirecionamento como prova de pagamento.
- Definir o tempo máximo de espera da confirmação assíncrona com base nos critérios de aceite da US-042 original antes de automatizar o SLA.

## Pendência de requisitos

Anexar a US-042 original e seus critérios de aceite para validar nomenclatura de status, regras de cancelamento/recusa, tratamento de notificações inválidas e prazo de confirmação. Até lá, esses cenários devem ser revisados pelo responsável de produto antes de virarem critérios de aceite executáveis.
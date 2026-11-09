# language: pt
@US-042 @pagamento @paypal
Funcionalidade: Pagamento de cursos utilizando PayPal
  Para adquirir um curso com segurança
  Como aluno
  Quero pagar o pedido utilizando PayPal

  Cenário: Redirecionar o aluno ao ambiente seguro do PayPal
    Dado que o aluno possui um curso no carrinho
    E selecionou PayPal como método de pagamento
    Quando confirmar a compra
    Então deverá ser redirecionado ao ambiente seguro do PayPal
    E o pedido deverá permanecer associado à tentativa de pagamento

  Cenário: Aprovar o pagamento e liberar o curso
    Dado que o aluno iniciou o pagamento de um pedido em BRL pelo PayPal
    Quando a confirmação válida do pagamento for recebida
    Então o pedido deverá apresentar o status "Pagamento Aprovado"
    E o aluno deverá receber acesso ao curso adquirido
    E o pedido deverá conter os identificadores da transação e do pedido

  Cenário: Registrar os dados financeiros da transação aprovada
    Dado que o PayPal confirmou o pagamento de um pedido
    Quando os dados da transação forem registrados
    Então a moeda deverá ser BRL
    E o valor deverá corresponder ao total do pedido
    E deverão ser registrados o ID do pedido, o ID da transação e a data e hora

  Cenário: Cancelar o pagamento no ambiente PayPal
    Dado que o aluno foi redirecionado ao ambiente seguro do PayPal
    Quando cancelar o pagamento
    Então o pagamento não deverá ser marcado como aprovado
    E os itens do curso deverão permanecer no carrinho
    E o acesso ao curso não deverá ser liberado

  Cenário: Recusar o pagamento
    Dado que o aluno iniciou o pagamento de um pedido pelo PayPal
    Quando o PayPal recusar a transação
    Então o pedido não deverá apresentar o status "Pagamento Aprovado"
    E o acesso ao curso não deverá ser liberado
    E o aluno deverá ser informado de que o pagamento não foi aprovado

  Cenário: Ignorar uma notificação repetida do mesmo pagamento
    Dado que uma notificação válida já confirmou uma transação
    Quando a mesma notificação for recebida novamente para o mesmo ID de transação
    Então o pedido deverá continuar com uma única confirmação de pagamento
    E o acesso ao curso não deverá ser duplicado

  Cenário: Não liberar o curso enquanto a notificação estiver atrasada
    Dado que o aluno concluiu a etapa de pagamento no PayPal
    E a confirmação assíncrona ainda não foi recebida
    Quando consultar o estado do pedido
    Então o pagamento não deverá ser apresentado como aprovado
    E o curso não deverá estar acessível
    Quando a confirmação válida for recebida
    Então o pedido deverá ser atualizado para "Pagamento Aprovado"
    E o acesso ao curso deverá ser liberado

  Cenário: Processar notificações duplicadas recebidas simultaneamente
    Dado que duas notificações válidas da mesma transação chegam simultaneamente
    Quando ambas forem processadas
    Então deverá existir somente uma confirmação efetiva para o pedido
    E o curso deverá ser liberado uma única vez

  Cenário: Não aprovar uma transação com valor divergente
    Dado que o valor informado na confirmação difere do total do pedido
    Quando a notificação de pagamento for processada
    Então o pedido não deverá ser marcado como "Pagamento Aprovado"
    E o acesso ao curso não deverá ser liberado

  Cenário: Não aprovar uma transação em moeda diferente de BRL
    Dado que o pedido foi apresentado ao aluno em BRL
    E a confirmação recebida informa uma moeda diferente de BRL
    Quando a notificação de pagamento for processada
    Então o pedido não deverá ser marcado como "Pagamento Aprovado"
    E o acesso ao curso não deverá ser liberado

  Cenário: Não liberar o curso quando faltarem dados de identificação da transação
    Dado que uma notificação de pagamento não contém o ID da transação ou o ID do pedido
    Quando a notificação for processada
    Então o pedido não deverá ser marcado como "Pagamento Aprovado"
    E o acesso ao curso não deverá ser liberado
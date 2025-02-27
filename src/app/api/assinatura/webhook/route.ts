import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (body.action === 'payment.updated') {
    try {
      const paymentId = body.data.id
      const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
          },
        }
      )

      const payment = await response.json()

      if (payment.status === 'approved') {
        // Atualiza o status do usuário no banco de dados
        // await prisma.user.update({
        //   where: { email: payment.payer.email },
        //   data: { subscriptionStatus: "ATIVO" },
        // });
        console.log('Foi pago')
      }

      console.log('Chegou no web')

      return Response.json({ message: 'Pagamento processado com sucesso' })
    } catch (error) {
      return Response.json({ error: 'Erro ao processar pagamento' })
    }
  }

  return Response.json({ body })
}

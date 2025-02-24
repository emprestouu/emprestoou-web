import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_ACCESS_TOKEN_TEST_KEY as string,
  options: { timeout: 5000 },
})

export async function POST(req: Request) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const body = await req.json()

  const payment = new Payment(client)

  const data = {
    transaction_amount: 9000,
    description: body.plan as string,
    payment_method_id: 'pix',
    payer: {
      email: body.email as string,
    },
  }

  const generateIdempotencyKey = () => {
    return `${Date.now()} - ${Math.random().toString(36).substring(2, 15)}`
  }

  const requestOptions = {
    idempotencyKey: generateIdempotencyKey(),
  }

  const result = await payment
    .create({ body: data, requestOptions })
    .then((data) => data)
    .catch(console.log)

  return Response.json({ result })
}

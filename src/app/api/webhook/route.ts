import { NextApiRequest } from "next";

export async function POST(req: NextApiRequest) {
  const webhookSecret = req.headers["x-signature"]
  if (webhookSecret !== process.env.MERCADO_PAGO_WEBHOOK_SECRET) {
    // return res.status(401).json({ error: "Não autorizado" });
  }
}
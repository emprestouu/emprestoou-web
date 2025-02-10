import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const id = req.url?.split('/') || ''
  const cliente = await prisma.cliente.findUnique({
    where: { id: String(id[5])},
  });

  if (!cliente) {
    // return res.status(404).json({ error: "Cliente não encontrado" });
  }

  const parcelas = await prisma.parcela.findMany({
    where: { contrato: { clienteId: String(id) } },
    orderBy: { dataVencimento: "asc" },
  });

  return Response.json({ cliente, parcelas }, { status: 200 });

}
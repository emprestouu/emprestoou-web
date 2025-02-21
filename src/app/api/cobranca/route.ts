import { prisma } from "@/lib/prisma"
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type")
  if(type === "all") {
    const parcelas = await prisma.parcela.findMany({
      where: {
        status: "PENDENTE",
      },
      include: {
        contrato: { include: { cliente: true } },
      },
    });

    return Response.json(parcelas, { status: 200 })
  }

  if(type === "today") {
    const hoje = format(new Date(), "yyyy-MM-dd", { locale: ptBR });

    const parcelas = await prisma.parcela.findMany({
      where: {
        dataVencimento: { equals: new Date(hoje) },
        status: "PENDENTE",
      },
      include: {
        contrato: { include: { cliente: true } },
      },
    });

    return Response.json(parcelas, { status: 200 })
  }
}
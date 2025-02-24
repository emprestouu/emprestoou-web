import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.url?.split('/') || ''
  const contratoEmprestimo = await prisma.contratoDeEmprestimo.findUnique({
    where: { id: String(id[5])},
    include: { cliente: true },
  });

  if (!contratoEmprestimo) {
    // return res.status(404).json({ error: "Cliente não encontrado" });
  }

  const parcelas = await prisma.parcela.findMany({
    where: { contratoId: String(id[5]) },
    orderBy: { dataVencimento: "asc" },
  });

  return Response.json({ contratoEmprestimo, parcelas }, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const id = req.url?.split('/') || ''

  const parcelaAtualizada = await prisma.parcela.update({
    where: { id: String(id[5]) },
    data: { status: "PAGA", dataPagamento: new Date() },
  });

  const parcelasRestantes = await prisma.parcela.findMany({
    where: {
      contratoId: parcelaAtualizada.contratoId,
      status: { not: "PAGA" },
    },
  });

  if (parcelasRestantes.length === 0) {
    await prisma.contratoDeEmprestimo.update({
      where: { id: parcelaAtualizada.contratoId },
      data: { status: "QUITADO" },
    });
  }

  return Response.json(parcelaAtualizada, { status: 200 });
}
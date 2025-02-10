import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const totalEmprestado = await prisma.contratoDeEmprestimo.aggregate({
      _sum: { valorTotal: true },
    });

    const totalReceber = await prisma.parcela.aggregate({
      _sum: { valor: true },
      where: { status: "PENDENTE" },
    });

    const dinheiroMovimentado = await prisma.movimentacaoFinanceira.aggregate({
      _sum: { valor: true },
    });

    const totalInadimplente = await prisma.contratoDeEmprestimo.count({
      where: { status: "INADIMPLENTE" },
    });

    const totalContratos = await prisma.contratoDeEmprestimo.count();

    const inadimplencia = totalContratos > 0
      ? (totalInadimplente / totalContratos) * 100
      : 0;

    Response.json({
      totalEmprestado: totalEmprestado._sum.valorTotal || 0,
      totalReceber: totalReceber._sum.valor || 0,
      dinheiroMovimentado: dinheiroMovimentado._sum.valor || 0,
      inadimplencia: inadimplencia,
    }, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    Response.json({ error: "Erro ao buscar dados do dashboard" }, { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";
import { NextApiRequest } from "next";

export async function GET(req: NextApiRequest, { params }: { params: Promise<{ id: string }>}) {
  const id = (await params).id
    const cliente = await prisma.cliente.findUnique({
      where: { id: String(id) },
      include: { contratos: true },
    });
  
    // console.log(cliente)
  
    if (!cliente) {
      return Response.json({ error: "Cliente não encontrado" }, { status: 404});
    }
  
    const emprestimosAtivos = cliente.contratos.filter((c) => c.status === "ATIVO").length;
    const totalDevido = cliente.contratos
      .filter((c) => c.status === "ATIVO" || c.status === "INADIMPLENTE")
      .reduce((acc, c) => acc + Number(c.valorTotal), 0);
  
    return Response.json({
      nome: cliente.nome,
      status: cliente.status,
      emprestimosAtivos,
      totalDevido,
    }, { status: 200});
}
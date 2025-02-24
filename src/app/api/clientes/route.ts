import { prisma } from "@/lib/prisma";
import { Cliente } from "@prisma/client";


export async function GET() {
  const clientes = await prisma.cliente.findMany()
  return Response.json(clientes, { status: 200 })
}

export async function POST(req: Request) {
  const body = await req.json() as Cliente | null
  const { nome, cpf, telefone, endereco, email } = body as Cliente;
  
  try {
    const novoCliente = await prisma.cliente.create({
      data: { nome, cpf, telefone, endereco, email, status: "ATIVO" } as Cliente,
    });

    return Response.json(novoCliente, { status: 201});
   
  } catch (error) {
    console.log(error)
    return Response.json({ error: "Erro ao criar cliente" }, { status: 500 });
  }
}


// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "GET") {
//     const clientes = await prisma.cliente.findMany();
//     return res.status(200).json(clientes);
//   }

//   if (req.method === "POST") {
//     const { nome, cpf, telefone, endereco, email } = req.body;
//     const novoCliente = await prisma.cliente.create({
//       data: { nome, cpf, telefone, endereco, email, status: "ATIVO" },
//     });
//     return res.status(201).json(novoCliente);
//   }

//   res.status(405).json({ error: "Método não permitido" });
// }

// export async 
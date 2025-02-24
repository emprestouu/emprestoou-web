import { prisma } from '@/lib/prisma'
import { Parcela, Prisma } from '@prisma/client'

export async function GET() {
    const emprestimos = await prisma.contratoDeEmprestimo.findMany({
        include: { cliente: true },
    })
    return Response.json(emprestimos, { status: 200 })
}

export async function POST(req: Request) {
    const body = await req.json()
    const {
        clienteId,
        valorTotal,
        juros,
        quantidadeParcelas,
        tipoParcelamento,
        dataInicio,
        status,
    } = body

    const totalComJuros = valorTotal + valorTotal * (juros / 100)
    const valorParcela = totalComJuros / quantidadeParcelas

    const novoEmprestimo = await prisma.contratoDeEmprestimo.create({
        data: {
            clienteId,
            valorTotal,
            juros,
            quantidadeParcelas,
            tipoParcelamento,
            status,
            valorParcela,
        },
    })

    const parcelas = []
    const dataVencimento = new Date(dataInicio)

    for (let i = 1; i <= quantidadeParcelas; i++) {
        if (tipoParcelamento === 'DIARIO') {
            dataVencimento.setDate(dataVencimento.getDate() + 1)
        } else if (tipoParcelamento === 'MENSAL') {
            dataVencimento.setMonth(dataVencimento.getMonth() + 1)
        } else if (tipoParcelamento === 'SEMESTRAL') {
            dataVencimento.setMonth(dataVencimento.getMonth() + 6)
        }

        parcelas.push({
            contratoId: novoEmprestimo.id,
            dataVencimento: new Date(dataVencimento),
            valor: new Prisma.Decimal(valorParcela),
            status: 'PENDENTE',
            dataPagamento: null,
        })
    }

    await prisma.parcela.createMany({ data: parcelas as Parcela[] })

    return Response.json(
        { message: 'Empréstimo e parcelas criados com sucesso!' },
        { status: 201 }
    )
}

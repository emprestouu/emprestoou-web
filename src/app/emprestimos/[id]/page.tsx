'use client'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Cliente, ContratoDeEmprestimo, Parcela } from '@prisma/client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Parcelas() {
    const { id } = useParams()
    const [parcelas, setParcelas] = useState<Parcela[]>([])
    const [cliente, setCliente] = useState<Cliente>({} as Cliente)
    const [contrato, setContrato] = useState<ContratoDeEmprestimo>(
        {} as ContratoDeEmprestimo
    )
    const [parcelaSelecionada, setParcelaSelecionada] = useState<Parcela>(
        {} as Parcela
    )
    const [modalOpen, setModalOpen] = useState(false)

    const handleSelecionarParcela = (parcela: Parcela) => {
        setParcelaSelecionada(parcela)
        setModalOpen(true)
    }

    const handleFecharModal = () => {
        setModalOpen(false)
        setParcelaSelecionada({} as Parcela)
    }

    const handlePagarParcela = async () => {
        if (!parcelaSelecionada) return

        try {
            await fetch(`/api/emprestimos/${parcelaSelecionada.id}/parcelas`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'PAGA' }),
            })

            setParcelas(
                parcelas.map((p) =>
                    p.id === parcelaSelecionada.id
                        ? { ...p, status: 'PAGA' }
                        : p
                )
            )
            handleFecharModal()
        } catch (error) {
            console.error('Erro ao pagar parcela', error)
        }
    }

    useEffect(() => {
        async function fetchParcelas() {
            const res = await fetch(`/api/emprestimos/${id}/parcelas`)
            const data = await res.json()
            setParcelas(data.parcelas)
            setCliente(data.contratoEmprestimo.cliente)
            setContrato(data.contratoEmprestimo)
        }
        fetchParcelas()
    }, [id])

    const totalParcelas = parcelas.length
    const parcelasPagas = parcelas.filter((p) => p.status === 'PAGA').length
    const progresso =
        totalParcelas > 0 ? (parcelasPagas / totalParcelas) * 100 : 0
    return (
        <div className="p-6">
            <div className="flex flex-col justify-between items-start mb-4">
                <h1 className="text-2xl font-bold">Empréstimo</h1>
                <h2>Nome: {cliente.nome}</h2>
                <p>Juros do empréstimo: {String(contrato.juros)}%</p>
                <p>Data de inicio: {String(contrato.dataContrato)}%</p>
                <p>Tipo de parcelamento: {String(contrato.tipoParcelamento)}</p>
                <p>Valor das parcelas: R$ {String(contrato.valorParcela)}</p>
                <p>Status: {String(contrato.status)}</p>
            </div>

            <div className="flex flex-col justify-between mb-4">
                <h1 className="text-2xl font-bold mb-4">Parcelas</h1>
                <div>
                    <p className="text-sm font-medium">
                        Progresso do Pagamento ({parcelasPagas}/{totalParcelas})
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                        <div
                            className="h-4 rounded-full bg-green-500 transition-all"
                            style={{ width: `${progresso}%` }}
                        ></div>
                    </div>
                </div>
                <div className="grid grid-cols-5 py-4 gap-2">
                    {parcelas.map((parcela, index) => (
                        <Button
                            key={parcela.id}
                            className={`flex flex-col items-center p-4 border rounded-lg text-sm transition h-20 ${
                                parcela.status === 'PAGA'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-black'
                            }`}
                            onClick={() => handleSelecionarParcela(parcela)}
                        >
                            <span className="text-lg font-bold">
                                #{index + 1}
                            </span>
                            <span className="text-xs">{parcela.status}</span>
                            <span className="text-xs">
                                {new Date(
                                    parcela.dataVencimento
                                ).toLocaleDateString('pt-BR')}
                            </span>
                        </Button>
                    ))}
                    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirmar Pagamento</DialogTitle>
                            </DialogHeader>
                            {parcelaSelecionada && (
                                <div className="space-y-2">
                                    <p>
                                        <strong>Valor:</strong> R${' '}
                                        {String(parcelaSelecionada.valor)}
                                    </p>
                                    <p>
                                        <strong>Data de Vencimento:</strong>{' '}
                                        {new Date(
                                            parcelaSelecionada.dataVencimento
                                        ).toLocaleDateString('pt-BR')}
                                    </p>
                                    <p>
                                        <strong>Status:</strong>{' '}
                                        {parcelaSelecionada.status}
                                    </p>
                                    {parcelaSelecionada.status !== 'PAGA' && (
                                        <div className="flex gap-4">
                                            <Button
                                                onClick={handlePagarParcela}
                                                className="bg-green-600 text-white w-full"
                                            >
                                                Cobrar cliente
                                            </Button>
                                            <Button
                                                onClick={handlePagarParcela}
                                                className="bg-blue-600 text-white w-full"
                                            >
                                                Marcar como Paga
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}

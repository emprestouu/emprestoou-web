'use client'
import { Button } from "@/components/ui/button";
import { Parcela } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Parcelas () {
    const { id } = useParams();
    const [parcelas, setParcelas] = useState<Parcela[]>([]);
    const [cliente, setCliente] = useState(null);
    const [parcelaSelecionada, setParcelaSelecionada] = useState(null);
  
    useEffect(() => {
      async function fetchParcelas() {
        const res = await fetch(`/api/clientes/${id}/parcelas`);
        const data = await res.json();
        setParcelas(data.parcelas);
        setCliente(data.cliente);
        console.log(data)
      }
      fetchParcelas();
    }, [id]);
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Empréstimo</h1>
      </div>

      <div className="flex flex-col justify-between mb-4">
        <h1 className="text-2xl font-bold">Parcelas</h1>
        <div className="grid grid-cols-5 py-4 gap-2">
          {parcelas.map((parcela, index) => (
            <Button
              key={parcela.id}
              className={`flex flex-col items-center p-4 border rounded-lg text-sm transition h-20 ${
                parcela.status === "PAGA" ? "bg-green-500 text-white" : "bg-gray-200 text-black"
              }`}
              // onClick={onClick}
            >
              <span className="text-lg font-bold">#{index + 1}</span>
              <span className="text-xs">{parcela.status}</span>
              <span className="text-xs">{new Date(parcela.dataVencimento).toLocaleDateString("pt-BR")}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
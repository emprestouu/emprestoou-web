"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Cobranca() {
  const [parcelas, setParcelas] = useState([]);
  const [parcelasVencidas, setParcelasVencidas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchParcelasVencendoHoje() {
      const res = await fetch("/api/cobranca?type=today");
      const data = await res.json();

      const res2 = await fetch("/api/cobranca?type=all");
      const data2 = await res2.json();

      setParcelas(data);
      setParcelasVencidas(data2);
      setLoading(false);
    }
    fetchParcelasVencendoHoje();
  }, []);

  const handleEnviarMensagem = (telefone: string, nome: string, valor: number) => {
    const mensagem = encodeURIComponent(
      `Olá, ${nome}! Seu pagamento de R$ ${valor} vence hoje. Por favor, entre em contato para regularizar.`
    );
    window.open(`https://wa.me/${telefone}?text=${mensagem}`, "_blank");
  };

  return (
    <div className="p-6">
      
        <h1 className="text-2xl font-bold mb-4">Cobrança</h1>
        <Tabs defaultValue="hoje">
        <TabsList>
          <TabsTrigger value="hoje">Vencimento hoje</TabsTrigger>
          <TabsTrigger value="vencidas">Vencidas</TabsTrigger>
        </TabsList>
        <TabsContent value="hoje">
        {loading ? (
          <p>Carregando...</p>
        ) : parcelas.length === 0 ? (
          <p className="text-gray-500">Nenhuma parcela vencendo hoje.</p>
        ) : (
          <div className="space-y-4">
            {parcelas.map((parcela: any) => (
              <div key={parcela.id} className="flex justify-between items-center p-4 border rounded-lg shadow">
                <div>
                  <p className="font-semibold">{parcela.contrato.cliente.nome}</p>
                  <p className="text-gray-500">Valor: R$ {parcela.valor}</p>
                  <p className="text-gray-500">Vencimento: {parcela.dataVencimento}</p>
                </div>
                <Button
                  className="bg-green-600 text-white"
                  onClick={() => handleEnviarMensagem(parcela.contrato.cliente.telefone, parcela.contrato.cliente.nome, parcela.valor)}
                >
                  Cobrar via WhatsApp
                </Button>
              </div>
            ))}
          </div>
        )}
        </TabsContent>
        <TabsContent value="vencidas">
        <div className="space-y-4">
          {parcelasVencidas.map((parcela: any) => (
            <div key={parcela.id} className="flex justify-between items-center p-4 border rounded-lg shadow">
              <div>
                <p className="font-semibold">{parcela.contrato.cliente.nome}</p>
                <p className="text-gray-500">Valor: R$ {parcela.valor}</p>
                <p className="text-gray-500">Vencimento: {parcela.dataVencimento}</p>
              </div>
              <Button
                className="bg-green-600 text-white"
                onClick={() => handleEnviarMensagem(parcela.contrato.cliente.telefone, parcela.contrato.cliente.nome, parcela.valor)}
              >
                Cobrar via WhatsApp
              </Button>
            </div>
          ))}
        </div>
        </TabsContent>
        </Tabs>
    </div>
  );
}

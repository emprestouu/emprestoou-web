"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const locales = { "pt-BR": require("date-fns/locale/pt-BR") };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function ParcelasClientePage() {
  const { id } = useParams();
  const [parcelas, setParcelas] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [parcelaSelecionada, setParcelaSelecionada] = useState(null);

  useEffect(() => {
    async function fetchParcelas() {
      const res = await fetch(`/api/clientes/${id}/parcelas`);
      const data = await res.json();
      setParcelas(data.parcelas);
      setCliente(data.cliente);
    }
    fetchParcelas();
  }, [id]);

  const eventos = parcelas.map((parcela) => ({
    title: `Parcela: R$ ${parcela.valor.toFixed(2)}`,
    start: new Date(parcela.dataVencimento),
    end: new Date(parcela.dataVencimento),
    id: parcela.id,
    status: parcela.status,
  }));

  const handleSelecionarParcela = (event) => {
    const parcela = parcelas.find((p) => p.id === event.id);
    setParcelaSelecionada(parcela);
    setModalOpen(true);
  };

  const handleMarcarComoPaga = async () => {
    await fetch(`/api/parcelas/${parcelaSelecionada.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "PAGA" }),
    });

    setParcelas(parcelas.map((p) =>
      p.id === parcelaSelecionada.id ? { ...p, status: "PAGA" } : p
    ));

    setModalOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Parcelas de {cliente?.nome}</h1>
      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleSelecionarParcela}
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Parcela</DialogTitle>
          </DialogHeader>
          {parcelaSelecionada && (
            <div className="space-y-2">
              <p><strong>Valor:</strong> R$ {parcelaSelecionada.valor.toFixed(2)}</p>
              <p><strong>Data de Vencimento:</strong> {format(new Date(parcelaSelecionada.dataVencimento), "dd/MM/yyyy")}</p>
              <p><strong>Status:</strong> {parcelaSelecionada.status}</p>

              {parcelaSelecionada.status !== "PAGA" && (
                <Button onClick={handleMarcarComoPaga}>Marcar como Paga</Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

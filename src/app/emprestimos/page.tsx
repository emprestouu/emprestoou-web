"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Trash2, Pencil, Info } from "lucide-react";
import { ContratoDeEmprestimo } from "@prisma/client";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";

export default function EmprestimosPage() {
  const [emprestimos, setEmprestimos] = useState<ContratoDeEmprestimo[]>([]);
  const [clienteSituacao, setClienteSituacao] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchEmprestimos() {
      const res = await fetch("/api/emprestimos");
      const data = await res.json();
      setEmprestimos(data);
    }
    fetchEmprestimos();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este empréstimo?")) return;

    await fetch(`/api/emprestimos/${id}`, { method: "DELETE" });
    setEmprestimos(emprestimos.filter((emprestimo) => emprestimo.id !== id));
  };

  const handleVerSituacao = async (clienteId: string) => {
    const res = await fetch(`/api/clientes/${clienteId}`);
    const data = await res.json();
    setClienteSituacao(data);
    setModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Empréstimos</h1>
        <Button asChild>
          <Link href="/emprestimos/novo">+ Novo Empréstimo</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Valor Total</TableHead>
            <TableHead>Parcelas</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emprestimos.length > 0 ? (
            emprestimos.map((emprestimo) => (
              <TableRow key={emprestimo.id}>
                <TableCell>{emprestimo.clienteId}</TableCell>
                <TableCell>R$ {emprestimo.valorTotal.toString()}</TableCell>
                <TableCell>{emprestimo.quantidadeParcelas}</TableCell>
                <TableCell>{emprestimo.status}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/emprestimos/${emprestimo.id}/editar`}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(emprestimo.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="secondary" onClick={() => handleVerSituacao(emprestimo.clienteId)}>
                          <Info className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Situação do Cliente</DialogTitle>
                        </DialogHeader>
                        {clienteSituacao ? (
                          <div className="space-y-2">
                            <p><strong>Nome:</strong> {clienteSituacao.nome}</p>
                            <p><strong>Status:</strong> {clienteSituacao.status}</p>
                            <p><strong>Empréstimos Ativos:</strong> {clienteSituacao.emprestimosAtivos}</p>
                            <p><strong>Total Devido:</strong> R$ {clienteSituacao.totalDevido.toFixed(2)}</p>
                          </div>
                        ) : (
                          <p>Carregando...</p>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Nenhum empréstimo encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

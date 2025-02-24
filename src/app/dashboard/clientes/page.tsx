"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Trash2, Pencil } from "lucide-react";
import { Cliente } from "@prisma/client";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    async function fetchClientes() {
      const res = await fetch("/api/clientes");
      const data = await res.json();
      setClientes(data);
    }
    fetchClientes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;

    await fetch(`/api/clientes/${id}`, { method: "DELETE" });
    setClientes(clientes.filter((cliente) => cliente.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button asChild>
          <Link href="/dashboard/clientes/novo">+ Novo Cliente</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.length > 0 ? (
            clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.nome}</TableCell>
                <TableCell>{cliente.cpf}</TableCell>
                <TableCell>{cliente.telefone}</TableCell>
                <TableCell>{cliente.status}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/clientes/${cliente.id}/editar`}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(cliente.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Nenhum cliente encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

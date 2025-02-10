"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function NovoCliente() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    endereco: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erro ao cadastrar cliente");

      router.push("/clientes");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Cadastrar Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="nome" placeholder="Nome" required onChange={handleChange} />
            <Input name="cpf" placeholder="CPF" required onChange={handleChange} />
            <Input name="telefone" placeholder="Telefone" required onChange={handleChange} />
            <Input name="endereco" placeholder="Endereço" required onChange={handleChange} />
            <Input name="email" placeholder="E-mail (opcional)" type="email" onChange={handleChange} />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Salvando..." : "Cadastrar Cliente"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

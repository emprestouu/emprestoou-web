"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function NovoEmprestimo() {
  const router = useRouter();
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    clienteId: "",
    valorTotal: "",
    juros: "",
    quantidadeParcelas: "",
    valorParcela: "",
    tipoParcelamento: "MENSAL",
    dataInicio: new Date().toISOString().split("T")[0],
    status: "ATIVO",
  });
  const [lucro, setLucro] = useState(0);
  const [dataFinal, setDataFinal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchClientes() {
      const res = await fetch("/api/clientes");
      const data = await res.json();
      setClientes(data);
    }
    fetchClientes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "valorTotal" || name === "juros") {
      const valorTotal = parseFloat(name === "valorTotal" ? value : formData.valorTotal) || 0;
      const juros = parseFloat(name === "juros" ? value : formData.juros) || 0;
      setLucro(valorTotal * (juros / 100));
    }

    if (name === "valorTotal" || name === "juros" || name === "quantidadeParcelas" || name === "tipoParcelamento") {
      calcularValores(
        parseFloat(name === "valorTotal" ? value : formData.valorTotal),
        parseFloat(name === "juros" ? value : formData.juros),
        parseInt(name === "quantidadeParcelas" ? value : formData.quantidadeParcelas),
        name === "tipoParcelamento" ? value : formData.tipoParcelamento,
      );
    }

    if (name === "quantidadeParcelas" || name === "tipoParcelamento" || name === "dataInicio") {
      calcularDataFinal(
        parseInt(name === "quantidadeParcelas" ? value : formData.quantidadeParcelas),
        name === "tipoParcelamento" ? value : formData.tipoParcelamento,
        name === "dataInicio" ? value : formData.dataInicio
      );
    }
  }
  
  const calcularValores = (valorTotal: number, juros: number, parcelas: number, tipoParcelamento: string) => {
    if (!valorTotal || !juros || !parcelas) {
      setLucro(0);
      setFormData((prev) => ({ ...prev, valorParcela: "" }));
      return;
    }

    const totalComJuros = valorTotal + valorTotal * (juros / 100);
    const valorParcela = totalComJuros / parcelas;

    // if (tipoParcelamento === "DIARIO") {
    //   valorParcela = totalComJuros;
    // } else if (tipoParcelamento === "SEMESTRAL") {
    //   valorParcela = totalComJuros / (parcelas / 6);
    // }

    setLucro(valorTotal * (juros / 100));
    setFormData((prev) => ({ ...prev, valorParcela: valorParcela.toFixed(2) }));
  };;

  const calcularDataFinal = (parcelas: number, tipo: string, dataInicio: string) => {
    if (!parcelas || !tipo || !dataInicio) return;

    const data = new Date(dataInicio);
    if (tipo === "DIARIO") data.setDate(data.getDate() + parcelas);
    if (tipo === "MENSAL") data.setMonth(data.getMonth() + parcelas);
    if (tipo === "SEMESTRAL") data.setMonth(data.getMonth() + parcelas * 6);

    setDataFinal(data.toISOString().split("T")[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/emprestimos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          valorTotal: parseFloat(formData.valorTotal),
          juros: parseFloat(formData.juros),
          quantidadeParcelas: parseInt(formData.quantidadeParcelas),
          valorParcela: parseFloat(formData.valorParcela),
          dataFinal,
        }),
      });

      if (!res.ok) throw new Error("Erro ao cadastrar empréstimo");

      router.push("/emprestimos");
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
          <CardTitle>Cadastrar Empréstimo</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Cliente</label>
              <Select onValueChange={(value) => setFormData({ ...formData, clienteId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente: any) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Valor Total</label>
              <Input name="valorTotal" type="number" required onChange={handleChange} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Juros (%)</label>
              <Input name="juros" type="number" required onChange={handleChange} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Quantidade de Parcelas</label>
              <Input name="quantidadeParcelas" type="number" required onChange={handleChange} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Tipo de Parcelamento</label>
              <select name="tipoParcelamento" className="border p-2 rounded" onChange={handleChange}>
                <option value="MENSAL">Mensal</option>
                <option value="DIARIO">Diário</option>
                <option value="SEMESTRAL">Semestral</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Data de Início</label>
              <Input name="dataInicio" type="date" value={formData.dataInicio} required onChange={handleChange} />
            </div>

            <div className="p-3 border rounded-lg bg-gray-100">
              <p className="text-gray-700 text-sm">Data Final do Contrato:</p>
              <p className="text-xl font-bold text-blue-600">{dataFinal || "Selecione a quantidade de parcelas"}</p>
            </div>

            <div className="p-3 border rounded-lg bg-gray-100">
              <p className="text-gray-700 text-sm">Valor da parcela:</p>
              <p className="text-xl font-bold text-green-600">R$ {formData.valorParcela || "Selecione a quantidade de parcelas"}</p>
            </div>

            <div className="p-3 border rounded-lg bg-gray-100">
              <p className="text-gray-700 text-sm">Lucro estimado:</p>
              <p className="text-xl font-bold text-green-600">R$ {lucro.toFixed(2)}</p>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Salvando..." : "Cadastrar Empréstimo"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

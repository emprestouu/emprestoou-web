"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
// import { prisma } from "@/lib/prisma"; 

export default function Dashboard() {
  const [data, setData] = useState({
    totalEmprestado: 0,
    totalReceber: 0,
    dinheiroMovimentado: 0,
    inadimplencia: 0,
  });

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      setData(json);
    }
    fetchData();
  }, []);

  const chartData = [
    { name: "Emprestado", value: data.totalEmprestado },
    { name: "Receber", value: data.totalReceber },
    { name: "Movimentado", value: data.dinheiroMovimentado },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Financeiro</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Valor Investido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">R$ {data.totalEmprestado.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total a Receber</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">R$ {data.totalReceber.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dinheiro Movimentado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">R$ {data.dinheiroMovimentado.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inadimplência</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.inadimplencia.toFixed(2)}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Resumo Financeiro</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

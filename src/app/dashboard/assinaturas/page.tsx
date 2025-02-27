'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Assinatura() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('INATIVO')
  const [message, setMessage] = useState('')
  const [pixCode, setPixCode] = useState('')
  const [qrcode, setQrCode] = useState('')

  useEffect(() => {
    async function fetchSubscriptionStatus() {
      try {
        const res = await fetch('/api/assinatura/status')
        const data = await res.json()
        setStatus(data.status)
      } catch (error) {
        console.error('Erro ao buscar status da assinatura', error)
      }
    }
    fetchSubscriptionStatus()
  }, [])

  const handle = () => {}

  const handleGerarPix = async (plano: string) => {
    setLoading(true)
    setPixCode('')
    setQrCode('')

    try {
      const res = await fetch('/api/assinatura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: plano,
          email: 'crowofcode@gmail.com',
        }),
      })

      const data = await res.json()
      console.log(data)
      setPixCode(data.result.point_of_interaction.transaction_data.qr_code)
      setQrCode(
        `data:image/png;base64,${data.result.point_of_interaction.transaction_data.qr_code_base64}`
      )
    } catch (error) {
      setMessage('Erro ao gerar PIX.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Escolha seu Plano</h1>

      {message && (
        <p className={`text-${status === 'ATIVO' ? 'green' : 'red'}-600`}>
          {message}
        </p>
      )}

      <div className="flex gap-12">
        <div className="grid gap-4 w-[60%]">
          <div className="border p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold">Plano Gratuito</h2>
            <p className="text-gray-600">
              Teste grátis com funcionalidades limitadas.
            </p>
            <p className="text-green-600 font-bold">Status: ATIVO</p>
            <Button className="w-full bg-gray-400 text-white mt-2">
              Plano Ativo
            </Button>
          </div>

          <div className="border p-4 rounded-lg shadow-md w-40%">
            <h2 className="text-lg font-bold">Plano Intermediário</h2>
            <p className="text-gray-600">Até 15 contratos por mês.</p>
            <p className="font-bold">R$ 37,90/mês</p>
            {status !== 'INTERMEDIARIO' && (
              <Button
                onClick={() => handleGerarPix('INTERMEDIARIO')}
                disabled={loading}
                className="bg-blue-600 text-white w-full mt-2"
              >
                {loading ? 'Gerando PIX...' : 'Pagar via PIX'}
              </Button>
            )}
          </div>

          {/* Plano Ilimitado */}
          <div className="border p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold">Plano Ilimitado</h2>
            <p className="text-gray-600">Contratos ilimitados.</p>
            <p className="font-bold">R$ 89,90/mês</p>
            {status !== 'ILIMITADO' && (
              <Button
                onClick={() => handleGerarPix('ILIMITADO')}
                disabled={loading}
                className="bg-green-600 text-white w-full mt-2"
              >
                {loading ? 'Gerando PIX...' : 'Pagar via PIX'}
              </Button>
            )}
          </div>
        </div>

        {/* PIX Gerado */}
        {pixCode && (
          <div className="p-4 border rounded-lg shadow-md bg-gray-100">
            <h2 className="text-lg font-bold">Pagamento via PIX</h2>
            <p className="text-gray-600">
              Escaneie o QR Code ou copie o código abaixo:
            </p>
            <Image
              src={qrcode}
              alt="QR Code PIX"
              width={480}
              height={480}
              className="mx-auto my-4"
            />
            <textarea
              className="w-full p-2 border rounded-md bg-white"
              value={pixCode}
              readOnly
            />
            <Button
              onClick={() => navigator.clipboard.writeText(pixCode)}
              className="w-full bg-gray-700 text-white mt-2"
            >
              Copiar Código PIX
            </Button>

            <Button
              onClick={() => handleGerarPix('ILIMITADO')}
              disabled={loading}
              className="bg-green-600 text-white w-full mt-2"
            >
              {loading ? 'Gerando PIX...' : 'Pagar via PIX'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

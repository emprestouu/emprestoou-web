'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserProfile } from '@clerk/nextjs'

export default function Configuracoes() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    whatsappMessage: '',
    subscriptionStatus: 'INATIVO',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/configuracoes')
        const data = await res.json()
        setFormData({
          name: data.name,
          email: data.email,
          password: '',
          whatsappMessage: data.whatsappMessage,
          subscriptionStatus: data.subscriptionStatus,
        })

        if (searchParams.get('status') === 'success') {
          setMessage('Assinatura ativada com sucesso!')
        }
      } catch (error) {
        console.error('Erro ao carregar usuário', error)
      }
    }
    fetchUser()
  }, [searchParams])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/configuracoes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Erro ao atualizar perfil')

      setMessage('Configurações salvas com sucesso!')
    } catch (err: any) {
      setMessage(err.message || 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const handlePagamento = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: '1234' }), // Substituir pelo ID do usuário real
      })

      const data = await res.json()
      window.location.href = data.url
    } catch (error) {
      setMessage('Erro ao processar pagamento.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Configurações</h1>

      {message && <p className="text-green-600">{message}</p>}
      <Tabs defaultValue="perfil">
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="mensagem">Mensagem de cobrança</TabsTrigger>
          <TabsTrigger value="assinatura">Assinatura</TabsTrigger>
        </TabsList>
        <TabsContent value="perfil">
          <div className="mt-10">
            <UserProfile />
          </div>
        </TabsContent>
        <TabsContent value="mensagem">
          <label className="text-sm font-medium text-gray-700">
            Mensagem Padrão do WhatsApp
          </label>
          <Textarea
            name="whatsappMessage"
            value={formData.whatsappMessage}
            placeholder="Digite sua mensagem personalizada"
            onChange={handleChange}
          />

          <p className="text-xs text-gray-500">
            Use <b>{'{nome}'}</b> para o nome do cliente e <b>{'{valor}'}</b>{' '}
            para o valor da parcela.
          </p>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </TabsContent>
        <TabsContent value="assinatura">
          <div className="mt-6">
            <h2 className="text-xl font-bold">Assinatura</h2>
            <p
              className={`font-semibold ${
                formData.subscriptionStatus === 'ATIVO'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              Status: {formData.subscriptionStatus}
            </p>

            {formData.subscriptionStatus !== 'ATIVO' && (
              <Button
                onClick={handlePagamento}
                disabled={loading}
                className="bg-blue-600 text-white w-full mt-2"
              >
                {loading ? 'Processando...' : 'Pagar Assinatura'}
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

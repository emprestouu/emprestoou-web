import { Button } from '@/components/ui/button'
import { SignInButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function RootPage() {
  const { actor } = await auth()

  if (actor) redirect('/dashboard')

  return (
    <div className="h-screen w-full flex">
      <div className="h-full w-[40%] flex flex-col px-10 justify-center">
        <h1 className="text-4xl font-bold">Emprestoou</h1>
        <p>Seja bem vindo</p>
        <SignInButton>
          <Button>Fazer login ou criar conta</Button>
        </SignInButton>
      </div>
      <div className="h-full w-[60%] bg-green-400"></div>
    </div>
  )
}

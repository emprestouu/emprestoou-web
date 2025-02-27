import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'

// buscar user id
// buscar no prisa se tem o plano

export async function GET(req: NextRequest) {
  const clerk = await auth()
  const userId = await clerk.userId
  // console.log(user)

  return Response.json({ userId })
}

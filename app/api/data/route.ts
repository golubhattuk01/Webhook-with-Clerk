import { auth , currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = await auth()
  const user = await currentUser()
  const obj = {
    userId,
    user,
  }
  
  if(!userId)
  {
    return NextResponse.json({message: 'You are not logged in'})
  }
  return NextResponse.json({message: 'You are logged in', user: obj})
}
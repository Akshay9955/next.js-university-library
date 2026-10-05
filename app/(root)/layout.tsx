import { auth } from '@/auth';
import Header from '@/components/ui/Header'
import React from 'react'
import { redirect } from 'next/navigation'
import type { Session } from 'next-auth';

const layout = async ({ children }: { children: React.ReactNode }) => {
 const session = await auth();
  if(!session) redirect('/sign-in')

  return <main className='root-container'>
    <div className='mx-auto mx-w-7xl'>
     <Header session={session} />
      <div className="mt-20 pb-20">{children}</div>
      
    </div>
  </main>
}

export default layout

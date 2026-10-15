import { auth } from '@/auth';
import Header from '@/components/ui/Header'
import React from 'react'
import { redirect } from 'next/navigation'
import type { Session } from 'next-auth';
import { after } from 'node:test';
import{ users} from "@/database/schema"
import { db } from '@/database/drizzle';
import { eq } from 'drizzle-orm';


const layout = async ({ children }: { children: React.ReactNode }) => {
 const session = await auth();
  if(!session) redirect('/sign-in')

 after (async()=>{
  if(!session?.user?.id) return;
// get the user and see if the last activity date is to day
const user = await db
 .select()
 .from(users)
 .where(eq(users.id, session?.user?.id)).limit(1);

 if(user[0]
  .lastActivityDate === new Date().toISOString().slice(0,10)
 )return;




  await db
  .update(users)
   .set({lastActivityDate: new Date().toISOString().slice(0,10)})
   .where(eq(users.id, session?.user?.id)) 
 })
     
  return <main className='root-container'>
    <div className='mx-auto mx-w-7xl'>
     <Header session={session} />
      <div className="mt-20 pb-20">{children}</div>
      
    </div>
  </main>
}

export default layout

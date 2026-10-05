"use client"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

import { cn, getInitials } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Session } from "next-auth"
import { get } from "http"

const Header = ({ session }: { session: Session }) => {
  const pathname = usePathname()

  return (
    <header className='flex items-center justify-between gap-10 px-8 py-4'>
      <Link href='/' className='flex items-center gap-3 text-xl font-semibold text-white '>
         <Image src="/icons/logo.svg" alt="logo" width={40} height={40}  />
         <span>BookWise</span>
      </Link>

     <ul className=' flex flex-row items-center gap-8'>
        <li>
          
            <Link href='/library'  className= {cn('text-base cursor-pointer capitalize', pathname === '/library'? 'text-light-200' : 'text-light-100')}>Library</Link>
             
        </li>
      
        <li>
          <Link href={"/my-profile"} >
           <Avatar>
            <AvatarFallback className="bg-amber-100">
              {getInitials(session?.user?.name || "IN")}
            </AvatarFallback>
           </Avatar>
          </Link>
        </li>
     </ul>

    </header >
  )
}

export default Header

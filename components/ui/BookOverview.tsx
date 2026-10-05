import React from 'react'
import Image from 'next/image'
import { Button } from '@base-ui/react'
import BookCover from './BookCover'



const BookOverview = ( { title ,author, genre, rating , totalCopies, availableCopies , description, coverColor, coverUrl  } : Book ) => {
  return (
  
    <section className='book-overview'>
        <div className=' flex flex-1 flex-col gap-5'>
           <h1>{title}</h1>
           <div className=" flex gap-2 text-light-200">
            <p>
              By: <span className='font-semibold text-light-200'>{author} </span> 
            </p>
              <p>
              Category: <span className='font-semibold text-light-200'>{genre}</span> 
            </p>
             <div className='flex flex-row gap-1'>
               <Image src="/icons/star.svg" alt="star" width={22} height={22} />
               <p >{rating}</p>
            </div>
            
        </div>


           <div className='book-copies'>
             <p>
               Total Copies: <span className='font-semibold text-light-200'>{totalCopies}</span>
             </p>
             <p>
               Available Copies: <span className='font-semibold text-light-200'>{availableCopies}</span>
             </p>
           </div>

           <p className='text-light-200'>{description}</p>
           
           <Button className="book-overview_btn bg-amber-200 flex gap-2 items-center justify-center hover:bg-amber-300 transition-all duration-300 px-50">
                 <Image src= "/icons/book.svg" alt="book" width={20} height={20} />
                 <p className='font-bebas-neue text-xl text-dark-100'>Borrow Book</p>
           </Button>

        </div>
        <div className='relative flex flex-1 justify-center '>
          <div className='relative'>
             <BookCover 
             variant="wide"
             className= "z-10"
             coverColor={coverColor}
             coverImage={coverUrl}
             />
             <div className='absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden'>
              <BookCover
             variant="wide"
             className= "z-10"
             coverColor={coverColor}
             coverImage={coverUrl}
              />

             </div>
          </div>
        </div>
    </section>
  )
}

export default BookOverview

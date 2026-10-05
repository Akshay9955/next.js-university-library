import Link from 'next/link'
import BookCover from './BookCover'
import { cn } from '@/lib/utils'
import { input } from 'zod'
import { Button } from './button'
import Image from 'next/image'



const BookCard = ({ id, title, coverColor, coverUrl , genre ,  isLoanedBook = false,}: Book) => {
  return (
        <li>
        <Link href={`/books/${id}`}> 
          <BookCover coverColor={coverColor} coverImage={coverUrl} variant="medium" />
 
          <div className={cn ( "mt-4", !isLoanedBook && "xs:max-w-40 max-w-28")}>
            <p className='book-title'> {title}</p>
            <p className='book-genre'>{genre}</p>
          </div>
         </Link>

           {isLoanedBook && (
        <div className="mt-3 w-full">
          <div className="book-loaned">
            <Image
              src="/icons/calendar.svg"
              alt="calendar"
              width={18}
              height={18}
              className="object-contain"
            />
            <p className="text-light-100">11 days left to return</p>
          </div>

          <Button className="book-btn">Download receipt</Button>
        </div>
      )}

    
    </li>
      
   
  )
}

export default BookCard


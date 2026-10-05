import Booklist from '@/components/ui/Booklist'
import BookOverview from '@/components/ui/BookOverview'
import { sampleBooks } from '@/constants'
import { users } from '@/database/schema'
import { db } from '@/database/drizzle'



const page = async () => {
 const result = await db.select().from(users);
  return (
   <>
   <BookOverview { ... sampleBooks[0]} />

  <Booklist
     title = "Latest Books"
     books = {sampleBooks}
     containerClassName = "mt-28"
  />
   
   </>
  )
}

export default page

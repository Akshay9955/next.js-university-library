import Booklist from '@/components/ui/Booklist'
import BookOverview from '@/components/ui/BookOverview'
import { sampleBooks } from '@/constants'

const page = async () => {
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

import { fetchRecentBooks } from '@/lib/db/queries';
import BookCard from '../add-book/BookCard';

const BookList = async () => {
  const books = await fetchRecentBooks();

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4'>
      {books.map((book) => (
        <BookCard key={book.id} {...book} />
      ))}
    </div>
  );
};

export default BookList;

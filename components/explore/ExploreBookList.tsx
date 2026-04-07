import { fetchBooksByGenre } from '@/lib/db/queries';
import BookCard from '../add-book/BookCard';
import Pagination from './Pagination';

const PAGE_SIZE = 10;

interface ExploreBookListProps {
  genre: string;
  page: number;
}

const ExploreBookList = async ({ genre, page }: ExploreBookListProps) => {
  const { books, total } = await fetchBooksByGenre(genre, page, PAGE_SIZE);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (books.length === 0) {
    return (
      <p className='text-muted-foreground mt-6'>No books found{genre ? ` for "${genre}"` : ''}.</p>
    );
  }

  return (
    <div className='mt-6 space-y-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {books.map((book) => (
          <BookCard key={book.id} {...book} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} />
      )}
    </div>
  );
};

export default ExploreBookList;

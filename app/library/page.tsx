import { auth } from '@/app/(auth)/auth';
import BookCard from '@/components/add-book/BookCard';
import { fetchUserLibraryBooks } from '@/lib/db/queries';
import { notFound } from 'next/navigation';

const Library = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    notFound();
  }

  const books = await fetchUserLibraryBooks(session.user.id);

  return (
    <main className='px-5 py-10'>
      <section className='mx-auto max-w-6xl'>
        <h1 className='text-3xl font-bold text-foreground'>My Library</h1>

        {books.length === 0 ? (
          <p className='mt-8 text-muted-foreground'>Your library is empty. Add books from Explore.</p>
        ) : (
          <div className='mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {books.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Library
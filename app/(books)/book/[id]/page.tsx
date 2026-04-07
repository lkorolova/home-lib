import { getBookById } from '@/app/(books)/actions';
import ManageLibraryButton from '@/components/book/ManageLibraryButton';
import { Badge } from '@/components/ui/badge';
import { cacheLife } from 'next/cache';
import { Calendar, Hash, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface BookDetailsPageProps {
  params: Promise<{ id: string }>;
}

async function getCachedBookById(id: string) {
  'use cache';
  cacheLife('days');

  const result = await getBookById(id);

  if (result.status !== 'success' || !result.book) {
    return null;
  }

  return result.book;
}

const BookDetailsSkeleton = () => (
  <section className='mt-4 grid gap-8 lg:grid-cols-[360px_1fr] animate-pulse'>
    <div className='h-[520px] rounded-sm bg-gray-200' />

    <div className='space-y-5'>
      <div className='space-y-3'>
        <div className='h-6 w-24 rounded bg-gray-200' />
        <div className='h-10 w-3/4 rounded bg-gray-200' />
        <div className='h-5 w-1/3 rounded bg-gray-200' />
      </div>

      <div className='space-y-2'>
        <div className='h-4 w-full rounded bg-gray-200' />
        <div className='h-4 w-full rounded bg-gray-200' />
        <div className='h-4 w-5/6 rounded bg-gray-200' />
        <div className='h-4 w-4/6 rounded bg-gray-200' />
      </div>

      <div className='grid gap-3 sm:grid-cols-2'>
        <div className='h-20 rounded-sm bg-gray-200' />
        <div className='h-20 rounded-sm bg-gray-200' />
      </div>

      <div className='h-4 w-40 rounded bg-gray-200' />
    </div>
  </section>
);

const BookDetails = async ({ id }: { id: string }) => {
  const book = await getCachedBookById(id);

  if (!book) {
    notFound();
  }

  const { title, author, coverUrl, description, genre, publicationYear, isbn } = book;

  return (
    <section className='mt-4 grid gap-8 lg:grid-cols-[360px_1fr]'>
      <div className='relative h-[520px] overflow-hidden rounded-sm bg-white'>
        <Image src={coverUrl} alt={`${title} cover`} fill className='object-contain p-4' />
      </div>

      <div className='space-y-5'>
        <div className='space-y-3'>
          <Badge variant='secondary' className='bg-[#e8dbc9]'>
            {genre || 'No genre specified'}
          </Badge>
          <h1 className='text-4xl font-bold text-foreground'>{title}</h1>
          <p className='flex items-center gap-2 text-muted-foreground'>
            <User className='h-4 w-4' />
            {author}
          </p>
        </div>

        <p className='leading-7 text-foreground/90'>{description}</p>

        <ManageLibraryButton bookId={id} />

        <div className='grid gap-3 sm:grid-cols-2'>
          <div className='rounded-sm border bg-white p-4'>
            <p className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Calendar className='h-4 w-4' />
              Publication Year
            </p>
            <p className='mt-1 text-base font-semibold'>{publicationYear}</p>
          </div>

          <div className='rounded-sm border bg-white p-4'>
            <p className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Hash className='h-4 w-4' />
              ISBN
            </p>
            <p className='mt-1 text-base font-semibold'>{isbn}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const BookDetailsPage = async ({ params }: BookDetailsPageProps) => {
  const { id } = await params;

  return (
    <main className='px-5 py-10'>
      <div className='mx-auto max-w-6xl'>
        <Link href='/explore' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
          Back to Explore
        </Link>

        <Suspense fallback={<BookDetailsSkeleton />}>
          <BookDetails id={id} />
        </Suspense>
      </div>
    </main>
  );
};

export default BookDetailsPage;

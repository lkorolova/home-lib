import { ArrowRight } from 'lucide-react';
import { Suspense } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import BookList from './BookList';

const BookCardSkeleton = () => (
  <div className='bg-white rounded-sm pt-4 animate-pulse'>
    <div className='w-full h-80 bg-gray-200 rounded-t-sm' />
    <div className='p-4 space-y-2'>
      <div className='h-5 bg-gray-200 rounded w-3/4' />
      <div className='h-4 bg-gray-200 rounded w-1/2' />
      <div className='h-5 bg-gray-200 rounded w-1/4' />
    </div>
  </div>
);

const BookListSkeleton = () => (
  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4'>
    {Array.from({ length: 6 }).map((_, i) => (
      <BookCardSkeleton key={i} />
    ))}
  </div>
);

const RecentlyAdded = () => {
  return (
    <section className='px-4 py-10 mb-6'>
      <div className='flex items-center w-full justify-between'>
        <h2 className='text-3xl font-bold'>Recently Added</h2>
        <Button variant='outline' asChild>
          <Link href='/explore'>
            View all <ArrowRight />
          </Link>
        </Button>
      </div>

      <Suspense fallback={<BookListSkeleton />}>
        <BookList />
      </Suspense>
    </section>
  );
};

export default RecentlyAdded;
import { Suspense } from 'react';
import { GENRES } from '@/lib/constants';
import ExploreFilters from '@/components/explore/ExploreFilters';
import ExploreBookList from '@/components/explore/ExploreBookList';

const BookListSkeleton = () => (
  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className='bg-white rounded-sm pt-4 animate-pulse'>
        <div className='w-full h-80 bg-gray-200 rounded-t-sm' />
        <div className='p-4 space-y-2'>
          <div className='h-5 bg-gray-200 rounded w-3/4' />
          <div className='h-4 bg-gray-200 rounded w-1/2' />
          <div className='h-5 bg-gray-200 rounded w-1/4' />
        </div>
      </div>
    ))}
  </div>
);

interface ExplorePageProps {
  searchParams: Promise<{ genre?: string; page?: string }>;
}

const Explore = async ({ searchParams }: ExplorePageProps) => {
  const { genre = '', page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  return (
    <div className='py-5 px-5'>
      <h2 className='text-5xl md:text-3xl font-bold text-foreground'>Explore Our Collection</h2>
      <p>Browse through our literary treasures</p>

      <ExploreFilters genres={GENRES} />

      <Suspense key={`${genre}-${page}`} fallback={<BookListSkeleton />}>
        <ExploreBookList genre={genre} page={page} />
      </Suspense>
    </div>
  );
};

export default Explore;
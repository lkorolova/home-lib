'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Funnel } from 'lucide-react';
import GenresList from '../ui/genresList';

interface ExploreFiltersProps {
  genres: string[];
}

const ExploreFilters = ({ genres }: ExploreFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedGenre = searchParams.get('genre') ?? '';

  const onGenreClick = (genre: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedGenre === genre) {
      params.delete('genre');
    } else {
      params.set('genre', genre);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      <div className='mt-8 flex items-center text-[#847062] gap-1'>
        <Funnel className='w-4 h-4' />
        <p className='text-base text-[#847062]'>Filter by Genre</p>
      </div>

      <div className='mt-3 flex flex-wrap gap-2'>
        <GenresList genres={genres} selectedGenre={selectedGenre} onGenreClick={onGenreClick} />
      </div>
    </>
  );
};

export default ExploreFilters;

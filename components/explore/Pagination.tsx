'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigate = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className='flex items-center justify-center gap-3'>
      <Button
        variant='outline'
        size='sm'
        onClick={() => navigate(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className='h-4 w-4' />
        Previous
      </Button>

      <span className='text-sm text-muted-foreground'>
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant='outline'
        size='sm'
        onClick={() => navigate(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
        <ChevronRight className='h-4 w-4' />
      </Button>
    </div>
  );
};

export default Pagination;

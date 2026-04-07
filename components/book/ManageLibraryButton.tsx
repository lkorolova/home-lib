'use client';

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoaderCircle, Minus, Plus } from 'lucide-react';
// import { manageMyLibrary, type ManageLibraryActionState } from '@/app/(books)/book/[id]/actions';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/toast';
import { ManageLibraryActionState, manageMyLibrary } from '@/app/(books)/book/[id]/actions';

type ManageLibraryButtonProps = {
  bookId: string;
  isInitiallyAdded?: boolean;
};

const initialState: ManageLibraryActionState = {
  status: 'idle',
};

const ManageLibraryButton = ({ bookId, isInitiallyAdded = false }: ManageLibraryButtonProps) => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(manageMyLibrary, initialState);
  const [isAdded, setIsAdded] = useState(isInitiallyAdded);

  useEffect(() => {
    setIsAdded(isInitiallyAdded);
  }, [isInitiallyAdded]);

  useEffect(() => {
    if (state.status === 'added') {
      setIsAdded(true);
      toast({ type: 'success', description: 'Book added to your library.' });
      router.refresh();
    } else if (state.status === 'removed') {
      setIsAdded(false);
      toast({ type: 'success', description: 'Book removed from your library.' });
      router.refresh();
    } else if (state.status === 'already_added') {
      setIsAdded(true);
      toast({ type: 'info', description: 'This book is already in your library.' });
    } else if (state.status === 'not_in_library') {
      setIsAdded(false);
      toast({ type: 'info', description: 'This book is not in your library.' });
    } else if (state.status === 'book_not_found') {
      toast({ type: 'error', description: 'Book not found.' });
    } else if (state.status === 'failed') {
      toast({ type: 'error', description: 'Failed to update your library.' });
    }
  }, [state.status, router]);

  if (state.status === 'unauthorized') {
    return (
      <Button asChild className='w-full sm:w-auto'>
        <Link href='/login'>Sign in to manage my Library</Link>
      </Button>
    );
  }

  return (
    <form action={formAction}>
      <input type='hidden' name='bookId' value={bookId} />
      <input type='hidden' name='operation' value={isAdded ? 'remove' : 'add'} />
      <Button type='submit' disabled={isPending} className='w-full sm:w-auto'>
        {isPending ? (
          <LoaderCircle className='h-4 w-4 animate-spin' />
        ) : isAdded ? (
          <Minus className='h-4 w-4' />
        ) : (
          <Plus className='h-4 w-4' />
        )}
        {isAdded ? 'Remove from my Library' : 'Add to my Library'}
      </Button>
    </form>
  );
};

export default ManageLibraryButton;

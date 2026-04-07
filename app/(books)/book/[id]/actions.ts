'use server';

import { auth } from '@/app/(auth)/auth';
import { addBookToUserLibrary, fetchBookById, removeBookFromUserLibrary } from '@/lib/db/queries';

export type ManageLibraryActionState = {
  status:
    | 'idle'
    | 'added'
    | 'removed'
    | 'already_added'
    | 'not_in_library'
    | 'unauthorized'
    | 'book_not_found'
    | 'failed';
};

export async function manageMyLibrary(
  _state: ManageLibraryActionState,
  formData: FormData
): Promise<ManageLibraryActionState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { status: 'unauthorized' };
    }

    const bookId = formData.get('bookId');
    const operation = formData.get('operation');

    if (typeof bookId !== 'string' || !bookId) {
      return { status: 'book_not_found' };
    }

    if (operation !== 'add' && operation !== 'remove') {
      return { status: 'failed' };
    }

    const [book] = await fetchBookById(bookId);

    if (!book) {
      return { status: 'book_not_found' };
    }

    if (operation === 'remove') {
      const removeResult = await removeBookFromUserLibrary(session.user.id, bookId);

      if (removeResult === 'not_found') {
        return { status: 'not_in_library' };
      }

      return { status: 'removed' };
    }

    const result = await addBookToUserLibrary(session.user.id, bookId);

    if (result === 'exists') {
      return { status: 'already_added' };
    }

    return { status: 'added' };
  } catch {
    return { status: 'failed' };
  }
}

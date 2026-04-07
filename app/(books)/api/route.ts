import { db } from '@/lib/db';
import { auth } from '@/app/(auth)/auth';
import { book } from '@/lib/db/schema';
import { UploadImage } from '@/lib/cloudinary/upload-image';
import { NextResponse } from 'next/server';

const badRequest = (error: string) => NextResponse.json({ error }, { status: 400 });

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();

    const title = String(formData.get('title') ?? '').trim();
    const author = String(formData.get('author') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();
    const genre = String(formData.get('genre') ?? '').trim();
    const isbn = String(formData.get('isbn') ?? '').trim();
    const publicationYearRaw = String(
      formData.get('publicationYear') ?? formData.get('publishedYear') ?? ''
    ).trim();

    if (!title || !author || !description || !isbn) {
      return badRequest('title, author, description and isbn are required.');
    }

    const publicationYear = publicationYearRaw ? Number(publicationYearRaw) : new Date().getFullYear();

    if (publicationYearRaw && Number.isNaN(publicationYear)) {
      return badRequest('publicationYear must be a number.');
    }

    const cover = formData.get('cover');

    if (!(cover instanceof File) || cover.size === 0) {
      return badRequest('cover is required.');
    }

    const uploadResult = (await UploadImage(cover, 'homelib')) as { secure_url?: string };

    if (!uploadResult?.secure_url) {
      return NextResponse.json({ error: 'Failed to upload cover image.' }, { status: 500 });
    }

    const [createdBook] = await db
      .insert(book)
      .values({
        id: isbn,
        title,
        author,
        description,
        coverUrl: uploadResult.secure_url,
        genre: genre || null,
        isbn,
        publicationYear,
      })
      .returning({
        id: book.id,
        title: book.title,
        createdAt: book.createdAt,
      });

    return NextResponse.json({ message: 'Book created', book: createdBook }, { status: 201 });
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = (error as { code?: string }).code;
      if (code === '23505') {
        return NextResponse.json({ error: 'ISBN must be unique.' }, { status: 409 });
      }
    }

    console.error('Failed to create book:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

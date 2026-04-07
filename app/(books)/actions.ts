'use server'

import { createBook, fetchBookById, fetchRecentBooks, fetchBooksByGenre } from "@/lib/db/queries";
import { auth } from "@/app/(auth)/auth";
import type { Book } from "@/lib/db/schema";
import z from "zod";
import { UploadImage } from "@/lib/cloudinary/upload-image";

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"]


const bookFormSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").max(255),
  author: z.string().min(1, "Author is required").max(255),
  description: z.string().min(1, "Description is required"),
  coverUrl: z.instanceof(File)
    .refine(
        (file) => !file || file.size <= MAX_UPLOAD_SIZE,
        "Max file size is 5MB."
    )
    .refine(
        (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
        "Only .png, .webp, .jpeg and .jpg formats are supported."
    ),
  genre: z.string().max(255).optional().or(z.literal("")),
    publicationYear: z.number().int().positive().optional(),
  isbn: z
    .string()
    .regex(/^\d{13}$/, "ISBN must contain exactly 13 digits")
    .optional()
    .or(z.literal("")),
});

export type AddBookActionState = {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "book_exists"
    | "invalid_data"
    | "unauthorized";
  bookId?: string;
};

export type UploadImageResultType = {
    secure_url: string
}

export default async function addBook (
    _state: AddBookActionState,
    formData: FormData
): Promise<AddBookActionState> {
    try {
    const session = await auth();
    if (!session?.user?.email) {
            return { status: "unauthorized" };
        }
        
        const data = {
            id: formData.get('isbn'),
            title: formData.get('title'),
            author: formData.get('author'),
            description: formData.get('description'),
            coverUrl: formData.get('cover'),
            genre: formData.get('genre'),
            publicationYear: formData.get('publicationYear') ? Number(formData.get('publicationYear')) : undefined,
            isbn: formData.get('isbn'),
        };
        
        const validatedData = bookFormSchema.safeParse(data);
        
        if (!validatedData.success) {
            console.error('Validation errors:', z.flattenError(validatedData.error));
            return { status: "invalid_data" };
        }
        
        const [existingBook] = await fetchBookById(validatedData.data.id);
        
        if (existingBook) {
            return { status: "book_exists" };
        }
        
        const uploadImageResult = await UploadImage(validatedData.data.coverUrl, 'homelib') as UploadImageResultType;
        
        const bookToCreate = {
            id: validatedData.data.id,
            title: validatedData.data.title,
            author: validatedData.data.author,
            description: validatedData.data.description,
            coverUrl: uploadImageResult?.secure_url,
            genre: validatedData.data.genre || undefined,
            publicationYear: validatedData.data.publicationYear ?? new Date().getFullYear(),
            isbn: validatedData.data.isbn || validatedData.data.id,
        };
        
        const createdBook = await createBook(bookToCreate);
        return { status: "success", bookId: createdBook.id };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { status: "invalid_data" };
        }
        
        return { status: "failed" };
    }
}

export type GetBooksActionState = {
  status:
    | "idle"
    | "success"
    | "failed";
  books?: Book[];
};

export async function getRecentBooks(): Promise<GetBooksActionState> {
  try {
    const books = await fetchRecentBooks();
    return { status: "success", books };
  } catch {
    return { status: "failed" };
  }
}

export async function getBooksByGenre(genre: string): Promise<GetBooksActionState>{
  try {
    const { books } = await fetchBooksByGenre(genre);
    return {status: 'success', books };
  } catch {
    return { status: "failed" };
  }
}

export type GetBookActionState = {
  status:
    | "idle"
    | "success"
    | "failed";
  book?: Book;
};

export async function getBookById(id: string): Promise<GetBookActionState>{
  try {
    const [book] = await fetchBookById(id);
    if (!book) {
      return { status: "failed" };
    }

    return { status: "success", book };
  } catch {
    return { status: "failed" };
  }
}
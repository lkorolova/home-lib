import 'server-only';

import { Book, book, User, user, userLibrary } from "./schema";
import { and, count, desc, eq } from "drizzle-orm";
import { generateHashedPassword } from "./utils";
import { randomUUID } from "node:crypto";
import { db } from "./index";

export async function getUser(email: string): Promise<User[]> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.log('Failed to get user by email: ', error);
    
    throw new Error(
      "Failed to get user by email"
    );
  }
}

export async function getUserById(id: string): Promise<User[]> {
  try {
    return await db.select().from(user).where(eq(user.id, id));
  } catch (error) {
    console.log('Failed to get user by id: ', error);

    throw new Error(
      "Failed to get user by id"
    );
  }
}

export async function createUser(email: string, password: string) {
  const hashedPassword = generateHashedPassword(password);

  try {
    return await db.insert(user).values({ email, password: hashedPassword }).returning({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error("Failed to create user:", error);
    throw new Error("Failed to create user");
  }
}

export async function updateUserProfile(
  userId: string,
  profile: { name: string | null; surname: string | null }
): Promise<void> {
  try {
    await db
      .update(user)
      .set({
        name: profile.name,
        surname: profile.surname,
      })
      .where(eq(user.id, userId));
  } catch (error) {
    console.error("Failed to update user profile:", error);
    throw new Error("Failed to update user profile");
  }
}

export async function createGuestUser() {
  const email = `guest-${Date.now()}`;
  const password = generateHashedPassword(randomUUID());

  try {
    return await db.insert(user).values({ email, password }).returning({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error("Failed to create guest user:", error);
    throw new Error(
      "Failed to create guest user"
    );
  }
}

export async function fetchBookById(id: string): Promise<Book[]> {
  try {
    return await db.select().from(book).where(eq(book.id, id));
  } catch (error) {
    console.error("Failed to get book by isbn:", error);
    throw new Error("Failed to get book by isbn");
  }
}

export async function fetchAllBooks(): Promise<Book[]> {
    try {
    return await db.select().from(book);
  } catch (error) {
    console.error("Failed to fetch books:", error);
    throw new Error("Failed to fetch books");
  }
}

export async function fetchRecentBooks(limit = 10): Promise<Book[]> {
  try {
    return await db.select().from(book).orderBy(desc(book.createdAt)).limit(limit);
  } catch (error) {
    console.error("Failed to fetch recent books:", error);
    throw new Error("Failed to fetch recent books");
  }
}

export async function fetchBooksByGenre(
  genre = '',
  page = 1,
  pageSize = 10
): Promise<{ books: Book[]; total: number }> {
  try {
    const offset = (page - 1) * pageSize;
    const whereClause = genre ? eq(book.genre, genre) : undefined;

    const [books, [{ value: total }]] = await Promise.all([
      whereClause
        ? db.select().from(book).where(whereClause).limit(pageSize).offset(offset)
        : db.select().from(book).limit(pageSize).offset(offset),
      whereClause
        ? db.select({ value: count() }).from(book).where(whereClause)
        : db.select({ value: count() }).from(book),
    ]);

    return { books, total };
  } catch (error) {
    console.error("Failed to fetch books:", error);
    throw new Error("Failed to fetch books");
  }
}

export async function createBook(bookData: {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  genre?: string;
  publicationYear: number;
  isbn: string;
}): Promise<Book> {    
  try {
    const result = await db.insert(book).values(bookData).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to add book:", error);
    throw new Error("Failed to add book");
  }
}

export async function isBookInUserLibrary(userId: string, bookId: string): Promise<boolean> {
  try {
    const [entry] = await db
      .select({ userId: userLibrary.userId })
      .from(userLibrary)
      .where(and(eq(userLibrary.userId, userId), eq(userLibrary.bookId, bookId)))
      .limit(1);

    return Boolean(entry);
  } catch (error) {
    console.error("Failed to check user library entry:", error);
    throw new Error("Failed to check user library entry");
  }
}

export async function addBookToUserLibrary(
  userId: string,
  bookId: string
): Promise<"added" | "exists"> {
  try {
    const result = await db
      .insert(userLibrary)
      .values({ userId, bookId, addedAt: new Date() })
      .onConflictDoNothing()
      .returning({ userId: userLibrary.userId });

    return result.length > 0 ? "added" : "exists";
  } catch (error) {
    console.error("Failed to add book to user library:", error);
    throw new Error("Failed to add book to user library");
  }
}

export async function removeBookFromUserLibrary(
  userId: string,
  bookId: string
): Promise<"removed" | "not_found"> {
  try {
    const result = await db
      .delete(userLibrary)
      .where(and(eq(userLibrary.userId, userId), eq(userLibrary.bookId, bookId)))
      .returning({ userId: userLibrary.userId });

    return result.length > 0 ? "removed" : "not_found";
  } catch (error) {
    console.error("Failed to remove book from user library:", error);
    throw new Error("Failed to remove book from user library");
  }
}

export async function fetchUserLibraryBooks(userId: string): Promise<Book[]> {
  try {
    return await db
      .select({
        id: book.id,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        genre: book.genre,
        description: book.description,
        publicationYear: book.publicationYear,
        isbn: book.isbn,
        createdAt: book.createdAt,
      })
      .from(userLibrary)
      .innerJoin(book, eq(userLibrary.bookId, book.id))
      .where(eq(userLibrary.userId, userId))
      .orderBy(desc(userLibrary.addedAt));
  } catch (error) {
    console.error("Failed to fetch user library books:", error);
    throw new Error("Failed to fetch user library books");
  }
}
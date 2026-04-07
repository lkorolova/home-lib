import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { Book, book, User, user } from "./schema";
import { count, desc, eq } from "drizzle-orm";
import { generateHashedPassword } from "./utils";
import { randomUUID } from "node:crypto";

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

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
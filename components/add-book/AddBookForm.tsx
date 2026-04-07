'use client'

/* eslint-disable @next/next/no-img-element */
import { useActionState, useEffect, useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { BookPlus } from 'lucide-react'
import addBook, { AddBookActionState } from '@/app/(books)/actions'
import { toast } from 'sonner'
import { GENRES } from '@/lib/constants'
import GenresList from '../ui/genresList'
import { useRouter } from 'next/navigation'

const AddBookForm = () => {
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [selectedGenre, setSelectedGenre] = useState<string>('');
    const router = useRouter();

    const [state, formAction, isPending] = useActionState<AddBookActionState, FormData>(
        addBook,
        {
            status: "idle",
        }
    );


    useEffect(() => {
        if (state.status === "book_exists") {
            toast.error("Book already exists!");
        } else if (state.status === "unauthorized") {
            toast.error("Please sign in to add a book.");
        } else if (state.status === "failed") {
            toast.error("Failed to add a book!");
        } else if (state.status === "invalid_data") {
            toast.error("Failed validating your book info!");
        } else if (state.status === "success") {
            toast.success("Book added successfully!");
            if (state.bookId) {
                router.push(`/book/${state.bookId}`);
            }
        }

    }, [state.status, state.bookId, router]);

    const onImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if(!file) {
            setCoverPreview(null);
            return;
        }

        if (coverPreview) URL.revokeObjectURL(coverPreview);
        const url = URL.createObjectURL(file);

        setCoverPreview(url);
    }

    const onGenreClick = (genre: string) => selectedGenre === genre? setSelectedGenre('') : setSelectedGenre(genre);
    

    const handleSubmit = async (formData: FormData) => {
        formAction(formData);
    }

  return (
    <div className='max-w-3xl mx-auto'>
        <Card className='p-8'>
                <CardContent>
                    <form className='space-y-6' action={handleSubmit}>
                        <div className='space-y-2'>
                            <Label htmlFor='title' className='font-semibold text-lg'>Book Title *</Label>
                            <Input id='title' name='title' placeholder='Enter the book title' className='h-12 text-base!' 
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='author' className='font-semibold text-lg'>Author *</Label>
                            <Input id='author' name='author' placeholder="Enter the author's name" className='h-12 text-base!' 
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='cover' className='font-semibold text-lg'>Cover Image *</Label>
                            
                            <div className='flex flex-col sm:flex-row items-starts sm:items-center gap-4'>
                                <div className='w-32 h-48 bg-muted ounded overflow-hidden border flex items-center justify-center'>
                                    {/* TODO: check if add Image nextJS element instead */}
                                    {coverPreview ? <img src={coverPreview} alt='book cover preview' className='h-full w-full object-cover'/> : <p>No Cover Selected</p>}
                                </div>

                                <div className='flex-1 flex flex-col gap-2'>
                                    <input 
                                        className='block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#E6B81D] file:text-white' 
                                        type='file' 
                                        name='cover' 
                                        accept='image/*'
                                        onChange={onImageInputChange}
                                    />

                                    <p className='text-sm! text-muted-foreground'>Upload the book cover</p>
                                </div>
                            </div>
                        </div>

                        <div className='space-y-3'>
                            <Label htmlFor='genre' className='font-semibold text-lg'>Genre</Label>
                            <div className='flex gap-2'>
                                <input type='hidden' name='genre' value={selectedGenre}/>
                                <GenresList 
                                    genres={GENRES} 
                                    selectedGenre={selectedGenre} 
                                    onGenreClick={onGenreClick}
                                />
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='description' className='font-semibold text-lg'>Description *</Label>
                            <Textarea 
                                id='description' 
                                name='description' 
                                placeholder="Tell more about the book"
                                rows={6} 
                                className='resize-none text-base!' 
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='publishedYear' className='font-semibold text-lg'>Publication Year</Label>
                            <Input 
                                id='publishedYear' 
                                name='publicationYear' 
                                placeholder="1991" 
                                className='h-12 text-base!'
                                min={1000}
                             />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='isbn' className='font-semibold text-lg'>ISBN *</Label>
                            <Input id='isbn' name='isbn' placeholder="Enter the book ISBN (13-digit barcode)" className='h-12 text-base!' 
                            />
                        </div>

                        <Button 
                            className='w-full flex gap-3 text-lg' 
                            type='submit'
                            size='lg'
                            disabled={isPending}
                        >
                            <BookPlus className={`w-5 h-5 ${isPending ? 'animated-spin': ''}`}/>
                            {isPending ? 'Adding ...' : 'Add to Library'}
                        </Button>
                    </form>
                </CardContent>
        </Card>
    </div>
  )
}

export default AddBookForm
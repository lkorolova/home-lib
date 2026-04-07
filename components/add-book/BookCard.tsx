import { Book } from '@/lib/db/schema';
import { User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Badge } from '../ui/badge';

const BookCard = ({id, title, author, coverUrl, description, genre, isbn, publicationYear} : Book) => {
  
    return <Link href={`/book/${id}`}>
        <div className='group bg-white rounded-sm hover:border transition-all duration-300 ease-in-out hover:shadow-lg hover:translate-y-1 pt-4'>
            <div className='w-full h-80 relative overflow-hidden'>
                <Image src={coverUrl} alt='book cover' className='w-full h-full object-contain rounded-t-sm transition-transform duration-300 ease
                -in-out group-hover:scale-105' fill/>
            </div>

            <div className='p-4 space-y-2'>
                <h3 className='font-semibold text-lg line-clamp-2 text-foreground group-hover:text-[#803939] transition-colors duration-300 ease-in-out'>{title}</h3>

                <p className='text-sm text-muted-foreground flex items-center gap-1'>
                    <User  className='w-3 h-3'/>{author}
                </p>

                <div className=''>
                    <Badge variant='secondary' className='text-xs bg-[#e8dbc9]'>{genre || "No genre specified"}</Badge>
                </div>
            </div>
        </div>
    </Link>
}

export default BookCard;
import React from 'react'
import { Button } from './button';

interface GenresListProps {
    genres: string[];
    selectedGenre: string;
    onGenreClick: (genre: string) => void;
}

const GenresList = ({ genres, selectedGenre, onGenreClick }: GenresListProps) => {
    return (
        <>
            {genres.map((genre)=>(
                <Button 
                        key={genre} 
                        type='button'
                        variant={selectedGenre === genre ? 'default' : 'outline'}
                        size='sm'
                        className='rounded-full'
                        onClick={() => onGenreClick(genre)}
                >
                        {genre}
                </Button>
            ))}
        </>
    )
}

export default GenresList;
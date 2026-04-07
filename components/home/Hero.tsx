import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const Hero = () => {
  return (
    <section className='border-b border-[#DAD3C8]'>
        <div className='container mx-auto px-4 py-12'>
            <div className='max-w-3xl mx-auto text-center space-y-4'>
                <h1 className='text-7xl! md:text-6xl font-bold text-foreground'>Welcome to the Reading Room</h1>
                <p className='text-lg text-[#847062] leading-relaxed'>Your shared library. Discover and discuss the literature with others.</p>

                <Button asChild>
                    <Link href='/explore'  className='flex gap-2 items-center'>
                    Explore all books <ArrowRight />
                    </Link>
                </Button>
            </div>
        </div>
    </section>
  )
}

export default Hero
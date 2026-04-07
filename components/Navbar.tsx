'use client';
import { Button } from '@/components/ui/button'
import { BookKey, BookOpen, Compass, Library, LoaderCircle, LogOut, Plus } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar = () => {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const userName = session?.user?.name ?? session?.user?.email ?? 'Account';
    const userInitial = userName.charAt(0).toUpperCase();
    
    // TODO: how to set pages path manually case insensitively?
    const isActive = (path: string) => pathname === path;

    return (
        <nav className='border-b border-[#DAD3C8] bg-[#FCFAF7]/50 backdrop-blur-xs sticky top-0 z-50 px-4'>
            <div className='mx-auto'>
                <div className='flex items-center justify-between h-16'>
                    <Link href='/' className='flex item-center gap-2'>
                        <BookKey className='w-6 h-6'/>
                        <span className='text-xl font-bold text-foreground'>HomeLib</span>
                    </Link>
                    
                    <div className='flex items-center gap-2'>
                        <Button variant={isActive('/') ? 'default' : 'ghost'} size='sm' asChild>
                            <Link href='/' className='gap-2'>
                                <BookOpen className='w-4 h-4'/>
                                <span className='hidden sm:inline'>Feed</span>
                            </Link>
                        </Button>
                        <Button variant={isActive('/explore') ? 'default' : 'ghost'} size='sm' asChild>
                            <Link href='/explore' className='gap-2' >
                                <Compass className='w-4 h-4'/>
                                <span className='hidden sm:inline'>Explore</span>
                            </Link>
                        </Button>
                        <Button variant={isActive('/add-book') ? 'default' : 'ghost'} size='sm' asChild>
                            <Link href='/add-book' className='gap-2' >
                                <Plus className='w-4 h-4'/>
                                <span className='hidden sm:inline'>Add Book</span></Link>
                        </Button>
                        <Button variant={isActive('/library') ? 'default' : 'ghost'} size='sm' asChild>
                            <Link href='/library' className='gap-2' >
                                <Library className='w-4 h-4'/>
                                <span className='hidden sm:inline'>Library</span></Link>
                        </Button>

                        {status === 'loading' ? (
                            <Button variant='outline' size='sm' disabled>
                                <LoaderCircle className='h-4 w-4 animate-spin' />
                            </Button>
                        ) : session?.user ? (
                            <div className='flex items-center gap-2'>
                                <div className='flex h-8 w-8 items-center justify-center rounded-full border border-[#DAD3C8] bg-white text-sm font-semibold text-foreground'>
                                    {userInitial}
                                </div>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                >
                                    <LogOut className='h-4 w-4' />
                                    <span className='hidden sm:inline'>Sign Out</span>
                                </Button>
                            </div>
                        ) : (
                            <Button variant='outline' size='sm' asChild>
                                <Link href={`/login?callbackUrl=${encodeURIComponent(pathname || '/')}`}>
                                    Sign In
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
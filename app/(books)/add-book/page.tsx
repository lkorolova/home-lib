import AddBookForm from '@/components/add-book/AddBookForm'

const AddBook = () => {
  return (
    <div className='py-8 px-4 min-h-screen flex flex-col gap-8'>
      <div className='flex flex-col gap-2'>
        <h1 className='text5xl! md:text-3xl relaxed text-center font-bold text-foreground'>Add Your New Book</h1>
        <p className='text-base text-[#847062] leading-relaxed text-center'>Share what new you have found with our community</p>
      </div>

      <AddBookForm />
    </div>
  )
}

export default AddBook
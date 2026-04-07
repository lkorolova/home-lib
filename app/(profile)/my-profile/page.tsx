import { auth } from '@/app/(auth)/auth';
import { getUserById } from '@/lib/db/queries';
import MyProfileForm from '@/components/profile/MyProfileForm';
import { notFound, redirect } from 'next/navigation';

const MyProfilePage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/');
  }

  const [currentUser] = await getUserById(session.user.id);

  if (!currentUser) {
    notFound();
  }

  return (
    <main className='px-5 py-10'>
      <section className='mx-auto max-w-2xl rounded-sm border bg-white p-6 shadow-sm'>
        <h1 className='text-3xl font-bold text-foreground'>My Profile</h1>
        <p className='mt-2 text-sm text-muted-foreground'>Add or update your profile details.</p>
        <MyProfileForm
          email={currentUser.email}
          name={currentUser.name ?? null}
          surname={currentUser.surname ?? null}
        />
      </section>
    </main>
  );
};

export default MyProfilePage;
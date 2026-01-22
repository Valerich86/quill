import Link from 'next/link';

export default function CreatePost() {
  return (
    <div className='w-screen h-[80vh] px-3 md:px-offsetX flex justify-center'>
      <Link href={`/posts/create`}>
        <div className='px-10 py-5 rounded-full bg-accent_1 text-xl md:text-3xl text-light text-center hover:shadow-[0_0_20px_#555931] hover:scale-102 transition duration-200'>
          Создайте свою статью
        </div>
      </Link>
    </div>
  )
}

import Link from 'next/link'

const Navbar = () => {
    return (
        <div className='sticky h-10 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
            <Link href='/' className='flex z-40 font-bold text-3xl'>
                <span className='ml-2'>CiiLOCK.</span>
            </Link>
        </div>
    );
};

export default Navbar;
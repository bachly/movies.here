import Link from 'next/link';
import { QueueMediaIcon, HomeIcon } from './Icons';

export default function Layout({ children }) {
    return <div className="bg-black min-h-screen min-w-screen">
        <div className="flex items-start">
            <aside className="w-72 bg-stone-900 bg-opacity-70 h-screen">
                <div className="py-8 px-6">
                    <div className="text-white text-xl font-semibold">MoviesHere</div>
                    <div className="pt-4"></div>
                    <MenuItem href="/" svgIcon={<HomeIcon />}>
                        Home
                    </MenuItem>
                    <MenuItem href="/" svgIcon={<QueueMediaIcon />}>
                        Watchlist
                    </MenuItem>
                </div>
            </aside>

            <main className="flex-1 h-screen overflow-y-scroll">
                {children}
            </main>
        </div>
    </div>
}

function MenuItem({ href, children, svgIcon }) {
    return <Link href={href}>
        <a className="mt-4 flex items-center group">
            <div className="mr-4 text-white text-opacity-70 group-hover:text-opacity-100 transition duration-200 fill-current">
                {svgIcon}
            </div>
            <div className="text-white text-lg text-opacity-70 group-hover:text-opacity-100 transition duration-200">
                {children}
            </div>
        </a>
    </Link>
}
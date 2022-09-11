import Link from 'next/link';
import { PlusFolderIcon, SearchIcon } from './Icons';

export default function Layout({ children }) {
    return <div className="flex items-start">
        <aside className="w-72 bg-stone-900 bg-opacity-40 h-screen">
            <div className="py-6 px-6">
                <div className="text-white text-xl font-semibold">MoviesHere</div>
                <div className="pt-4"></div>
                <MenuItem href="/" svgIcon={<SearchIcon />}>
                    Home
                </MenuItem>
                <MenuItem href="/" svgIcon={<PlusFolderIcon />}>
                    Watchlist
                </MenuItem>
            </div>
        </aside>

        <main className="flex-1 h-screen overflow-y-scroll">
            {children}
        </main>
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
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AppContext } from '../lib/reactContexts';
import { QueueMediaIcon, HomeIcon } from './Icons';

export default function Layout({ children }) {
    const { appState } = useContext(AppContext);
    const router = useRouter();

    function watchlistSize(watchlistId) {
        const watchlist = appState.watchlist[watchlistId];
        return watchlist && Object.keys(watchlist.movies).length || 0;
    }

    function isMenuActive(menuName) {
        return router.pathname.indexOf(menuName) >= 0;
    }

    return <div className="bg-neutral-900 min-h-screen min-w-screen">
        <div className="flex items-start">
            <aside className="w-72 bg-black h-screen">
                <div className="py-8 pl-6 pr-8">
                    <div className="text-white text-xl font-semibold">MoviesHere</div>
                    <div className="pt-4"></div>
                    <MenuItem href="/" svgIcon={<HomeIcon />} isActive={router.pathname === '/'}>
                        Home
                    </MenuItem>
                    <MenuItem href="/watchlist/0" svgIcon={<QueueMediaIcon />} counter={watchlistSize(0)} isActive={isMenuActive('watchlist')}>
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

function MenuItem({ href, children, svgIcon, counter, isActive = false }) {
    return <Link href={href}>
        <a className={clsx(`mt-4 flex items-center group transition duration-200`, isActive ? '' : 'opacity-50 hover:opacity-100')}>
            <div className="mr-4 text-white fill-current">
                {svgIcon}
            </div>
            <div className="flex-1 text-white text-base font-semibold">
                <div className="w-full flex items-center justify-between">
                    <div className="flex-1">{children}</div>
                    {counter > 0 ?
                        <div className="text-neutral-400 text-sm flex items-center justify-center">{counter}</div>
                        : <></>}
                </div>
            </div>
        </a>
    </Link>
}
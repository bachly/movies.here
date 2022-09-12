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

    return <div className="">
        <aside className={clsx("hidden xl:block xl:fixed z-50 left-0 top-0 w-64 bg-black h-screen")}>
            <div className="py-8 pl-6 pr-6 relative z-50">
                <div className="text-xl">
                    <span className="text-neutral-300 font-black tracking-widest">NET</span>
                    <span className="text-red-700 font-black tracking-widest">FROG</span>
                </div>
                <div className="pt-4"></div>
                <MenuItem href="/" svgIcon={<HomeIcon />} isActive={router.pathname === '/'}>
                    Home
                </MenuItem>
                <MenuItem href="/watchlist/0" svgIcon={<QueueMediaIcon />} counter={watchlistSize(0)} isActive={isMenuActive('watchlist')}>
                    Watchlist
                </MenuItem>
            </div>
        </aside>

        <main className="pl-0 xl:pl-64 py-0">
            {children}
        </main>

        <div className="pt-32 block xl:hidden"></div>
        <div className={clsx("fixed xl:hidden z-50 left-0 bottom-0 bg-black w-full")}>
            <div className="max-w-xl mx-auto flex items-center justify-center">
                <div className="w-1/2 h-16">
                    <MenuItemMobile href="/" svgIcon={<HomeIcon />} isActive={router.pathname === '/'}>
                        Home
                    </MenuItemMobile>
                </div>
                <div className="w-1/2 h-16">
                    <MenuItemMobile href="/watchlist/0" svgIcon={<QueueMediaIcon />} counter={watchlistSize(0)} isActive={isMenuActive('watchlist')}>
                        Watchlist
                    </MenuItemMobile>
                </div>
            </div>
        </div>
    </div>
}

function MenuItem({ href, children, svgIcon, counter, isActive = false }) {
    return <Link href={href}>
        <a className={clsx(`mt-4 flex items-center group transition duration-200`, isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-400')}>
            <div className="mr-4 fill-current">
                {svgIcon}
            </div>
            <div className="flex-1 text-base font-semibold">
                <div className="w-full flex items-center justify-between">
                    <div className="flex-1">{children}</div>
                    {counter > 0 ?
                        <div className="ttext-sm flex items-center justify-center">{counter}</div>
                        : <></>}
                </div>
            </div>
        </a>
    </Link>
}

function MenuItemMobile({ href, children, svgIcon, counter, isActive = false }) {
    return <Link href={href}>
        <a className={clsx(`h-full flex flex-col items-center justify-center group transition duration-200`, isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-400')}>
            <div className="fill-current">
                {svgIcon}
            </div>
            <div className="mt-1 text-xs font-semibold">
                {children}
            </div>
        </a>
    </Link>
}
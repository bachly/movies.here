import Link from "next/link"

export function TvShowThumbnail({ show }) {
    return <Link href={`/`}>
        <a className="w-full pb-8 group overflow-hidden rounded-sm">
            <div className="pb-3/2 bg-image bg-cover bg-neutral-900 bg-opacity-80 transform group-hover:scale-105 transition duration-300 shadow-xl" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${show.poster_path})` }} />
            <div className="mt-4 font-bold text-white truncate pr-2">{show.name}</div>
            <div className="mt-1 flex items-center">
                <div className="text-sm text-neutral-400">{new Date(show.first_air_date).getFullYear()}</div>
                <div className="text-neutral-400 px-2">•</div>
                <div className="text-sm text-neutral-400">{show.vote_average}</div>
            </div>
        </a>
    </Link>
}
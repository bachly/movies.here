import Link from "next/link"

export function MovieThumbnail({ movie }) {
    return <Link href={`/movie/${movie.id}`}>
        <a className="w-full block group overflow-hidden rounded-lg p-2 lg:p-4 bg-neutral-800 bg-opacity-40 hover:bg-opacity-90 shadow-xl transition duration-300 ">
            <div className="pb-3/2 bg-image bg-cover bg-neutral-900 bg-opacity-80 " style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.poster_path})` }} />
            <div className="mt-3 lg:mt-4 text-sm lg:text-base font-bold text-neutral-300 truncate pr-2">{movie.title}</div>
            <div className="mt-0 lg:mt-1 flex items-center">
                <div className="text-xs lg:text-sm text-neutral-400">{new Date(movie.release_date).getFullYear()}</div>
                <div className="text-neutral-400 px-2">•</div>
                <div className="text-xs lg:text-sm text-neutral-400">{movie.vote_average}</div>
            </div>
        </a>
    </Link>
}

export function MovieThumbnailSkeleton() {
    return <div className="w-full rounded-lg p-2 lg:p-4 bg-neutral-800 bg-opacity-40 shadow-xl">
        <div className="pb-3/2 bg-image bg-cover bg-neutral-900" />
        <div className="mt-4 bg-neutral-900 w-3/4">&nbsp;</div>
        <div className="mt-1 bg-neutral-900 w-1/2">&nbsp;</div>
    </div>
}
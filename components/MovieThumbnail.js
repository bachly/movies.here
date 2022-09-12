import Link from "next/link"

export function MovieThumbnail({ movie }) {
    return <Link href={`/movie/${movie.id}`}>
        <a className="w-full pb-8 group overflow-hidden rounded-sm">
            <div className="pb-3/2 bg-image bg-cover bg-neutral-900 bg-opacity-80 transform group-hover:scale-105 transition duration-300 shadow-xl" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.poster_path})` }} />
            <div className="mt-4 font-bold text-white truncate pr-2">{movie.title}</div>
            <div className="mt-1 flex items-center">
                <div className="text-sm text-neutral-400">{new Date(movie.release_date).getFullYear()}</div>
                <div className="text-neutral-400 px-2">•</div>
                <div className="text-sm text-neutral-400">{movie.vote_average}</div>
            </div>
        </a>
    </Link>
}

export function MovieThumbnailSkeleton() {
    return <div className="w-full pb-8 rounded-sm">
        <div className="pb-3/2 bg-image bg-cover bg-neutral-800" />
        <div className="mt-4 bg-neutral-800 w-3/4">&nbsp;</div>
        <div className="mt-1 bg-neutral-800 w-1/2">&nbsp;</div>
    </div>
}
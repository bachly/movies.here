export function MovieThumbnail({ movie }) {
    return <div className="w-full pb-8">
        <div className="pb-3/2 bg-image bg-cover bg-neutral-900 bg-opacity-80" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.poster_path})` }} />
        <div className="mt-4 font-bold text-white truncate pr-2">{movie.title}</div>
        <div className="mt-1 flex items-center">
            <div className="text-sm text-neutral-400">{new Date(movie.release_date).getFullYear()}</div>
            <div className="text-neutral-400 px-2">•</div>
            <div className="text-sm text-neutral-400">{movie.vote_average}</div>
        </div>
    </div>
}

export function MovieThumbnailSkeleton() {
    return <div className="w-full pb-8">
        <div className="pb-3/2 bg-image bg-cover bg-neutral-900 bg-opacity-80" />
        <div className="mt-4 bg-neutral-900 w-3/4">&nbsp;</div>
        <div className="mt-2 bg-neutral-900 w-1/2 h-4"></div>
    </div>
}
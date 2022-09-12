import useAxios from "axios-hooks";
import { useRouter } from "next/router";
import { useContext, useEffect, useReducer, useState } from "react";
import Container from "../../components/Container";
import HeaderWithoutSearch from "../../components/HeaderWithoutSearch";
import { CheckMarkIcon, PlusIcon } from "../../components/Icons";
import Layout from "../../components/Layout";
import { AppContext } from "../../lib/reactContexts";

function movieDetailsPageReducer(state, action) {
    switch (action.type) {
        case "routerReady":
            return {
                ...state,
                movieId: action.payload.movieId
            }
        case "successGettingMovieDetails":
            return {
                ...state,
                movieDetails: action.payload || null
            }
        default:
            throw new Error('Unknown reducer action');
    }
}

export default function MovieDetailsPage() {
    const { appState, dispatchAppAction } = useContext(AppContext);
    const [state, dispatch] = useReducer(movieDetailsPageReducer, {
        movieId: null,
        movieDetails: null
    });
    const router = useRouter();

    const [{
        data: successGettingMovieDetails,
        loading: isGettingMovieDetails,
        error: errorGettingMovieDetails },
        getMovieDetails
    ] = useAxios(
        {
            url: '/api/getMovieDetails',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
            },
            data: JSON.stringify({
                movieId: state.movieId
            })
        },
        { manual: true }
    )

    useEffect(() => {
        if (router && router.query) {
            dispatch({
                type: "routerReady",
                payload: {
                    movieId: router.query.id
                }
            })
        }
    }, [router])

    useEffect(() => {
        if (state.movieId) {
            getMovieDetails();
        }
    }, [state.movieId])

    useEffect(function onSuccessGettingMovieDetails() {
        if (successGettingMovieDetails) {
            dispatch({
                type: "successGettingMovieDetails",
                payload: successGettingMovieDetails.data
            })
        }
    }, [
        successGettingMovieDetails
    ])

    function handleAddToWatchlist({ id, title, release_date, poster_path, vote_average }) {
        return (event) => {
            event && event.preventDefault();
            dispatchAppAction({
                type: "addToWatchlist",
                payload: {
                    watchlistId: 0,
                    movie: {
                        id,
                        title,
                        release_date,
                        vote_average,
                        poster_path
                    }
                }
            })
        }
    }

    function handleRemoveFromWatchlist({ id }) {
        return (event) => {
            event && event.preventDefault();
            dispatchAppAction({
                type: "removeFromWatchlist",
                payload: {
                    watchlistId: 0,
                    movie: {
                        id
                    }
                }
            })
        }
    }

    function isInWatchlist({ watchlistId, movieId }) {
        const watchlist = appState.watchlist[watchlistId];
        const movies = watchlist && watchlist.movies;

        return movies && Object.keys(movies).length > 0 && Object.keys(movies).indexOf(movieId.toString()) >= 0;
    }

    return <Layout>
        <div className="relative">
            <HeaderWithoutSearch />

            <div className="xl:pt-8" />

            <Container>
                {(() => {
                    if (isGettingMovieDetails) {
                        return <div className="flex items-start flex-col xl:flex-row">
                            <div className="w-full max-w-md mx-auto xl:max-w-none xl:w-1/2 xl:px-12">
                                <div className="pb-3/2 bg-image bg-center bg-cover bg-neutral-800" />
                            </div>
                            <div className="w-full xl:flex-1 mt-6 xl:mt-0">
                                <div className="max-w-md mx-auto">
                                    <h1 className="movie__title text-3xl bg-neutral-800">&nbsp;</h1>
                                    <div className="movie__tagline bg-neutral-800">&nbsp;</div>
                                    <div className="mt-6 h-12 bg-neutral-800"></div>
                                    <div className="movie__overview mt-6 h-24 bg-neutral-800"></div>
                                    <div className="movie__genres mt-4 h-6 bg-neutral-800"></div>
                                    <div className="movie__overview mt-6 h-56 bg-neutral-800"></div>
                                </div>
                            </div>
                        </div>
                    } else {
                        if (errorGettingMovieDetails) {
                            return <>
                                <h1 className="xl:mt-8 text-white text-3xl xl:text-5xl font-bold">Oops!</h1>
                                <div className="mt-1 text-neutral-400">Error loading the movie details. Please try again later.</div>
                            </>
                        } else {
                            if (state.movieDetails) {
                                return <div className="flex items-start flex-col xl:flex-row">
                                    <div className="w-full max-w-md mx-auto xl:max-w-none xl:w-1/2 xl:px-12">
                                        <div className="pb-3/2 bg-image bg-center bg-cover bg-neutral-800 shadow-md"
                                            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${state.movieDetails.poster_path})` }} />
                                    </div>
                                    <div className="w-full xl:flex-1 mt-6 xl:mt-0">
                                        <div className="max-w-md mx-auto">
                                            <h1 className="movie__title text-white text-3xl">{state.movieDetails.title}</h1>
                                            <div className="movie__tagline text-white text-md text-neutral-400">"{state.movieDetails.tagline}"</div>
                                            <div className="mt-6 grid grid-cols-2 xl:grid-cols-4 justify-between">
                                                <MovieQuickInfo label="Released" value={new Date(state.movieDetails.release_date).getFullYear()} />
                                                <MovieQuickInfo label="Rating" value={state.movieDetails.vote_average} />
                                                <MovieQuickInfo label="Length" value={`${state.movieDetails.runtime} minutes`} />
                                                <MovieQuickInfo label="Language" value={`${state.movieDetails.spoken_languages[0] && state.movieDetails.spoken_languages[0].english_name}`} />
                                            </div>
                                            <div className="movie__overview mt-6">
                                                <MovieQuickInfo label="Overview" value={state.movieDetails.overview} />
                                            </div>

                                            <div className="mt-4">
                                                {state.movieDetails.genres.length > 0 && <div className="movie__genres flex items-center flex-wrap">
                                                    {state.movieDetails.genres.map(genre => {
                                                        return <div className="text-neutral-400 text-xs uppercase mt-2 py-1 px-4 bg-neutral-800 rounded-sm mr-2" key={genre.id}>
                                                            {genre.name}
                                                        </div>
                                                    })}
                                                </div>}
                                            </div>

                                            <div className="mt-8 pb-8 border-t border-neutral-700"></div>

                                            {isInWatchlist({ watchlistId: 0, movieId: state.movieDetails.id }) ?
                                                <div class="flex items-center">
                                                    <button onClick={handleRemoveFromWatchlist(state.movieDetails)} className="py-1 px-4 mr-2 rounded-md transition duration-200 bg-neutral-800 text-neutral-300 opacity-50 hover:opacity-100">
                                                        <div className="flex items-center">
                                                            Remove from watchlist
                                                        </div>
                                                    </button>
                                                    <span className="text-sm flex items-center text-green-500">
                                                        <span className="fill-current text-green-500 mr-1">
                                                            <CheckMarkIcon />
                                                        </span>
                                                        Added to watchlist
                                                    </span>
                                                </div>
                                                :
                                                <button onClick={handleAddToWatchlist(state.movieDetails)} className="py-1 px-4 rounded-md transition duration-200 bg-neutral-800 text-neutral-300 opacity-50 hover:opacity-100">
                                                    <div className="flex items-center">
                                                        <span className="fill-current mr-2">
                                                            <PlusIcon />
                                                        </span>
                                                        Add to watchlist
                                                    </div>
                                                </button>}
                                        </div>
                                    </div>
                                </div>
                            } else {
                                return <></>
                            }
                        }
                    }
                })()}
            </Container>
        </div>
    </Layout>
}

function MovieQuickInfo({ label, value }) {
    return <div className="movie__quickinfo pr-4 mb-4">
        <div className="movie__quickinfo-label text-neutral-500 text-xs uppercase tracking-wide font-semibold">{label}</div>
        <div className="movie__quickinfo-value text-neutral-100 text-base mt-1">{value}</div>
    </div>
}
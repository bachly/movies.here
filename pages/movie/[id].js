import useAxios from "axios-hooks";
import { useRouter } from "next/router";
import { useEffect, useReducer, useState } from "react";
import HeaderWithoutSearch from "../../components/HeaderWithoutSearch";
import Layout from "../../components/Layout";

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
            console.log("successGettingMovieDetails", successGettingMovieDetails.data);
            dispatch({
                type: "successGettingMovieDetails",
                payload: successGettingMovieDetails.data
            })
        }
    }, [
        successGettingMovieDetails
    ])

    return <Layout>
        <div className="relative">
            <HeaderWithoutSearch />
            {(() => {
                if (isGettingMovieDetails) {
                    return <div className="">
                        <div className="w-1/2 px-12">
                            <div className="pb-3/2 bg-image bg-center bg-cover bg-neutral-900 bg-opacity-80" />
                        </div>
                    </div>
                } else {
                    if (errorGettingMovieDetails) {
                        return <div className="py-2 px-12">Error loading the movie details. Try again later.</div>
                    } else {
                        if (state.movieDetails) {
                            return <div className="flex items-start">
                                <div className="w-1/2 px-12">
                                    <div className="pb-3/2 bg-image bg-center bg-cover bg-neutral-900 bg-opacity-80"
                                        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${state.movieDetails.poster_path})` }} />
                                </div>
                                <div className="flex-1">
                                    <div className="max-w-md">
                                        <h1 className="movie__title text-white text-3xl">{state.movieDetails.title}</h1>
                                        <div className="movie__tagline text-white text-md text-neutral-400">"{state.movieDetails.tagline}"</div>
                                        <div className="mt-6 flex items-center justify-between">
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
                                                    return <div className="text-neutral-300 text-xs uppercase mt-2 py-1 px-4 bg-neutral-800 rounded-sm mr-2" key={genre.id}>
                                                        {genre.name}
                                                    </div>
                                                })}
                                            </div>}
                                        </div>

                                        <div className="mt-8 border-t border-neutral-700"></div>
                                    </div>
                                </div>
                            </div>
                        } else {
                            return <></>
                        }
                    }
                }
            })()}
        </div>
    </Layout>
}

function MovieQuickInfo({ label, value }) {
    return <div className="movie__quickinfo pr-4">
        <div className="movie__quickinfo-label text-neutral-500 text-xs uppercase tracking-wide font-semibold">{label}</div>
        <div className="movie__quickinfo-value text-neutral-100 text-base mt-1">{value}</div>
    </div>
}
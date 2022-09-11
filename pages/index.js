import useAxios from 'axios-hooks';
import React, { useEffect } from 'react'
import { ChevronLeft, ChevronRight, SearchIcon } from '../components/Icons';
import Layout from '../components/Layout';
import { AppContext } from '../lib/reactContexts';

function homepageReducer(state, action) {
    switch (action.type) {
        case "changeSearchTerm":
            return {
                searchTerm: action.payload
            }
        case "successSearching":
            return {
                movies: action.successSearching && action.successSearching.results
            }
        default:
            throw new Error('Unknown reducer action');
    }
}

export default function Homepage() {
    const [state, dispatch] = React.useReducer(homepageReducer, {
        movies: null,
        searchTerm: ""
    });

    const [{
        data: successSearching,
        loading: isSearching,
        error: errorSearching },
        searchMovies
    ] = useAxios(
        {
            url: '/api/searchMovies',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
            },
            data: JSON.stringify({
                searchTerm: state.searchTerm
            })
        },
        { manual: true }
    )

    function handleChangeSearchTerm(event) {
        event && event.preventDefault();
        dispatch({
            type: "changeSearchTerm",
            payload: event.target.value
        })
    }

    useEffect(function onSearchTermChanged() {
        if (state.searchTerm && state.searchTerm.length > 0) {
            searchMovies();
        }
    }, [
        state.searchTerm
    ])

    useEffect(function onSearchResultsChanged() {
        if (successSearching) {
            console.log("successSearching", successSearching.data);
            dispatch({
                type: "successSearching",
                payload: successSearching.data
            })
        }
    }, [
        successSearching
    ])

    return <>
        <div className="bg-black min-h-screen min-w-screen">
            <AppContext.Provider value={{ appState: state }}>
                <Layout>
                    <div className="w-full py-4 px-8">
                        <div className="">
                            <div className="flex items-center">
                                <div className="text-white text-opacity-50 fill-current mr-4"><ChevronLeft /></div>
                                <div className="text-white text-opacity-50 fill-current mr-6"><ChevronRight /></div>
                                <div className="relative">
                                    <div className="absolute left-0 top-0 h-full flex items-center pl-5 text-white fill-current"><SearchIcon /></div>
                                    <input
                                        onChange={handleChangeSearchTerm}
                                        className="w-96 bg-white bg-opacity-10 rounded-full w-96 pr-4 pl-14 py-4 placeholder-neutral-500 text-white text-sm" placeholder="What do you want to watch?" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-white px-8 py-4">
                        {(() => {
                            if (state.movies !== null) {
                                if (state.movies.length === 0) {
                                    return <>No movies found</>
                                } else {
                                    return <div className="grid grid-cols-4 gap-4">
                                        {state.movies.map(movie =>
                                            <div>
                                                <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} />
                                            </div>
                                        )}
                                    </div>
                                }
                            }
                        })()}
                    </div>
                </Layout>
            </AppContext.Provider>
        </div>
    </>
}
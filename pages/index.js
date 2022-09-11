import useAxios from 'axios-hooks';
import React, { useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight, CrossIcon, SearchIcon } from '../components/Icons';
import Layout from '../components/Layout';
import { AppContext } from '../lib/reactContexts';
import debounce from 'lodash.debounce';
import { MovieThumbnail, MovieThumbnailSkeleton } from '../components/MovieThumbnail';

function homepageReducer(state, action) {
    switch (action.type) {
        case "changeSearchTerm":
            return {
                ...state,
                searchTerm: action.payload
            }
        case "successSearching":
            return {
                ...state,
                foundMovies: action.payload.results || []
            }
        case "clearSearch":
            return {
                ...state,
                searchTerm: "",
                foundMovies: null
            }
        default:
            throw new Error('Unknown reducer action');
    }
}

export default function Homepage() {
    const searchInputRef = React.createRef();
    const [state, dispatch] = React.useReducer(homepageReducer, {
        foundMovies: null,
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

    const debouncedHandleSearchTerm = debounce(handleChangeSearchTerm, 300);

    function handleForceSearch(event) {
        event && event.preventDefault();
        if (state.searchTerm && state.searchTerm.length > 0) {
            searchMovies();
        }
    }

    function handleClearSearch(event) {
        event && event.preventDefault();
        dispatch({
            type: "clearSearch",
            payload: ""
        })
        searchInputRef.current.value = "";
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
                                    <form>
                                        <button onClick={handleForceSearch} className="absolute left-0 top-0 h-full flex items-center pl-5 text-white fill-current">
                                            <SearchIcon />
                                        </button>
                                        <input type="text"
                                            defaultValue={state.searchTerm}
                                            ref={searchInputRef}
                                            onChange={debouncedHandleSearchTerm}
                                            className="w-96 bg-white bg-opacity-10 rounded-full w-96 pr-4 pl-14 py-4 placeholder-neutral-500 text-white text-sm" placeholder="What do you want to watch?" />
                                        {state.searchTerm &&
                                            <button onClick={handleClearSearch} className="absolute right-0 top-0 h-full flex items-center pr-5 text-white fill-current">
                                                <CrossIcon />
                                            </button>}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-white px-8 py-2">
                        {(() => {
                            if (isSearching) {
                                return <div className="grid grid-cols-5 gap-4 place-items-start">
                                    {new Array(10).fill('1').map((item, index) => <MovieThumbnailSkeleton
                                        key={`movie-thumbnail-skeleton-${index}`} />)}
                                </div>
                            } else {
                                if (errorSearching) {
                                    return <>Error searching. Try again.</>
                                } else {
                                    if (state.foundMovies) {
                                        if (state.foundMovies.length === 0) {
                                            return <>No movies found</>
                                        } else {
                                            return <div className="grid grid-cols-5 gap-4 place-items-start">
                                                {state.foundMovies.map(movie => <MovieThumbnail key={movie.id} movie={movie} />)}
                                            </div>
                                        }
                                    } else {
                                        return <></>
                                    }
                                }
                            }

                        })()}
                    </div>
                </Layout>
            </AppContext.Provider>
        </div>
    </>
}
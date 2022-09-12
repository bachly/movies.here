import useAxios from 'axios-hooks';
import React, { useCallback, useContext, useEffect } from 'react'
import { ChevronLeft, ChevronRight, CrossIcon, SearchIcon } from '../components/Icons';
import Layout from '../components/Layout';
import { AppContext } from '../lib/reactContexts';
import debounce from 'lodash.debounce';
import { MovieThumbnail, MovieThumbnailSkeleton } from '../components/MovieThumbnail';

function homepageReducer(state, action) {
    switch (action.type) {
        case "successSearching":
            return {
                ...state,
                foundMovies: action.payload.results || []
            }
        case "clearSearch":
            return {
                ...state,
                foundMovies: null
            }
        default:
            throw new Error('Unknown reducer action');
    }
}

export default function Homepage() {
    const searchInputRef = React.createRef();
    const { appState, dispatchAppAction } = useContext(AppContext);
    const [state, dispatch] = React.useReducer(homepageReducer, {
        foundMovies: null,
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
                searchTerm: appState.searchTerm
            })
        },
        { manual: true }
    )

    function handleChangeSearchTerm(event) {
        event && event.preventDefault();
        dispatchAppAction({
            type: "changeSearchTerm",
            payload: event.target.value
        })
    }

    const debouncedHandleSearchTerm = debounce(handleChangeSearchTerm, 300);

    function handleForceSearch(event) {
        event && event.preventDefault();
        if (appState.searchTerm && appState.searchTerm.length > 0) {
            searchMovies();
        }
    }

    function handleClearSearch(event) {
        event && event.preventDefault();
        dispatchAppAction({
            type: "clearSearch",
            payload: ""
        })
        searchInputRef.current.value = "";
    }

    useEffect(function onSearchTermChanged() {
        if (appState.searchTerm && appState.searchTerm.length > 0) {
            searchMovies();
        }
    }, [
        appState.searchTerm
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
        <Layout>
            <div className="w-full py-6 px-12">
                <div className="">
                    <div className="flex items-center">
                        <div className="relative">
                            <form>
                                <button onClick={handleForceSearch} className="absolute left-0 top-0 h-full flex items-center pl-5 text-white fill-current">
                                    <SearchIcon />
                                </button>
                                <input type="text"
                                    defaultValue={appState.searchTerm}
                                    ref={searchInputRef}
                                    onChange={debouncedHandleSearchTerm}
                                    className="w-96 bg-white bg-opacity-10 rounded-full w-80 pr-4 pl-14 py-3 placeholder-neutral-500 text-white text-sm" placeholder="What do you want to watch?" />
                                {appState.searchTerm &&
                                    <button onClick={handleClearSearch} className="absolute right-0 top-0 h-full flex items-center pr-5 text-white fill-current">
                                        <CrossIcon />
                                    </button>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-white py-2 px-12">
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
    </>
}
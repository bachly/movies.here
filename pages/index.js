import useAxios from 'axios-hooks';
import React, { useContext, useEffect } from 'react'
import { CrossIcon, SearchIcon } from '../components/Icons';
import Layout from '../components/Layout';
import { AppContext } from '../lib/reactContexts';
import debounce from 'lodash.debounce';
import { MovieThumbnail, MovieThumbnailSkeleton } from '../components/MovieThumbnail';
import { DEBOUNCED_SEARCHING_MILLISECONDS } from '../lib/constants';
import Container from '../components/Container';

export default function Homepage() {
    const searchInputRef = React.createRef();
    const { appState, dispatchAppAction } = useContext(AppContext);

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
                searchTerm: appState.searchTerm,
                page: 1
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

    const debouncedHandleSearchTerm = debounce(handleChangeSearchTerm, DEBOUNCED_SEARCHING_MILLISECONDS);

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
            dispatchAppAction({
                type: "setFoundMovies",
                payload: successSearching.data && successSearching.data.results || []
            })
        }
    }, [
        successSearching
    ])

    return <>
        <Layout>
            <Container>
                <div className="my-4 flex items-center">
                    <form className="relative">
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
            </Container>

            <Container>
                {(() => {
                    if (isSearching) {
                        return <div className="grid grid-cols-5 gap-4 place-items-start">
                            {new Array(10).fill('1').map((item, index) => <MovieThumbnailSkeleton
                                key={`movie-thumbnail-skeleton-${index}`} />)}
                        </div>
                    } else {
                        if (errorSearching) {
                            return <div className="text-neutral-400">Error searching. Try again.</div>
                        } else {
                            if (appState.foundMovies) {
                                if (appState.foundMovies.length === 0) {
                                    return <>No movies found</>
                                } else {
                                    return <div className="grid grid-cols-5 gap-4 place-items-start">
                                        {appState.foundMovies.map(movie => <MovieThumbnail key={movie.id} movie={movie} />)}
                                    </div>
                                }
                            } else {
                                return <></>
                            }
                        }
                    }

                })()}
            </Container>
        </Layout>
    </>
}
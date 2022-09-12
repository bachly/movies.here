import useAxios from 'axios-hooks';
import React, { useContext, useEffect } from 'react'
import { CrossIcon, MenuIcon, SearchIcon } from '../components/Icons';
import Layout from '../components/Layout';
import { AppContext } from '../lib/reactContexts';
import debounce from 'lodash.debounce';
import { MovieThumbnail, MovieThumbnailSkeleton } from '../components/MovieThumbnail';
import { DEBOUNCED_SEARCHING_MILLISECONDS } from '../lib/constants';
import Container from '../components/Container';
import TrendinMediaSection from '../components/TrendingMediaSection';

export default function Homepage() {
    const searchInputRef = React.createRef();
    const [pageState, setPageState] = React.useState({
        showSidebar: false
    })
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

    const debouncedHandleSearchTerm = debounce(function handleChangeSearchTerm(event) {
        event && event.preventDefault();
        dispatchAppAction({
            type: "changeSearchTerm",
            payload: event.target.value
        })
    }, DEBOUNCED_SEARCHING_MILLISECONDS);

    function handleSubmitSearchForm(event) {
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

    function toggleSidebar() {
        setPageState({
            ...pageState,
            showSidebar: !pageState.showSidebar
        })
    }

    return <>
        <Layout showSidebar={pageState.showSidebar}>
            <Container>
                <div className="my-6 flex items-center">
                    <form onSubmit={handleSubmitSearchForm} className="w-full lg:w-auto relative h-10">

                        <div className="">
                            <button type="submit" className="absolute left-0 top-0 h-full flex items-center pl-4 text-neutral-300 fill-current">
                                <SearchIcon />
                            </button>
                        </div>

                        <input type="text"
                            defaultValue={appState.searchTerm}
                            ref={searchInputRef}
                            onChange={debouncedHandleSearchTerm}
                            className="bg-neutral-800 shadow-xl rounded-lg h-full w-full md:w-80 pr-4 pl-12 md:pl-14 placeholder-neutral-500 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Search movie" />
                        
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
                        return <div className="grid grid-cols-2 xl:grid-cols-5 gap-2 lg:gap-4 place-items-start">
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
                                    return <div className="grid grid-cols-2 xl:grid-cols-5 gap-2 lg:gap-4 place-items-start">
                                        {appState.foundMovies.map(movie => <MovieThumbnail key={movie.id} movie={movie} />)}
                                    </div>
                                }
                            } else {
                                return <div className="mt-8">
                                    <TrendinMediaSection mediaType="movie" title="Trending Movies This Week" />
                                    <TrendinMediaSection mediaType="movie" timeWindow="day" title="Popular Movies Today" />
                                </div>
                            }
                        }
                    }
                })()}
            </Container>
        </Layout>
    </>
}
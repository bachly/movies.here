import { useRouter } from "next/router";
import { useContext, useEffect, useReducer } from "react";
import Container from "../../components/Container";
import HeaderWithoutSearch from "../../components/HeaderWithoutSearch";
import Layout from "../../components/Layout";
import { MovieThumbnail } from "../../components/MovieThumbnail";
import { AppContext } from "../../lib/reactContexts";

function watchlistPageReducer(state, action) {
    switch (action.type) {
        case "routerReady":
            return {
                ...state,
                watchlistId: action.payload
            }
        default:
            throw new Error('Unknown reducer action');
    }
}

export default function WatchlistPage() {
    const { appState, dispatchAppAction } = useContext(AppContext);
    const [state, dispatch] = useReducer(watchlistPageReducer, {
        watchlistId: null
    });
    const router = useRouter();

    useEffect(() => {
        if (router && router.query) {
            dispatch({
                type: "routerReady",
                payload: router.query.id || 0
            })
        }
    }, [router])

    return <Layout>
        <div className="relative">
            <HeaderWithoutSearch />

            <Container>
                <h1 className="my-12 text-white text-6xl font-bold">Watchlist</h1>
            </Container>
        </div>

        <Container>
            {(() => {
                if (appState.watchlist && appState.watchlist[state.watchlistId]) {
                    const movies = appState.watchlist[state.watchlistId].movies;
                    return <div className="grid grid-cols-5 gap-4 place-items-start">
                        {Object.keys(movies).map(movieId => <MovieThumbnail key={movieId} movie={movies[movieId]} />)}
                    </div>
                } else {
                    return <div className="text-neutral-400">There is no movies in this watchlist.</div>
                }
            })()}
        </Container>
    </Layout>
}
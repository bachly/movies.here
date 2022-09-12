import "../styles/globals.css";
import '../styles/main.scss'
import { AppContext } from '../lib/reactContexts';
import { useEffect, useReducer } from 'react';
import TrendinMediaSection from "../components/TrendingMediaSection";

function appReducer(state, action) {
  switch (action.type) {
    case "changeSearchTerm":
      return {
        ...state,
        searchTerm: action.payload
      }
    case "clearSearch":
      return {
        ...state,
        searchTerm: "",
        foundMovies: null
      }
    case "setFoundMovies":
      return {
        ...state,
        foundMovies: action.payload
      }
    case "setTrendingMedia":
      return {
        ...state,
        trendingMedia: {
          ...state.trendingMedia,
          [action.payload.mediaGroup]: action.payload.items
        }
      }
    case "addToWatchlist":
      const watchlist = state.watchlist[action.payload.watchlistId];
      let updatedWatchlist;

      if (!watchlist) {
        updatedWatchlist = {
          movies: {
            [action.payload.movie.id]: action.payload.movie
          }
        }
      } else {
        updatedWatchlist = {
          ...watchlist,
          movies: {
            ...watchlist.movies,
            [action.payload.movie.id]: action.payload.movie
          }
        }
      }

      return {
        ...state,
        watchlist: {
          ...state.watchlist,
          [action.payload.watchlistId]: updatedWatchlist
        }
      }

    case "removeFromWatchlist":
      const existingWatchlist = state.watchlist[action.payload.watchlistId];
      delete existingWatchlist.movies[action.payload.movie.id];

      return {
        ...state,
        watchlist: {
          ...state.watchlist,
          [action.payload.watchlistId]: existingWatchlist
        }
      }

    default:
      throw new Error('Unknown reducer action');
  }
}

function App({ Component, pageProps }) {
  const [appState, dispatchAppAction] = useReducer(appReducer, {
    searchTerm: "",
    foundMovies: null,
    trendingMovies: null,
    watchlist: typeof window !== "undefined" && JSON.parse(localStorage.getItem('watchlist')) || {}
  })

  useEffect(function watchlistChanged() {
    if (appState.watchlist) {
      if (typeof window !== "undefined") {
        localStorage.setItem('watchlist', JSON.stringify(appState.watchlist));
      }
    }
  }, [appState.watchlist])

  return (
    <AppContext.Provider value={{ appState, dispatchAppAction }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default App